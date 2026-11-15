import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {missions, sources} from '../dist/js/data.js';
import {comics} from '../dist/js/comics-data.js';

const cyrillic=/[\u0400-\u04FF]/;
const pages=['index','info','detail','quiz','solar','login','register','account','games','comics'];
for(const page of pages){
 const html=readFileSync(`dist/${page}.html`,'utf8');
 assert(!cyrillic.test(html),`${page}: Cyrillic text remains`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${page}: duplicate IDs`);
 for(const [,target] of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  if(target.startsWith('http')||target.startsWith('mailto:'))continue;
  const local=target.split('?')[0];
  assert(existsSync(`dist/${local}`),`${page}: missing ${target}`);
 }
}
assert.equal(missions.length,17,'Expected 17 first-round mission cards');
assert.equal(sources.length,17,'Expected one source entry per mission');
assert(Array.isArray(comics), 'Comic catalog must be an array');
assert.equal(new Set(comics.map(c=>c.id)).size, comics.length, 'Duplicate comic IDs');
for (const comic of comics) {
 assert(comic.pages > 0 && comic.title, `${comic.id}: incomplete comic`);
 for (const asset of [comic.pdf,comic.cover]) assert(existsSync(`dist/${asset}`),`${comic.id}: missing ${asset}`);
 assert(comic.storyPages > 0, `${comic.id}: story is empty`);
 for (const asset of [comic.storyPdf,comic.storyCover]) assert(existsSync(`dist/${asset}`),`${comic.id}: missing story ${asset}`);
 assert(readFileSync(`dist/${comic.pdf}`).subarray(0,5).toString()==='%PDF-',`${comic.id}: invalid PDF`);
}
for(const mission of missions){
 assert(mission.id&&mission.name&&mission.summary&&mission.image&&mission.story.length>=3,`${mission.id}: incomplete mission data`);
 assert(existsSync(`dist/${mission.image}`),`${mission.id}: missing image`);
 assert(mission.source.url.startsWith('https://')&&/nasa\.gov/.test(mission.source.url),`${mission.id}: source is not a NASA URL`);
 assert(mission.quiz.length>5,`${mission.id}: quiz needs more than five questions`);
 for(const item of mission.quiz){
  assert.equal(item.length,5,`${mission.id}: quiz item must have one question and four answers`);
  assert(item[1],`${mission.id}: empty correct answer`);
  assert.equal(new Set(item.slice(1)).size,4,`${mission.id}: duplicate quiz answers`);
 }
}
for(const file of readdirSync('dist/js').filter(f=>f.endsWith('.js'))){
 execFileSync(process.execPath,['--check',`dist/js/${file}`]);
 assert(!cyrillic.test(readFileSync(`dist/js/${file}`,'utf8')),`${file}: Cyrillic text remains`);
}
console.log(`PASS: ${pages.length} pages, ${missions.length} missions, ${missions.reduce((n,m)=>n+m.quiz.length,0)} quiz questions, NASA links and JavaScript syntax.`);
