import {$,shell,t} from './shared.js';
import {planets} from './content.js';
shell('solar');
let scene,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function select(i,focus=true){const p=planets[i];$('planet-index').textContent=`0${i+1} / SOLAR SYSTEM`;$('planet-name').textContent=p.name;$('planet-description').textContent=p.desc;$('planet-size').textContent=p.diameter+' '+t('km');$('planet-year').textContent=p.year+' '+t(p.unit);document.querySelectorAll('.planet-button').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));if(focus)scene?.focus(i)}
$('planet-map').replaceChildren(...planets.map((p,i)=>{const b=document.createElement('button');b.className='planet-button';b.innerHTML=`<span class="orb-holder"><span class="orb" style="--size:${p.size}px;--color:${p.color}"></span></span><span>${p.name}</span>`;b.onclick=()=>select(i);return b}));
function pauseLabel(){$('pause').textContent=paused?'▶ Play':'Ⅱ Pause';$('pause').setAttribute('aria-pressed',String(paused))}
pauseLabel();select(2,false);$('pause').disabled=true;$('reset-camera').disabled=true;
$('pause').onclick=()=>{paused=!paused;scene?.setPaused(paused);pauseLabel()};$('reset-camera').onclick=()=>scene?.reset();
document.querySelector('.scene-message').textContent='Loading 3D scene…';
import('./scene.js').then(({createScene})=>{scene=createScene($('solar-scene'),{mode:'solar',onSelect:i=>select(i,false)});scene.setPaused(paused);$('pause').disabled=false;$('reset-camera').disabled=false}).catch(()=>{document.querySelector('.scene-message').textContent='3D unavailable. Check your connection and WebGL. Planet cards below still work.'});
