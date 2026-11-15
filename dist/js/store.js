const LOCAL_KEY = "acustik.ydc.v1";

const blank = () => ({ favorites: [], attempts: {} });

function safeParse(value) {
  try {
    const parsed = JSON.parse(value || "null");
    return parsed && typeof parsed === "object" ? { ...blank(), ...parsed } : blank();
  } catch {
    return blank();
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-Acustik-Request": "1", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export const Store = {
  user: null,
  state: safeParse(localStorage.getItem(LOCAL_KEY)),

  async init() {
    try {
      const me = await request("/api/auth/me");
      this.user = me.user;
      const remote = await request("/api/state");
      if (remote.state && Object.keys(remote.state).length) {
        this.state = { ...blank(), ...remote.state };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(this.state));
      } else if (this.state.favorites.length || Object.keys(this.state.attempts).length) {
        await this.saveRemote();
      }
    } catch {
      this.user = null;
    }
    return this;
  },

  async saveRemote() {
    if (!this.user) return;
    try {
      await request("/api/state", { method: "PUT", body: JSON.stringify({ state: this.state }) });
    } catch {
      // The guest copy remains available even if the optional account server is offline.
    }
  },

  save() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(this.state));
    this.saveRemote();
    window.dispatchEvent(new CustomEvent("acustik:state"));
  },

  isFavorite(id) {
    return this.state.favorites.includes(id);
  },

  toggleFavorite(id) {
    const index = this.state.favorites.indexOf(id);
    if (index >= 0) this.state.favorites.splice(index, 1);
    else this.state.favorites.push(id);
    this.save();
    return this.isFavorite(id);
  },

  recordAttempt(id, score, total) {
    const entry = { score, total, date: new Date().toISOString() };
    if (!this.state.attempts[id]) this.state.attempts[id] = [];
    this.state.attempts[id].unshift(entry);
    this.state.attempts[id] = this.state.attempts[id].slice(0, 20);
    this.save();
    return entry;
  },

  attempts(id) {
    return this.state.attempts[id] || [];
  }
};

export const Auth = {
  get user() { return Store.user; },
  async init() { await Store.init(); },
  async register(username, password) {
    const result = await request("/api/auth/register", { method: "POST", body: JSON.stringify({ username, password }) });
    Store.user = result.user;
    await Store.saveRemote();
    window.dispatchEvent(new CustomEvent("acustik:state"));
    return result.user;
  },
  async login(username, password) {
    const result = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
    Store.user = result.user;
    const remote = await request("/api/state");
    if (remote.state && Object.keys(remote.state).length) Store.state = { ...blank(), ...remote.state };
    await Store.saveRemote();
    window.dispatchEvent(new CustomEvent("acustik:state"));
    return result.user;
  },
  async logout() {
    await request("/api/auth/logout", { method: "POST", body: "{}" });
    Store.user = null;
    window.dispatchEvent(new CustomEvent("acustik:state"));
  }
};
