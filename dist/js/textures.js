import * as THREE from 'three';
// Procedural textures keep the learning model independent of third-party images.
export function planetTexture(index){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
 const ctx=canvas.getContext('2d');
 const colors=['#98928a','#c59e66','#16436c','#a55e43','#b69e86','#cabb95','#91c8cd','#4266af'];
 ctx.fillStyle=colors[index];ctx.fillRect(0,0,1024,512);
 let seed=index+42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 if(index===2){
  const land=[[[130,100],[205,63],[280,78],[304,119],[272,153],[260,185],[225,199],[230,226],[195,207],[179,173],[143,159]],[[240,234],[292,243],[320,287],[307,336],[285,363],[265,412],[243,373],[241,322],[221,276]],[[435,113],[466,91],[490,117],[518,123],[510,149],[470,160]],[[467,171],[517,171],[546,222],[533,277],[502,324],[473,299],[457,244],[437,210]],[[504,109],[565,70],[670,69],[751,87],[844,122],[835,159],[778,184],[736,226],[694,196],[650,221],[611,182],[573,174],[547,147]],[[625,208],[663,216],[651,270],[632,250]],[[766,309],[818,293],[857,324],[844,360],[797,365],[765,342]],[[300,44],[334,27],[355,53],[336,91],[307,80]]];
  land.forEach(points=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#658566';ctx.fill();ctx.strokeStyle='#8b9b74';ctx.lineWidth=6;ctx.stroke()});
  // Small surface variation and cloud ribbons remain illustrative, not geographic data.
  for(let i=0;i<2400;i++){ctx.fillStyle=`rgba(168,188,142,${rand()*.14})`;ctx.fillRect(rand()*1024,rand()*512,rand()*12,rand()*5)}
  ctx.fillStyle='#d9e1df';ctx.fillRect(0,0,1024,17);ctx.fillRect(0,485,1024,27);
  for(let i=0;i<65;i++){const x=rand()*1024,y=rand()*460+20;ctx.beginPath();ctx.ellipse(x,y,rand()*80+20,rand()*5+1,-.15,0,Math.PI*2);ctx.fillStyle=`rgba(239,246,255,${rand()*.35+.05})`;ctx.fill()}
 }else if(index===4||index===5){
  for(let y=0;y<512;y+=3){const n=Math.sin(y*.13)+Math.sin(y*.047);ctx.fillStyle=`rgba(${n>0?'255,238,207':'82,52,41'},${Math.abs(n)*.12})`;ctx.fillRect(0,y,1024,3)}
  if(index===4){ctx.fillStyle='#9c6552';ctx.beginPath();ctx.ellipse(670,330,70,22,-.08,0,Math.PI*2);ctx.fill()}
 }else{
  for(let i=0;i<2200;i++){const x=rand()*1024,y=rand()*512,r=rand()*8+.5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`rgba(${i%2?'240,224,199':'22,19,27'},${rand()*.12})`;ctx.fill()}
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
export function glowTexture(){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d');const g=c.createRadialGradient(64,64,3,64,64,64);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.25,'rgba(255,169,71,.45)');g.addColorStop(1,'rgba(255,120,20,0)');c.fillStyle=g;c.fillRect(0,0,128,128);return new THREE.CanvasTexture(canvas)}
