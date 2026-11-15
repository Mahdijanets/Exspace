import {copy} from './content.js';

const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
  book: '<path d="M12 7C9.5 5 6 4.5 3 5v14c3-.5 6.5 0 9 2 2.5-2 6-2.5 9-2V5c-3-.5-6.5 0-9 2Z"/><path d="M12 7v14M6 9l3 1m-3 3 3 1"/><path d="m17 8 .6 1.4L19 10l-1.4.6L17 12l-.6-1.4L15 10l1.4-.6Z"/>',
  rocket: '<path d="M14 4c2-1 4-1 6-1 0 2 0 4-1 6l-7 8-5-5Z"/><path d="m8 10-4 1-2 4 5-1m7 2-1 5 4-2 1-4M7 17l-3 3"/><circle cx="15" cy="8" r="1.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
};
export const headerIcon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;

export function headerMarkup(page) {
  const t = key => copy[key];
  const links = [
    ['home', 'index.html', 'navHome', 'home'],
    ['solar', 'solar.html', 'navExplore', 'compass'],
    ['stories', 'stories.html', 'navStories', 'book'],
    ['missions', 'missions.html', 'navMissions', 'rocket']
  ];
  return `<form class="header-ask" id="ask-acustik" aria-label="${t('askLabel')}">
      <div class="header-ask-field">
        <img class="header-mascot" src="assets/mascot/akustik_avatar.svg" width="34" height="34" alt="${t('mascotName')}" decoding="async">
        <label class="visually-hidden" for="ask-question">${t('askLabel')}</label>
        <input id="ask-question" name="question" type="text" maxlength="1000" required autocomplete="off" placeholder="${t('askPlaceholder')}" aria-describedby="ask-status">
        <button type="submit" class="header-ask-submit" aria-label="${t('askSubmit')}">${headerIcon('search')}</button>
      </div>
      <p id="ask-status" class="header-ask-status" role="status" aria-live="polite"></p>
    </form>
    <nav class="site-nav" id="site-navigation" aria-label="${t('navLabel')}">
      ${links.map(([key, href, label, icon]) => `<a href="${href}"${page === key ? ' aria-current="page"' : ''}>${headerIcon(icon)}<span>${t(label)}</span></a>`).join('')}
    </nav>
    <div class="header-actions">
      <a class="auth-link" id="header-access" href="login.html">${t('signIn')}</a>
      <button class="header-menu-toggle" id="header-menu-toggle" type="button" aria-label="${t('menuLabel')}" aria-controls="site-navigation" aria-expanded="false">${headerIcon('menu')}</button>
    </div>`;
}

export function renderHeader(page) {
  const header = document.querySelector('header.header');
  if (!header) return;
  header.innerHTML = headerMarkup(page);

  const nav = document.getElementById('site-navigation');
  const toggle = document.getElementById('header-menu-toggle');
  const mobile = matchMedia('(max-width: 1179px)');
  const setMenu = open => {
    nav.hidden = mobile.matches && !open;
    toggle.setAttribute('aria-expanded', String(mobile.matches && open));
  };
  setMenu(false);
  toggle.onclick = () => setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  mobile.addEventListener('change', () => setMenu(false));
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (mobile.matches && !nav.hidden) { setMenu(false); toggle.focus(); }
      document.getElementById('ask-status').textContent = '';
    }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });

  const form = document.getElementById('ask-acustik');
  const question = document.getElementById('ask-question');
  const status = document.getElementById('ask-status');
  question.addEventListener('input', () => { status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = question.value.trim();
    if (!value) { question.focus(); return; }
    // Future integrations may handle this event; no AI/API handler exists yet.
    const request = new CustomEvent('acustik:question', {bubbles: true, cancelable: true, detail: {question: value}});
    if (form.dispatchEvent(request)) status.textContent = copy.askUnavailable;
  });
}
