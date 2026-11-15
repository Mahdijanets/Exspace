import {setSourceCredit} from './source-credits.js';

export const spaceBackground = {
  local: null,
  remote: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2015/11/STScI-01EVT26J52T32NX81JDJHNKKWM.tif?w=1600&fit=clip',
  source: 'https://science.nasa.gov/asset/hubble/hubble-view-of-entire-sweeps-field/',
  credit: 'NASA, ESA, A. Calamida and K. Sahu (STScI), and the SWEEPS Science Team'
};

export function loadSpaceBackground() {
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const sources = [spaceBackground.local, spaceBackground.remote].filter(Boolean);
  function load(index) {
    if (index >= sources.length) return;
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.onload = () => {
      hero.style.setProperty('--space-background', `url("${sources[index]}")`);
      setSourceCredit('stars', 'Hubble · SWEEPS Field', spaceBackground.source, spaceBackground.credit);
    };
    image.onerror = () => load(index + 1);
    image.src = sources[index];
  }
  load(0);
}
