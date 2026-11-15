import { initPage, escapeHtml } from './app.js';
import { videos } from './videos-data.js';

initPage({ chat: false });

const search = document.querySelector('#video-search');
document.querySelector('#video-cards').innerHTML = videos.map(video => `
  <article class="video-card" data-search="${escapeHtml(`${video.title} ${video.keywords}`.toLowerCase())}">
    <button class="video-preview" type="button" data-video-id="${video.id}" aria-label="Play ${escapeHtml(video.title)}">
      <img src="assets/videos/${video.id}.jpg" alt="${escapeHtml(video.title)}" loading="lazy">
      <span class="video-play" aria-hidden="true">&#9654;</span>
    </button>
    <h2>${escapeHtml(video.title)}</h2>
  </article>`).join('');
document.querySelector('#video-cards').addEventListener('click', event => {
  const button = event.target.closest('.video-preview');
  if (!button) return;
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube.com/embed/${button.dataset.videoId}?autoplay=1&playsinline=1&rel=0`;
  frame.title = button.getAttribute('aria-label');
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  button.replaceWith(frame);
  frame.focus();
});
function applySearch() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll('.video-card').forEach(card => {
    card.hidden = !card.dataset.search.includes(query);
    if (!card.hidden) count += 1;
  });
  document.querySelector('#video-status').hidden = count !== 0;
}
search.addEventListener('input', applySearch);
document.querySelector('.mission-search-form').addEventListener('submit', event => {
  event.preventDefault();
  applySearch();
  document.querySelector('#video-results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
