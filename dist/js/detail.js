import { initPage, param, favoriteButton, bindFavorites, escapeHtml, $, $$ } from './app.js';
import { comics } from './comics-data.js';
const mission = comics.find(c => c.id === param('id')) || comics[0];
const positions = { text: 0, comic: 0 };
let mode = param('mode') === 'comic' ? 'comic' : 'text';
let pages;
function renderPage() {
 const list = pages[mode], index = positions[mode];
 $('#reader-image').src = list[index];
 $('#reader-image').alt = `${mission.title}: ${mode === 'text' ? 'story' : 'comic'}, page ${index+1} of ${list.length}`;
 $('#page-number').textContent = `Page ${index+1} of ${list.length}`;
 $('#page-select').value = index;
 $('#previous-page').disabled = index === 0;
 $('#next-page').disabled = index === list.length-1;
 if(list[index+1]) { const preload = new Image(); preload.src = list[index+1]; }
}
function turnPage(delta) { positions[mode] = Math.max(0, Math.min(pages[mode].length-1, positions[mode]+delta)); renderPage(); }
function renderMode(nextMode) {
 mode = nextMode;
 const label = mode === 'text' ? 'Story' : 'Comic';
 $$('.tab').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
 const url = new URL(location.href); url.searchParams.set('mode',mode); history.replaceState(null,'',url);
 $('#format-content').innerHTML = `<section class="reader" aria-label="${label} reader">
 <div class="reader-heading"><div><p class="reader-eyebrow">${escapeHtml(mission.world)} / ${label}</p><h3>${escapeHtml(mission.title)}</h3></div><button id="zoom-page" type="button" aria-pressed="false">Enlarge page</button></div>
 <div class="reader-stage" tabindex="0" aria-label="Reading area. Use left and right arrow keys to turn pages."><img id="reader-image" alt="" decoding="async"></div>
 <div class="reader-controls"><button id="previous-page" type="button">&#8592; Previous</button><span id="page-number" role="status"></span><button id="next-page" type="button">Next &#8594;</button></div>
 <div class="reader-bottom"><label>Jump to page <select id="page-select">${pages[mode].map((_,i)=>`<option value="${i}">${i+1}</option>`).join('')}</select></label><a href="${mode==='text'?mission.storyPdf:mission.pdf}" download>Download original PDF</a></div></section>`;
 $('#previous-page').onclick = ()=>turnPage(-1);
 $('#next-page').onclick = ()=>turnPage(1);
 $('#page-select').onchange = event=>{ positions[mode] = Number(event.target.value); renderPage(); };
 $('#zoom-page').onclick = event=>{ const zoomed = $('.reader-stage').classList.toggle('zoomed'); event.currentTarget.setAttribute('aria-pressed',String(zoomed)); event.currentTarget.textContent = zoomed?'Fit page':'Enlarge page'; };
 $('.reader-stage').onkeydown = event=>{ if(['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); turnPage(event.key==='ArrowLeft'?-1:1); } };
 renderPage();
}
await initPage();
document.title = `${mission.title} - EXSPACE`;
$('#mission-title').textContent = mission.title;
$('#mission-meta').textContent = `${mission.world} / Story + Comic`;
$('#mission-image').src = mission.cover;
$('#mission-image').alt = `${mission.title} comic cover`;
$('#favorite-slot').innerHTML = favoriteButton(mission.id);
bindFavorites($('#mission-shell'));
try {
 const response = await fetch('js/reader-data.json');
 if(!response.ok) throw new Error('Reader unavailable');
 pages = (await response.json())[mission.id];
 if(!pages?.text?.length || !pages?.comic?.length) throw new Error('Missing pages');
 $$('.tab').forEach(button=>button.addEventListener('click',()=>renderMode(button.dataset.mode)));
 renderMode(mode);
} catch {
 $('#format-content').innerHTML = `<p>The reader could not load. Please refresh or open the original files.</p><a class="btn" href="${mission.storyPdf}">Open story PDF</a> <a class="btn" href="${mission.pdf}">Open comic PDF</a>`;
}
