import { comics } from './comics-data.js';
import { escapeHtml, initPage } from './app.js';

const cards = document.querySelector('#comic-cards');
const search = document.querySelector('#comic-search');
function render() {
  const query = search.value.trim().toLowerCase();
  const found = comics.filter(c => `${c.title} ${c.world}`.toLowerCase().includes(query));
  cards.innerHTML = found.map(c => `<article class="comic-card panel">
    <a class="comic-cover" href="${c.pdf}" target="_blank" rel="noopener" aria-label="Read ${escapeHtml(c.title)} (PDF, opens in a new tab)"><img src="${c.cover}" alt="${escapeHtml(c.title)} comic cover" loading="lazy"></a>
    <div class="comic-body"><p class="card-meta">${c.world} · ${c.pages} pages · PDF</p><h2>${escapeHtml(c.title)}</h2>
    <a class="btn primary" href="${c.pdf}" target="_blank" rel="noopener">Read comic ↗</a>
    <a class="comic-mission" href="detail.html?id=${c.id}&mode=text">Read story</a></div>
  </article>`).join('');
  document.querySelector('#comic-empty').hidden = found.length !== 0;
  document.querySelector('#comic-empty').textContent = comics.length ? 'No comics match your search.' : 'New comics are coming soon.';
  document.querySelector('#comic-count').textContent = `${found.length} comics`;
}
search.addEventListener('input', render);
render();
initPage({chat:false});
