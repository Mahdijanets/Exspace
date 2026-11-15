import {shell} from './shared.js';
import {loadSpaceBackground} from './space-background.js';
shell('home');
loadSpaceBackground();
import('./scene.js').then(({createScene})=>createScene(document.getElementById('earth-scene'),{mode:'earth'})).catch(()=>{document.querySelector('.scene-message').textContent='3D could not load. Check your connection and WebGL support.'});
