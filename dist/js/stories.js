import {$,shell,t} from './shared.js';
import {stories} from './content.js';
shell('stories');let page=0;
function render(){const s=stories[page];$('story-page').textContent=`${t('page')} 0${page+1} / 03`;$('story-heading').textContent=s[0];$('story-text').textContent=s[1];$('story-dots').textContent=[0,1,2].map(i=>i===page?'●':'○').join('');$('story-prev').disabled=page===0;$('story-next').disabled=page===2;document.querySelector('.comic-scene').dataset.frame=page;document.querySelector('.comic-scene').setAttribute('aria-label',s[0])}
$('story-prev').onclick=()=>{page--;render()};$('story-next').onclick=()=>{page++;render()};render();
