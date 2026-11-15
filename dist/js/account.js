import { comics } from './comics-data.js';
const missions = comics.map(c => ({...c, name:c.title}));
import { initPage, escapeHtml, $ } from "./app.js";
import { Store, Auth } from './store.js';

function show(target, message, ok = false) {
  const box = $(target);
  box.textContent = message;
  box.className = `notice ${ok ? "ok" : "error"}`;
  box.hidden = false;
}

async function submit(path, form) {
  const username = form.username.value.trim();
  const password = form.password.value;
  try {
    if (path === "register") await Auth.register(username, password);
    else await Auth.login(username, password);
    location.href = "account.html";
  } catch (error) {
    show("#message", error.message || "The account service is unavailable. The site still works as a guest.");
  }
}

await initPage();
const login = $("#login-form");
const register = $("#register-form");
const account = $("#account-page");
if (login) login.addEventListener("submit", (event) => { event.preventDefault(); submit("login", login); });
if (register) register.addEventListener("submit", (event) => { event.preventDefault(); submit("register", register); });
if (account) {
  if (!Auth.user) {
    account.innerHTML = `<div class="notice">You are using the site as a guest. Favorites and quiz results stay in this browser.</div><div class="hero-actions"><a class="btn primary" href="login.html">Sign in</a><a class="btn" href="register.html">Create account</a></div>`;
  } else {
    $("#username").textContent = Auth.user.username;
    $("#favorites").innerHTML = Store.state.favorites.length ? Store.state.favorites.map((id) => {
      const mission = missions.find((item) => item.id === id);
      return mission ? `<a class="result" href="detail.html?id=${mission.id}"><b>${escapeHtml(mission.name)}</b></a>` : "";
    }).join("") : `<div class="result">No favorites yet.</div>`;
    const attempts = Object.entries(Store.state.attempts).flatMap(([id, list]) => list.map((attempt) => ({ ...attempt, mission: missions.find((item) => item.id === id)?.name || id })));
    $("#attempts").innerHTML = attempts.length ? attempts.map((attempt) => `<div class="result"><b>${escapeHtml(attempt.mission)}</b>: ${attempt.score}/${attempt.total}<br>${new Date(attempt.date).toLocaleString()}</div>`).join("") : `<div class="result">No quiz attempts yet.</div>`;
    $("#logout").addEventListener("click", async () => { await Auth.logout(); location.reload(); });
  }
}
