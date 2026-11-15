import {$,shell,complete} from './shared.js';
import {RoverMission,ROUTES,START_CHARGE} from './rover-engine.js';
import {roverCopy} from './rover-copy.js';
import {roverMap} from './rover-map.js';
import {setMascotState} from './mascot.js';

shell('missions');
const copy=roverCopy;
document.title=copy.title+' — Acustik Space';
document.querySelectorAll('[data-rover]').forEach(node=>{node.textContent=copy[node.dataset.rover]});
$('charge-meter').setAttribute('aria-label',copy.charge);
document.querySelector('.rover-scene').setAttribute('aria-label',copy.map);
$('crater-photo').querySelector('img').alt=copy.photo;
$('mars-map').innerHTML=roverMap(copy);
const names={A:'sandName',B:'rockName',C:'plainName'},risks={A:'sandRisk',B:'rockRisk',C:'plainRisk'};
$('route-options').innerHTML=Object.values(ROUTES).map(route=>`<label class="route-option"><input type="radio" name="route" value="${route.id}" aria-label="${copy.route} ${route.id}: ${copy[names[route.id]]}, ${route.meters} ${copy.meters}, ${copy.energy} ${route.cost} ${copy.units}. ${copy[risks[route.id]]}"><span class="route-tile"><span class="route-letter">${route.id}</span><span class="route-name">${copy[names[route.id]]}</span><span class="route-stats"><span>${route.meters} ${copy.meters}</span><span>${copy.energy}: <b>${route.cost}</b> ${copy.units}</span></span><span class="route-risk ${route.cost>START_CHARGE?'route-warning':''}">${copy[risks[route.id]]}</span></span></label>`).join('');
const mission=new RoverMission();
const radios=[...document.querySelectorAll('input[name="route"]')];
const mascot=$('rover-mascot').querySelector('.mascot');
let frame=null,lastPhase='';

function render(){
  const locked=mission.phase!=='ready';
  radios.forEach(input=>{input.disabled=locked;input.checked=input.value===mission.route});
  for(const id of ['A','B','C']){
    $(`map-route-${id}`).classList.toggle('selected',id===mission.route);
    document.querySelectorAll('.map-route-label')[['A','B','C'].indexOf(id)].classList.toggle('selected',id===mission.route);
  }
  const pose=mission.pose();
  $('rover-body').setAttribute('transform',`translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${pose.angle.toFixed(2)})`);
  $('charge-value').textContent=`${mission.charge} / ${START_CHARGE}`;
  $('charge-fill').style.width=`${mission.charge/START_CHARGE*100}%`;
  $('charge-meter').setAttribute('aria-valuenow',String(mission.charge));
  $('charge-meter').classList.toggle('low',mission.charge<=10);
  $('rover-distance').textContent=mission.distance;
  $('rover-launch').disabled=mission.phase!=='ready'||!mission.route;
  $('rover-launch').hidden=mission.phase==='result';
  $('rover-retry').hidden=mission.phase!=='result';
  $('crater-photo').hidden=mission.outcome!=='success';
  $('rover-state').textContent=mission.phase==='running'?copy.running:mission.phase==='result'?copy[mission.outcome+'Title']:mission.route?`${copy.selected}: ${mission.route}`:copy.ready;
  // Announce phase changes, not every animation frame or battery tick.
  if(mission.phase!==lastPhase){
    lastPhase=mission.phase;
    $('rover-message').textContent=mission.phase==='ready'?copy.intro:mission.phase==='running'?copy.travel:copy[mission.outcome];
    setMascotState(mascot,mission.phase==='ready'?'hello':mission.phase==='running'?'thinking':mission.outcome==='success'?'done':'oops');
    if(mission.phase==='result'){
      if(mission.outcome==='success')complete('rover');
      $('rover-retry').focus({preventScroll:true});
    }
  }
}
radios.forEach(input=>input.addEventListener('change',()=>{if(mission.select(input.value))render()}));
function animate(now){
  frame=null;mission.tick(now);render();
  if(mission.phase==='running')frame=requestAnimationFrame(animate);
}
$('rover-launch').onclick=()=>{if(!mission.start(performance.now()))return;render();frame=requestAnimationFrame(animate)};
$('rover-retry').onclick=()=>{
  if(frame!==null)cancelAnimationFrame(frame);
  frame=null;mission.reset();render();radios[0].focus({preventScroll:true});
};
window.addEventListener('pagehide',()=>{if(frame!==null)cancelAnimationFrame(frame)});
window.addEventListener('pageshow',event=>{if(event.persisted&&mission.phase==='running'&&frame!==null){cancelAnimationFrame(frame);frame=requestAnimationFrame(animate)}});
render();
