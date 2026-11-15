import {ROUTES,routePose} from './rover-engine.js';

export function roverMap(copy){
  const sand=routePose(ROUTES.A,ROUTES.A.stop);
  const rocks=[[245,225,21],[310,157,15],[405,158,25],[466,248,19],[542,187,24],[588,92,19],[685,240,23],[170,345,18],[790,405,15],[355,419,12],[70,225,28]];
  const rock=(x,y,r)=>`<g transform="translate(${x} ${y})"><ellipse cy="${r*.45}" rx="${r*1.25}" ry="${r*.5}" fill="#492b26" opacity=".4"/><path d="M${-r} 0 ${-r*.5} ${-r} ${r*.5} ${-r*.8} ${r} 0 0 ${r*.5}Z" fill="#806052" stroke="#6b4a3d" stroke-width="2"/><path d="M${-r*.5} ${-r} 0 ${-r*.1} ${r} 0 ${r*.5} ${-r*.8}Z" fill="#b38b6a"/></g>`;
  let grit='';for(let i=0;i<120;i++){const x=(i*173+41)%900,y=(i*97+31)%560;grit+=`<ellipse cx="${x}" cy="${y}" rx="${i%3+1}" ry="1" fill="${i%2?'#e1a274':'#623b30'}" opacity=".25"/>`}
  return `<svg id="rover-map" viewBox="0 0 900 560" role="img" aria-label="${copy.map}" xmlns="http://www.w3.org/2000/svg">
   <defs><linearGradient id="mars-ground" x2=".8" y2="1"><stop stop-color="#6e4033"/><stop offset="1" stop-color="#b47b54"/></linearGradient><radialGradient id="crater-depth"><stop stop-color="#432b29"/><stop offset=".75" stop-color="#754731"/><stop offset="1" stop-color="#bd8960"/></radialGradient><pattern id="sand-lines" width="20" height="12" patternUnits="userSpaceOnUse"><path d="M0 8q10-8 20 0" fill="none" stroke="#f1bd7f" stroke-width="1.4" opacity=".45"/></pattern></defs>
   <rect width="900" height="560" fill="url(#mars-ground)"/>
   <path d="M-30 140Q220 30 440 100T950 35M-20 500Q270 330 520 480T940 430" fill="none" stroke="#d89b6e" stroke-width="45" opacity=".08"/>
   ${grit}
   <g id="loose-sand"><ellipse cx="${sand.x}" cy="${sand.y}" rx="105" ry="53" fill="#c6925b"/><ellipse cx="${sand.x}" cy="${sand.y}" rx="105" ry="53" fill="url(#sand-lines)" stroke="#ebbf81" stroke-dasharray="6 7" stroke-width="2"/><text x="${sand.x}" y="${sand.y+77}" text-anchor="middle" class="map-caption">${copy.sandLabel}</text></g>
   <g><ellipse cx="778" cy="149" rx="122" ry="69" fill="#55372d" opacity=".4"/><ellipse cx="775" cy="137" rx="118" ry="65" fill="#d09b6a"/><ellipse cx="775" cy="132" rx="101" ry="51" fill="url(#crater-depth)"/><path d="M665 154Q768 232 883 151" fill="none" stroke="#e2ae7d" stroke-width="9"/><path d="M688 132Q765 185 854 132" fill="none" stroke="#432b29" stroke-width="4" opacity=".5"/></g>
   ${rocks.map(r=>rock(...r)).join('')}
   <g class="map-routes">${Object.values(ROUTES).map(r=>`<polyline id="map-route-${r.id}" class="map-route" data-route="${r.id}" points="${r.points.map(p=>p.join(',')).join(' ')}"/>`).join('')}</g>
   <g class="map-route-label" transform="translate(270 370)"><rect x="-26" y="-26" width="52" height="52" rx="12"/><text text-anchor="middle" y="6">A</text></g>
   <g class="map-route-label" transform="translate(353 184)"><rect x="-26" y="-26" width="52" height="52" rx="12"/><text text-anchor="middle" y="6">B</text></g>
   <g class="map-route-label" transform="translate(555 455)"><rect x="-26" y="-26" width="52" height="52" rx="12"/><text text-anchor="middle" y="6">C</text></g>
   <g transform="translate(100 430)"><circle r="24" fill="#141c29" opacity=".7"/><circle r="29" fill="none" stroke="#d9e8ff" stroke-width="2" stroke-dasharray="4 4"/><text x="-35" y="50" class="map-caption">${copy.start}</text></g>
   <g transform="translate(735 185)"><circle r="19" fill="none" stroke="#d9faab" stroke-width="2"/><path d="M0 9V-35h31l-5 10 5 10H0" fill="#a6d985" stroke="#1e3927" stroke-width="2"/><text x="-5" y="-48" class="map-caption">${copy.target}</text></g>
   <g id="rover-body" transform="translate(100 430)">
    <ellipse cy="9" rx="31" ry="14" fill="#302423" opacity=".5"/>
    <g fill="#232731" stroke="#151820" stroke-width="2"><rect x="-22" y="-20" width="11" height="13" rx="4"/><rect x="-4" y="-20" width="11" height="13" rx="4"/><rect x="14" y="-20" width="11" height="13" rx="4"/><rect x="-22" y="9" width="11" height="13" rx="4"/><rect x="-4" y="9" width="11" height="13" rx="4"/><rect x="14" y="9" width="11" height="13" rx="4"/></g>
    <path d="M-25-10 20-10 29 0 20 13-25 13Z" fill="#b2a897" stroke="#ece0ba" stroke-width="2"/><path d="M-19-12 15-12 21-3-19-3Z" fill="#e6d9b7"/>
    <rect x="-17" y="-9" width="24" height="17" rx="2" fill="#3c5263" stroke="#99b2c6"/><path d="M-9-8v14M0-8v14M-16-1H6" stroke="#8ca2b1" stroke-width="1"/>
    <path d="M17-2v-23" stroke="#e6d9b7" stroke-width="5"/><rect x="11" y="-29" width="18" height="11" rx="3" fill="#c6c1ac" stroke="#5e5d59"/><circle cx="25" cy="-24" r="3" fill="#233d53"/>
   </g>
  </svg>`;
}
