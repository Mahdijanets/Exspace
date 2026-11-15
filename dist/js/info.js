
import { initPage, favoriteButton, bindFavorites, escapeHtml, $, $$ } from "./app.js";
import { Store } from './store.js';
import { comics } from './comics-data.js';
const summaries = {
  'alsep': 'Apollo astronauts left science stations on the Moon. Their instruments listened for moonquakes and measured the lunar environment. Discover the experiments that kept working after the crews went home.',
  'apollo-lunar-module': 'A small spacecraft carried astronauts to the lunar surface. Its descent stage stayed behind when the crew lifted off. Explore the machine that made the Moon landings possible.',
  'dawn': 'Dawn explored Vesta and Ceres in the asteroid belt. Its ion engine helped it orbit two different worlds. Follow a journey into the early history of our solar system.',
  'ingenuity': 'A tiny helicopter took flight in the thin air of Mars. Ingenuity demonstrated powered flight on another planet. Discover how an experiment became an aerial explorer.',
  'kepler': 'Kepler watched distant stars for tiny changes in brightness. Those changes revealed planets passing in front of their stars. Explore the telescope that transformed our view of other worlds.',
  'lunar-roving-vehicle': 'Apollo astronauts drove an electric rover across the Moon. It carried tools and samples beyond walking distance. Follow the tracks of the vehicles they left behind.',
  'near-shoemaker': 'NEAR Shoemaker traveled to the asteroid Eros. It mapped the rocky world before descending to its surface. Discover a mission that brought an asteroid into close view.',
  'phoenix-insight': 'Two stationary explorers studied Mars in different ways. Phoenix investigated icy ground while InSight listened for marsquakes. Discover what they revealed above and below the surface.',
  'pioneer-10-11': 'Two pioneering spacecraft ventured into the outer solar system. Their encounters revealed new views of the giant planets. Follow the probes that helped open the way for future explorers.',
  'sojourner-pathfinder': 'Mars Pathfinder delivered a small rover to the red planet. Sojourner rolled across the ground and examined nearby rocks. Discover the little explorer that began a new era of Mars roving.',
  'spirit-opportunity': 'Twin rovers landed on opposite sides of Mars. They studied rocks and searched for evidence of past water. Follow two journeys that lasted far longer than planned.',
  'surveyor': 'Robotic Surveyor landers reached the Moon before Apollo crews. Their cameras and instruments examined the surface up close. Discover how these quiet scouts prepared the way for astronauts.',
  'viking-1-2': 'Two Viking missions sent orbiters and landers to Mars. They photographed the planet and conducted experiments on its surface. Explore an early chapter in the search to understand the red planet.'
};
const favoritesOnly = new URLSearchParams(location.search).get('favorites') === '1';

function card(mission) {
  const summary = summaries[mission.id] || mission.summary || `Explore ${mission.title} through its story and comic.`;
  return `<article class="mission-card panel" data-mission="${mission.id}" data-world="${escapeHtml(mission.world)}" data-text="${escapeHtml(`${mission.title} ${mission.world} ${summary}`.toLowerCase())}">
    <a class="mission-photo" href="detail.html?id=${mission.id}&mode=comic" aria-label="Explore ${escapeHtml(mission.title)}"><img src="assets/mission-photos/${mission.id}.jpg" alt="${escapeHtml(mission.title)}" loading="lazy" width="1600" height="1200"></a>
    <div class="card-text"><div class="card-meta">${mission.world} / Story + Comic</div><h3>${escapeHtml(mission.title)}</h3><p>${escapeHtml(summary)}</p></div>
    <div class="card-actions"><a class="btn primary" href="detail.html?id=${mission.id}&mode=text">Explore story</a><a class="btn" href="detail.html?id=${mission.id}&mode=comic">Explore comic</a></div>
    ${favoriteButton(mission.id)}</article>`;
}

function applyFilters() {
  const query = $("#mission-search").value.trim().toLowerCase();
  let visible = 0;
  $$(".mission-card").forEach((node) => {
    const show = node.dataset.text.includes(query) && (!favoritesOnly || Store.isFavorite(node.dataset.mission));
    node.hidden = !show;
    if (show) visible += 1;
  });
  $("#empty-state").hidden = visible !== 0;
}

await initPage();
$("#cards").innerHTML = comics.map(card).join("");
$$('.mission-card').forEach((node, index) => { node.dataset.mission = comics[index].id; });
if (favoritesOnly) {
  $('#empty-state').textContent = 'No favorite missions yet. Use the heart on a mission card to save it.';
  $('.header-favorites').setAttribute('aria-current', 'page');
  $('#catalog-title').textContent = 'Your favorite space stories';
}
$("#mission-search").addEventListener('input', applyFilters);
$('.mission-search-form').addEventListener('submit', event => {
  event.preventDefault();
  applyFilters();
  $('#mission-results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
window.addEventListener("acustik:state", applyFilters);
bindFavorites($("#cards"));
applyFilters();
