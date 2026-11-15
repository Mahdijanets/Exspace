import { missions } from "./data.js";
import { Store, Auth } from "./store.js";

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

export function missionById(id) {
  return missions.find((mission) => mission.id === id);
}

export function param(name) {
  return new URLSearchParams(location.search).get(name);
}

export function favoriteButton(id) {
  const active = Store.isFavorite(id);
  return `<button class="heart ${active ? "active" : ""}" type="button" data-favorite="${id}" aria-label="${active ? "Remove from" : "Add to"} favorites">♥</button>`;
}

export function bindFavorites(root = document) {
  $$('[data-favorite]', root).forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      const active = Store.toggleFavorite(button.dataset.favorite);
      button.classList.toggle("active", active);
      button.setAttribute("aria-label", `${active ? "Remove from" : "Add to"} favorites`);
    });
  });
}

export async function initPage() {
  await Auth.init();
  const account = $("[data-account-link]");
  if (account) {
    account.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
    const label = Auth.user ? `Account: ${Auth.user.username}` : 'Sign in';
    account.setAttribute('aria-label', label);
    account.title = label;
  }
  if (account) account.href = Auth.user ? 'account.html' : 'login.html';
  const register = $('[data-register-link]');
  if (register) register.hidden = Boolean(Auth.user);
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
  bindFavorites();
  window.addEventListener("acustik:state", () => bindFavorites());
}
