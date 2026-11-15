const states = new Set(['avatar', 'hello', 'thinking', 'talking', 'listening', 'done', 'oops']);
const animatedFile = state => `assets/mascot/akustik_${state}${state === 'avatar' ? '' : '_animated'}.svg`;

export function mascotMarkup(state = 'hello', className = '') {
  if (!states.has(state)) state = 'hello';
  return `<picture class="mascot ${className}" data-mascot-state="${state}" aria-hidden="true"><source media="(prefers-reduced-motion: reduce)" srcset="assets/mascot/akustik_${state}.svg"><img src="${animatedFile(state)}" width="600" height="700" alt="" decoding="async"></picture>`;
}

export function setMascotState(picture, state) {
  if (!picture || !states.has(state) || picture.dataset.mascotState === state) return;
  picture.dataset.mascotState = state;
  picture.querySelector('source').srcset = `assets/mascot/akustik_${state}.svg`;
  picture.querySelector('img').src = animatedFile(state);
}

export function mountMascots() {
  document.querySelectorAll('[data-mascot]').forEach(host => {
    const template = document.createElement('template');
    template.innerHTML = mascotMarkup(host.dataset.mascot);
    host.replaceChildren(template.content.cloneNode(true));
  });
}
