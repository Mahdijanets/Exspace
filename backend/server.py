import argparse
from collections import defaultdict, deque
from http import HTTPStatus
from http.cookies import CookieError, SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import sqlite3
import threading
import time
from urllib.parse import urlsplit

from backend.auth import Accounts, SESSION_SECONDS
from backend.akustik import answer

ROOT = Path(__file__).resolve().parent.parent
COOKIE = "acustik_session"


class AppServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, database):
        self.accounts = Accounts(database)
        self.attempts = defaultdict(deque)
        self.rate_lock = threading.Lock()
        self.chat_attempts = defaultdict(deque)
        self.chat_slots = threading.BoundedSemaphore(3)
        super().__init__(address, Handler)

    def allowed_attempt(self, address):
        now = time.monotonic()
        with self.rate_lock:
            attempts = self.attempts[address]
            while attempts and attempts[0] < now - 900:
                attempts.popleft()
            if len(attempts) >= 12:
                return False
            attempts.append(now)
            return True


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "dist"), **kwargs)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        path = urlsplit(self.path).path
        self.send_header("X-Frame-Options", "SAMEORIGIN" if path == "/games/space-flight.html" else "DENY")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        if path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        elif path.startswith("/assets/"):
            self.send_header("Cache-Control", "public, max-age=86400")
        else:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def list_directory(self, path):
        self.send_error(HTTPStatus.NOT_FOUND)
        return None

    def token(self):
        try:
            cookie = SimpleCookie(self.headers.get("Cookie", ""))
            return cookie[COOKIE].value if COOKIE in cookie else None
        except CookieError:
            return None

    def user(self):
        return self.server.accounts.current(self.token())

    def reply(self, status, data, token=None, clear=False):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        if token is not None or clear:
            age = 0 if clear else SESSION_SECONDS
            secure = '; Secure' if os.environ.get('PUBLIC_ORIGIN', os.environ.get('RENDER_EXTERNAL_URL', '')).startswith('https://') else ''
            self.send_header("Set-Cookie", f'{COOKIE}={token or ""}; Path=/; Max-Age={age}; HttpOnly; SameSite=Lax{secure}')
        if status == 429:
            self.send_header("Retry-After", "900")
        self.end_headers()
        self.wfile.write(payload)

    def valid_mutation(self):
        origin = urlsplit(self.headers.get("Origin", ""))
        public = os.environ.get('PUBLIC_ORIGIN', os.environ.get('RENDER_EXTERNAL_URL', '')).rstrip('/')
        if public:
            allowed = origin.scheme in ('http', 'https') and f'{origin.scheme}://{origin.netloc}' == public
        else:
            allowed = origin.scheme in ('http', 'https') and origin.hostname in ('localhost', '127.0.0.1')
        return allowed and self.headers.get('X-Acustik-Request') == '1'

    def json_body(self, limit=65536):
        if self.headers.get_content_type() != "application/json":
            self.reply(415, {"error": "invalid_request"})
            return None
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= limit:
                self.reply(413, {"error": "invalid_request"})
                return None
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError()
            return data
        except (ValueError, UnicodeDecodeError):
            self.reply(400, {"error": "invalid_request"})
            return None

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/health':
            return self.reply(200, {'ok': True})
        if path == "/api/auth/me":
            user = self.user()
            return self.reply(200 if user else 401, {"user": user})
        if path == "/api/state":
            user = self.user()
            if not user:
                return self.reply(401, {"error": "not_signed_in"})
            return self.reply(200, {"state": self.server.accounts.get_state(user["id"])})
        if path.startswith("/api/"):
            return self.reply(404, {"error": "not_found"})
        return super().do_GET()

    def do_PUT(self):
        path = urlsplit(self.path).path
        if path != "/api/state":
            return self.reply(404, {"error": "not_found"})
        if not self.valid_mutation():
            return self.reply(403, {"error": "invalid_origin"})
        user = self.user()
        if not user:
            return self.reply(401, {"error": "not_signed_in"})
        data = self.json_body()
        if data is None:
            return None
        state = data.get("state")
        if not isinstance(state, dict) or not isinstance(state.get("favorites", []), list) or not isinstance(state.get("attempts", {}), dict):
            return self.reply(400, {"error": "invalid_state"})
        self.server.accounts.set_state(user["id"], state)
        return self.reply(200, {"ok": True})

    def do_POST(self):
        path = urlsplit(self.path).path
        if path == '/api/akustik':
            return self.akustik_chat()
        if path not in ("/api/auth/register", "/api/auth/login", "/api/auth/logout"):
            return self.reply(404, {"error": "not_found"})
        if not self.valid_mutation():
            return self.reply(403, {"error": "invalid_origin"})
        data = self.json_body(8192)
        if data is None:
            return None
        if path.endswith("/logout"):
            self.server.accounts.logout(self.token())
            return self.reply(200, {"ok": True}, clear=True)
        if not self.server.allowed_attempt(self.client_address[0]):
            return self.reply(429, {"error": "too_many_attempts"})
        username, password = data.get("username"), data.get("password")
        if not isinstance(username, str) or not isinstance(password, str):
            return self.reply(400, {"error": "invalid_request"})
        username = username.strip()
        if not 2 <= len(username) <= 40 or not re.fullmatch(r"[\w .-]+", username, flags=re.UNICODE) or any(ord(c) < 32 for c in username):
            return self.reply(400, {"error": "invalid_username"})
        if not 8 <= len(password) <= 128 or password.isspace():
            return self.reply(400, {"error": "invalid_password"})
        if path.endswith("/register"):
            try:
                user = self.server.accounts.register(username, password)
            except sqlite3.IntegrityError:
                return self.reply(409, {"error": "username_taken"})
            status = 201
        else:
            user = self.server.accounts.login(username, password)
            if not user:
                return self.reply(401, {"error": "invalid_credentials"})
            status = 200
        token = self.server.accounts.create_session(user["id"], previous=self.token())
        return self.reply(status, {"user": user}, token=token)

    def akustik_chat(self):
        if not self.valid_mutation():
            return self.reply(403, {'error': 'invalid_origin'})
        data = self.json_body(24000)
        if data is None:
            return
        messages = data.get('messages')
        if not isinstance(messages, list) or not 1 <= len(messages) <= 12:
            return self.reply(400, {'error': 'invalid_messages'})
        for item in messages:
            if (not isinstance(item, dict) or item.get('role') not in ('user', 'assistant')
                    or not isinstance(item.get('content'), str)
                    or not 1 <= len(item['content'].strip()) <= 2000):
                return self.reply(400, {'error': 'invalid_messages'})
        if messages[-1]['role'] != 'user':
            return self.reply(400, {'error': 'invalid_messages'})
        with self.server.rate_lock:
            attempts = self.server.chat_attempts[self.client_address[0]]
            now = time.monotonic()
            while attempts and attempts[0] < now - 900:
                attempts.popleft()
            if len(attempts) >= 30:
                return self.reply(429, {'error': 'too_many_attempts'})
            attempts.append(now)
        if not self.server.chat_slots.acquire(blocking=False):
            return self.reply(429, {'error': 'busy'})
        try:
            status, result = answer([{'role': m['role'], 'content': m['content']} for m in messages])
            return self.reply(status, result)
        finally:
            self.server.chat_slots.release()



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=int(os.environ.get('PORT', '5173')))
    parser.add_argument('--host', default='0.0.0.0' if os.environ.get('RENDER') else '127.0.0.1')
    args = parser.parse_args()
    data = Path(os.environ.get('DATA_DIR', str(ROOT / 'data')))
    data.mkdir(parents=True, exist_ok=True)
    server = AppServer((args.host, args.port), data / 'acustik.sqlite3')
    print(f'Acustik Space: http://{args.host}:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
