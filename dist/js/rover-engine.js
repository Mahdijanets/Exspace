export const START_CHARGE = 60;
export const ROUTES = Object.freeze({
  A: {id:'A',meters:420,cost:35,stop:.52,duration:5200,outcome:'sand',points:[[100,430],[220,390],[340,330],[470,270],[600,225],[735,185]]},
  B: {id:'B',meters:620,cost:50,stop:1,duration:7000,outcome:'success',points:[[100,430],[150,285],[285,190],[420,210],[500,155],[610,135],[735,185]]},
  C: {id:'C',meters:900,cost:75,stop:.8,duration:6400,outcome:'empty',points:[[100,430],[245,485],[440,470],[640,435],[815,345],[845,245],[735,185]]}
});

export function routePose(route, progress) {
  const points = route.points;
  const lengths = points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  let remaining = Math.max(0,Math.min(1,progress))*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++){
    if(remaining<=lengths[i]||i===lengths.length-1){
      const [a,b]=[points[i],points[i+1]], t=Math.min(1,remaining/lengths[i]);
      return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,angle:Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI};
    }
    remaining-=lengths[i];
  }
}

export class RoverMission {
  constructor(){this.reset()}
  reset(){this.phase='ready';this.route=null;this.charge=START_CHARGE;this.progress=0;this.distance=0;this.outcome=null;this.startedAt=0}
  select(id){if(this.phase!=='ready'||!Object.hasOwn(ROUTES,id))return false;this.route=id;return true}
  start(now){if(this.phase!=='ready'||!this.route)return false;this.phase='running';this.startedAt=now;return true}
  tick(now){
    if(this.phase!=='running')return false;
    const route=ROUTES[this.route];
    const fraction=Math.max(0,Math.min(1,(now-this.startedAt)/route.duration));
    this.progress=Math.max(this.progress,route.stop*fraction);
    this.charge=Math.max(0,Math.ceil(START_CHARGE-route.cost*this.progress-1e-9));
    this.distance=Math.round(route.meters*this.progress);
    if(fraction===1){this.phase='result';this.outcome=route.outcome}
    return true;
  }
  pose(){return routePose(ROUTES[this.route||'B'],this.progress)}
}
