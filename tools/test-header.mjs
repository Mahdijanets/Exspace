import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {headerMarkup,renderHeader} from '../dist/js/header.js';
import {copy} from '../dist/js/content.js';

test('all pages preserve navigation, one active section and local mascot',()=>{
  for(const page of ['home','solar','stories','missions','login','register','account']){
    const html=headerMarkup(page);
    assert(!html.includes('class="brand"'));
    assert(/<div class="header-ask-field">\s*<img class="header-mascot"/.test(html));
    for(const href of ['index.html','solar.html','stories.html','missions.html','login.html']) assert(html.includes(`href="${href}"`));
    const active=[...html.matchAll(/aria-current="page"/g)];
    assert.equal(active.length,['home','solar','stories','missions'].includes(page)?1:0);
    assert(html.includes(copy.askPlaceholder));
    assert(html.includes('<label class="visually-hidden" for="ask-question">'));
    assert(html.includes('type="submit"'));
    assert(html.includes('aria-controls="site-navigation"'));
    assert(!html.includes('language'),`${page}: leftover language control`);
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size);
    const image=html.match(/<img[^>]+src="([^"]+)"/)[1];
    assert(existsSync('dist/'+image));
  }
});

const original={document:globalThis.document,matchMedia:globalThis.matchMedia};
afterEach(()=>{for(const [key,value] of Object.entries(original)){if(value===undefined)delete globalThis[key];else globalThis[key]=value}});
class Element extends EventTarget {
  constructor(){super();this.attributes={};this.value='';this.textContent='';this.hidden=false;this.focused=false}
  setAttribute(key,value){this.attributes[key]=value}
  getAttribute(key){return this.attributes[key]}
  focus(){this.focused=true;if(globalThis.document)globalThis.document.activeElement=this}
}
function setup(mobile=true){
  const ids=Object.fromEntries(['site-navigation','header-menu-toggle','ask-acustik','ask-question','ask-status'].map(id=>[id,new Element()]));
  const header=new Element();header.querySelector=()=>({outerHTML:'<a class="brand" href="index.html">ACUSTIK SPACE</a>'});header.contains=element=>Object.values(ids).includes(element);
  const media=new Element();media.matches=mobile;
  globalThis.matchMedia=()=>media;
  globalThis.document=Object.assign(new EventTarget(),{querySelector:()=>header,getElementById:id=>ids[id]});
  renderHeader('home');
  return {ids,header,media};
}

test('mobile menu opens, closes with Escape and restores keyboard focus',()=>{
  const {ids,header,media}=setup();const toggle=ids['header-menu-toggle'];
  assert(ids['site-navigation'].hidden);toggle.onclick();
  assert(!ids['site-navigation'].hidden);assert.equal(toggle.getAttribute('aria-expanded'),'true');
  header.dispatchEvent(Object.assign(new Event('keydown'),{key:'Escape'}));
  assert(ids['site-navigation'].hidden);assert(toggle.focused);
  media.matches=false;media.dispatchEvent(new Event('change'));
  assert(!ids['site-navigation'].hidden);assert.equal(toggle.getAttribute('aria-expanded'),'false');
});

test('submit handles click and Enter through the form without pretending to send a question',()=>{
  const {ids}=setup(false);const form=ids['ask-acustik'];const question=ids['ask-question'];
  question.value='Why is Mars red?';
  const submit=new Event('submit',{cancelable:true});form.dispatchEvent(submit);
  assert(submit.defaultPrevented);assert.equal(ids['ask-status'].textContent,copy.askUnavailable);
  assert.equal(question.value,'Why is Mars red?');
  question.dispatchEvent(new Event('input'));assert.equal(ids['ask-status'].textContent,'');
  question.value=' ';form.dispatchEvent(new Event('submit',{cancelable:true}));assert(question.focused);
});

test('a future question handler can take over without the placeholder notice',()=>{
  const {ids}=setup();const form=ids['ask-acustik'];let received;
  form.addEventListener('acustik:question',event=>{received=event.detail.question;event.preventDefault()});
  ids['ask-question'].value='  What is an orbit?  ';form.dispatchEvent(new Event('submit',{cancelable:true}));
  assert.equal(received,'What is an orbit?');assert.equal(ids['ask-status'].textContent,'');
});
