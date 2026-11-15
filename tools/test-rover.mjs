import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RoverMission,ROUTES,routePose} from '../dist/js/rover-engine.js';
import {roverMap} from '../dist/js/rover-map.js';
import {roverCopy} from '../dist/js/rover-copy.js';

test('A stops at the marked sand patch with remaining charge',()=>{
 const game=new RoverMission();assert(game.select('A'));assert(game.start(100));
 game.tick(100+ROUTES.A.duration);
 assert.equal(game.phase,'result');assert.equal(game.outcome,'sand');assert.equal(game.progress,.52);
 assert.equal(game.charge,42);assert(game.distance<ROUTES.A.meters);
 assert.deepEqual(game.pose(),routePose(ROUTES.A,.52));
});
test('B reaches the photo location and retains exactly 10 charge',()=>{
 const game=new RoverMission();game.select('B');game.start(0);
 for(let time=0;time<=7000;time+=100){game.tick(time);assert(game.charge>=10)}
 assert.equal(game.outcome,'success');assert.equal(game.charge,10);assert.equal(game.distance,620);
 assert.equal(game.pose().x,735);assert.equal(game.pose().y,185);
});
test('C runs out of charge before reaching the crater',()=>{
 const game=new RoverMission();game.select('C');game.start(0);game.tick(6400);
 assert.equal(game.outcome,'empty');assert.equal(game.charge,0);assert.equal(game.progress,.8);
 assert.equal(game.distance,720);assert.notEqual(game.pose().x,735);
});
test('charge decreases during movement, route cannot change and rapid start clicks are ignored',()=>{
 const game=new RoverMission();assert(!game.start(0));assert(!game.select('unknown'));
 game.select('B');assert(game.start(100));const start=game.startedAt;
 for(let n=0;n<20;n++){assert(!game.start(500));assert(!game.select('A'))}
 assert.equal(game.startedAt,start);assert.equal(game.route,'B');
 game.tick(3600);assert.equal(game.charge,35);assert.equal(game.phase,'running');
 const charge=game.charge;game.tick(100);assert.equal(game.charge,charge);
 game.tick(9000);assert.equal(game.charge,10);
 assert(!game.start(10000));assert(!game.select('C'));
});
test('every outcome can reset and launch a new attempt without stale state',()=>{
 const game=new RoverMission();
 for(const id of ['A','B','C','B']){
  game.reset();assert.equal(game.phase,'ready');assert.equal(game.charge,60);assert.equal(game.route,null);
  assert.equal(game.distance,0);assert.equal(game.outcome,null);assert.equal(game.pose().x,100);assert.equal(game.pose().y,430);
  game.select(id);game.start(0);game.tick(ROUTES[id].duration);
  assert.equal(game.phase,'result');assert.equal(game.outcome,ROUTES[id].outcome);
 }
});
test('positions interpolate continuously and turn along each pre-defined route',()=>{
 for(const route of Object.values(ROUTES)){
  let previous=routePose(route,0);
  for(let step=1;step<=1000;step++){
   const pose=routePose(route,step/1000);assert(Number.isFinite(pose.angle));
   assert(Math.hypot(pose.x-previous.x,pose.y-previous.y)<2);previous=pose;
  }
 }
});
test('mission is reachable from Missions and the UI copy and SVG map are complete',()=>{
 assert(readFileSync('dist/missions.html','utf8').includes('id="rover-open" href="rover.html"'));
 for(const key of Object.keys(roverCopy))assert(roverCopy[key],`roverCopy.${key}`);
 const svg=roverMap(roverCopy);for(const id of ['map-route-A','map-route-B','map-route-C','rover-body','loose-sand'])assert(svg.includes(`id="${id}"`));
 assert(svg.includes(roverCopy.start));assert(svg.includes(roverCopy.target));
 const html=readFileSync('dist/rover.html','utf8');
 assert(html.includes('fieldset'));assert(html.includes('role="meter"'));assert(!html.includes('cdn.jsdelivr.net'));
});
