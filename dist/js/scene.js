import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {planetTexture,glowTexture} from './textures.js';
import {upgradeEarth,disposeModel,makeEarthUnlit} from './earth-model.js';
import {setSourceCredit} from './source-credits.js';

export function createScene(host,{mode='earth',onSelect=()=>{}}={}){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',mode==='earth'?'Interactive 3D Earth. Drag to rotate.':'3D Solar System. You can also select planets using the buttons below.');
 host.prepend(renderer.domElement);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(40,1,.05,400);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let paused=reduced,selected=-1,stopped=false,frame=0,last=performance.now(),elapsed=0,visible=true;
 const assetController=new AbortController();
 let earthPlaceholder;
 const sphere=new THREE.SphereGeometry(1,64,40);const planets=[],radii=[5,7,9,11.2,15,19,23,27],sizes=[.3,.48,.5,.38,1.25,1.02,.75,.72];
 const ambient=new THREE.AmbientLight('#b7caff',mode==='earth'?.65:1.2);scene.add(ambient);
 const light=mode==='earth'?new THREE.DirectionalLight('#f0f4ff',3.5):new THREE.PointLight('#fff1d3',170,0,1.2);light.position.set(mode==='earth'?-6:0,mode==='earth'?5:0,mode==='earth'?6:0);scene.add(light);
 function planet(i,size){const material=new THREE.MeshStandardMaterial({map:planetTexture(i),roughness:i===2?.78:.95,metalness:0});const mesh=new THREE.Mesh(sphere,material);mesh.scale.setScalar(size);mesh.userData.index=i;if(i===6)mesh.rotation.z=1.55;else if(i===2)mesh.rotation.z=.41;scene.add(mesh);return mesh}
 if(mode==='earth'){
  const earth=planet(2,2.05);earth.rotation.y=2.8;earthPlaceholder=earth;planets.push(earth);
  earth.geometry=new THREE.SphereGeometry(1,64,40);
  makeEarthUnlit(earth);
  camera.position.set(0,.7,7.7);
  controls.enableZoom=false;controls.enableRotate=true;
  controls.minDistance=camera.position.length();controls.maxDistance=controls.minDistance;
  controls.autoRotate=!reduced;controls.autoRotateSpeed=.35;
 }else{
  const sun=new THREE.Mesh(new THREE.SphereGeometry(1.8,48,32),new THREE.MeshBasicMaterial({color:'#ffca75'}));scene.add(sun);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(11,11,1);scene.add(glow);
  radii.forEach((radius,i)=>{
   const points=Array.from({length:181},(_,j)=>{const a=j/180*Math.PI*2;return new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius)});
   scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#59739c',transparent:true,opacity:.25})));
   const mesh=planet(i,sizes[i]);mesh.userData.phase=i*.9;planets.push(mesh);
   if(i===5){const ring=new THREE.Mesh(new THREE.RingGeometry(1.35,2.05,96),new THREE.MeshStandardMaterial({color:'#c6b69a',side:THREE.DoubleSide,transparent:true,opacity:.65,roughness:1}));ring.rotation.x=Math.PI/2-.35;mesh.add(ring)}
  });
  camera.position.set(0,35,45);controls.minDistance=2;controls.maxDistance=85;controls.maxPolarAngle=Math.PI*.88;
 }
 // The homepage uses the real NASA star photograph, not generated points.
 if(mode==='solar'){
 // A stable procedural star field, no remote image requests.
 const stars=new Float32Array(1800*3);for(let i=0;i<1800;i++){const a=i*2.399963,b=Math.acos(1-2*(i+.5)/1800),r=95+(i%19);stars[i*3]=r*Math.sin(b)*Math.cos(a);stars[i*3+1]=r*Math.cos(b);stars[i*3+2]=r*Math.sin(b)*Math.sin(a)}
 const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3));scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:'#9baed1',size:.12,transparent:true,opacity:.75,sizeAttenuation:true})));
 }
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});observer.observe(host);
 function updatePositions(){if(mode==='solar')planets.forEach((p,i)=>{const a=p.userData.phase+elapsed*(.18/(1+i*.45));p.position.set(Math.cos(a)*radii[i],0,Math.sin(a)*radii[i]);p.rotation.y=elapsed*.1})}
 updatePositions();
 const lastTarget=new THREE.Vector3();
 function focus(index){if(mode!=='solar')return;selected=index;const p=planets[index];controls.target.copy(p.position);lastTarget.copy(p.position);camera.position.copy(p.position).add(new THREE.Vector3(0,sizes[index]*2+1.5,sizes[index]*5+3));controls.update()}
 function reset(){selected=-1;controls.target.set(0,0,0);camera.position.set(0,35,45);controls.update()}
 const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let start;
 function pointerDown(e){start={x:e.clientX,y:e.clientY}}
 function pointerUp(e){if(mode!=='solar'||!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(planets,false)[0];if(hit){const i=hit.object.userData.index;focus(i);onSelect(i)}}
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);
 function animate(now){if(stopped)return;frame=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(!paused)elapsed+=dt;updatePositions();if(selected>=0){const target=planets[selected].position;camera.position.add(target.clone().sub(lastTarget));controls.target.copy(target);lastTarget.copy(target)}controls.update(dt);renderer.render(scene,camera)}
 frame=requestAnimationFrame(animate);host.querySelector('.scene-message').textContent='';
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();stopped=true;host.querySelector('.scene-message').textContent='3D context lost. Reload the page.'});
 if(mode==='earth'){
  upgradeEarth({placeholder:earthPlaceholder,parent:scene,renderer,signal:assetController.signal,onStatus:message=>{if(!stopped)host.querySelector('.scene-message').textContent=message},onCredit:(label,url)=>{if(!stopped)setSourceCredit('earth',label,url)}}).catch(()=>{if(!stopped)host.querySelector('.scene-message').textContent='NASA details could not load.'});
 }
 function dispose(){stopped=true;assetController.abort();cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();controls.dispose();disposeModel(scene);sphere.dispose();renderer.dispose();renderer.domElement.remove()}
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose()});
 return {focus,reset,setPaused:value=>{paused=value},dispose};
}
