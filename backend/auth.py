import hashlib
import hmac
import json
import secrets
import sqlite3
import time
from contextlib import contextmanager

ITERATIONS = 600_000
SESSION_SECONDS = 7 * 24 * 60 * 60


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), ITERATIONS)
    return f"pbkdf2_sha256${ITERATIONS}${salt}${digest.hex()}"


def password_matches(password, stored):
    _, iterations, salt, expected = stored.split("$")
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), int(iterations))
    return hmac.compare_digest(digest.hex(), expected)


class Accounts:
    def __init__(self, path):
        self.path = str(path)
        self.dummy_hash = password_hash(secrets.token_urlsafe(32))
        with self.connect() as db:
            columns = {row[1] for row in db.execute("PRAGMA table_info(users)")}
            if columns and "username" not in columns:
                db.execute("ALTER TABLE users RENAME TO users_legacy")
                db.execute("ALTER TABLE sessions RENAME TO sessions_legacy")
            db.executescript("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                    password_hash TEXT NOT NULL,
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS states (
                    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                    state TEXT NOT NULL,
                    updated_at INTEGER NOT NULL
                );
            """)

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys=ON")
        try:
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def public(user):
        return {key: user[key] for key in ("id", "username", "created_at")}

    def register(self, username, password):
        with self.connect() as db:
            cursor = db.execute(
                "INSERT INTO users(username,password_hash,created_at) VALUES(?,?,?)",
                (username, password_hash(password), int(time.time())),
            )
            user = db.execute("SELECT * FROM users WHERE id=?", (cursor.lastrowid,)).fetchone()
        return self.public(user)

    def login(self, username, password):
        with self.connect() as db:
            user = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
        valid = password_matches(password, user["password_hash"] if user else self.dummy_hash)
        return self.public(user) if user and valid else None

    def create_session(self, user_id, previous=None):
        token = secrets.token_urlsafe(32)
        now = int(time.time())
        with self.connect() as db:
            db.execute("DELETE FROM sessions WHERE expires_at<=?", (now,))
            if previous:
                db.execute("DELETE FROM sessions WHERE token_hash=?", (self.token_hash(previous),))
            db.execute("INSERT INTO sessions VALUES(?,?,?)", (self.token_hash(token), user_id, now + SESSION_SECONDS))
        return token

    @staticmethod
    def token_hash(token):
        return hashlib.sha256(token.encode()).hexdigest()

    def current(self, token):
        if not token or len(token) > 128:
            return None
        with self.connect() as db:
            user = db.execute(
                "SELECT u.* FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?",
                (self.token_hash(token), int(time.time())),
            ).fetchone()
        return self.public(user) if user else None

    def logout(self, token):
        with self.connect() as db:
            db.execute("DELETE FROM sessions WHERE token_hash=?", (self.token_hash(token or ""),))

    def get_state(self, user_id):
        with self.connect() as db:
            row = db.execute("SELECT state FROM states WHERE user_id=?", (user_id,)).fetchone()
        return json.loads(row["state"]) if row else {}

    def set_state(self, user_id, state):
        with self.connect() as db:
            db.execute(
                "INSERT INTO states(user_id,state,updated_at) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET state=excluded.state,updated_at=excluded.updated_at",
                (user_id, json.dumps(state, ensure_ascii=False), int(time.time())),
            )
