import http.client
import json
from pathlib import Path
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

from backend.auth import Accounts
from backend.server import AppServer


class AuthTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.database = Path(cls.temp.name) / "test.sqlite3"
        cls.server = AppServer(("127.0.0.1", 0), cls.database)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def setUp(self):
        with self.server.accounts.connect() as db:
            db.execute("DELETE FROM sessions")
            db.execute("DELETE FROM states")
            db.execute("DELETE FROM users")
        self.server.attempts.clear()

    def request(self, path, data=None, cookie=None, origin=None, raw=None, method=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=10)
        headers = {}
        body = None
        if data is not None or raw is not None:
            body = raw if raw is not None else json.dumps(data)
            headers.update({"Content-Type": "application/json", "X-Acustik-Request": "1", "Origin": origin or f"http://localhost:{self.server.server_port}"})
        if cookie:
            headers["Cookie"] = cookie
        conn.request(method or ("POST" if body is not None else "GET"), path, body, headers)
        response = conn.getresponse()
        payload = response.read()
        result = (response.status, dict(response.getheaders()), json.loads(payload) if response.getheader("Content-Type", "").startswith("application/json") else payload)
        conn.close()
        return result

    def register(self):
        return self.request("/api/auth/register", {"username": "Explorer", "password": "space password 2026"})

    def test_register_login_logout(self):
        status, headers, result = self.register()
        self.assertEqual(status, 201)
        self.assertEqual(result["user"]["username"], "Explorer")
        self.assertNotIn("password_hash", result["user"])
        self.assertIn("HttpOnly", headers["Set-Cookie"])
        self.assertIn("SameSite=Lax", headers["Set-Cookie"])
        cookie = headers["Set-Cookie"].split(";")[0]
        self.assertEqual(self.request("/api/auth/me", cookie=cookie)[2]["user"], result["user"])
        status, headers, _ = self.request("/api/auth/login", {"username": "explorer", "password": "space password 2026"}, cookie=cookie)
        self.assertEqual(status, 200)
        self.assertEqual(self.request("/api/auth/me", cookie=cookie)[0], 401)
        cookie = headers["Set-Cookie"].split(";")[0]
        status, headers, _ = self.request("/api/auth/logout", {}, cookie=cookie)
        self.assertEqual(status, 200)
        self.assertIn("Max-Age=0", headers["Set-Cookie"])
        self.assertEqual(self.request("/api/auth/me", cookie=cookie)[0], 401)

    def test_hashes_persistence_and_state(self):
        _, headers, _ = self.register()
        with self.server.accounts.connect() as db:
            stored = db.execute("SELECT password_hash FROM users").fetchone()[0]
            token = db.execute("SELECT token_hash FROM sessions").fetchone()[0]
        self.assertTrue(stored.startswith("pbkdf2_sha256$600000$"))
        self.assertNotIn("space password", stored)
        self.assertNotEqual(token, headers["Set-Cookie"].split(";")[0].split("=", 1)[1])
        restarted = Accounts(self.database)
        self.assertIsNotNone(restarted.login("EXPLORER", "space password 2026"))
        state = {"favorites": ["spirit"], "attempts": {"spirit": [{"score": 6, "total": 6, "date": "2026-11-14T00:00:00Z"}]}}
        cookie = headers["Set-Cookie"].split(";")[0]
        self.assertEqual(self.request("/api/state", {"state": state}, cookie=cookie, method="PUT")[0], 200)
        self.assertEqual(self.request("/api/state", cookie=cookie)[2]["state"], state)

    def test_duplicate_and_validation(self):
        self.assertEqual(self.register()[0], 201)
        self.assertEqual(self.register()[0], 409)
        for change in [{"username": "a"}, {"username": "bad<script>"}, {"password": "short"}, {"password": " " * 20}, {"password": "x" * 129}]:
            payload = {"username": "Explorer", "password": "another space phrase"}
            payload.update(change)
            self.assertEqual(self.request("/api/auth/register", payload)[0], 400)

    def test_unauthorized_and_expiry(self):
        _, headers, _ = self.register()
        for username in ["Explorer", "Unknown"]:
            status, _, result = self.request("/api/auth/login", {"username": username, "password": "wrong wrong"})
            self.assertEqual((status, result["error"]), (401, "invalid_credentials"))
        self.assertEqual(self.request("/api/auth/me")[0], 401)
        self.assertEqual(self.request("/api/auth/me", cookie="acustik_session=forged")[0], 401)
        self.assertEqual(self.request("/api/state")[0], 401)
        with self.server.accounts.connect() as db:
            db.execute("UPDATE sessions SET expires_at=?", (int(time.time()) - 1,))
        self.assertEqual(self.request("/api/auth/me", cookie=headers["Set-Cookie"].split(";")[0])[0], 401)

    def test_origin_json_and_rate_limit(self):
        self.assertEqual(self.request("/api/auth/logout", {}, origin="https://evil.example")[0], 403)
        self.assertEqual(self.request("/api/auth/login", raw="{broken")[0], 400)
        self.assertEqual(self.request("/api/auth/login", raw="[]")[0], 400)
        self.assertEqual(self.request("/api/auth/login", raw="x" * 9000)[0], 413)
        for _ in range(12):
            self.request("/api/auth/login", {"username": "bad"})
        status, headers, _ = self.request("/api/auth/login", {"username": "bad"})
        self.assertEqual(status, 429)
        self.assertEqual(headers["Retry-After"], "900")

    def test_static_private_files_and_removed_sections(self):
        for path in ["/", "/info.html", "/login.html", "/register.html", "/account.html"]:
            self.assertEqual(self.request(path)[0], 200)
        for path in ["/data/acustik.sqlite3", "/backend/auth.py", "/js/", "/sources.html", "/acustik.html", "/js/acustik.js", "/js/sources.js"]:
            self.assertEqual(self.request(path)[0], 404)
        status, _, result = self.request("/api/chat", {"message": "What was Ingenuity?"})
        self.assertEqual((status, result["error"]), (404, "not_found"))

    def test_asset_cache_does_not_cache_api(self):
        self.assertEqual(self.request("/api/auth/me")[1]["Cache-Control"], "no-store")
        self.assertEqual(self.request("/index.html")[1]["Cache-Control"], "no-cache")
        self.assertEqual(self.request("/assets/missions/apollo-lm.svg")[1]["Cache-Control"], "public, max-age=86400")

    def test_render_origin_and_health(self):
        self.assertEqual(self.request('/health')[0], 200)
        with patch.dict('os.environ', {'PUBLIC_ORIGIN': 'https://exspace.onrender.com'}):
            status, headers, _ = self.request('/api/auth/register',
                {'username': 'RenderExplorer', 'password': 'space password 2026'},
                origin='https://exspace.onrender.com')
            self.assertEqual(status, 201)
            self.assertIn('; Secure', headers['Set-Cookie'])
            self.assertEqual(self.request('/api/auth/logout', {}, origin='https://evil.example')[0], 403)


if __name__ == "__main__":
    unittest.main()
