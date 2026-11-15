import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {loadEarthTexture,TEXTURE_WIDTH,TEXTURE_HEIGHT} from '../dist/js/earth-texture.js';
import {earthAssets} from '../dist/js/earth-assets.js';

const saved = Object.fromEntries(['caches','fetch','document','createImageBitmap'].map(key => [key,globalThis[key]]));
afterEach(() => { for (const [key,value] of Object.entries(saved)) { if(value===undefined)delete globalThis[key];else globalThis[key]=value; } });

function mocks({failResize=false,cacheUnavailable=false,encodeUnavailable=false}={}) {
  const entries=new Map(),requests=[],sizes=[];
  globalThis.caches={open:async()=>{if(cacheUnavailable)throw new Error('Private mode');return {match:async key=>entries.get(key)?.clone(),put:async(key,response)=>entries.set(key,response)}}};
  globalThis.fetch=async url=>{requests.push(url);if(failResize&&url===earthAssets.surfaceOptimizedRemote)return new Response('',{status:404});return new Response(new Blob(['original NASA data'],{type:'image/jpeg'}))};
  globalThis.createImageBitmap=async(blob,options)=>{if(options)sizes.push(options);return {close(){}}};
  globalThis.document={createElement:()=>({getContext:()=>({drawImage(){}}),toBlob(callback,type,quality){if(encodeUnavailable)throw new Error('No encoder');assert.equal(type,'image/webp');assert.equal(quality,.85);callback(new Blob(['webp'],{type:'image/webp'}))}})};
  return {entries,requests,sizes};
}

test('downloads the small NASA variant, caches WebP and avoids all network on a repeat load',async()=>{
  const {requests,entries,sizes}=mocks();
  const result=await loadEarthTexture(new AbortController().signal);
  assert.deepEqual(requests,[earthAssets.surfaceOptimizedRemote]);
  assert.equal(result.blob.type,'image/webp');assert.equal(result.bytes,4);assert.equal(result.cached,false);
  assert.equal(sizes[0].resizeWidth,2048);assert.equal(sizes[0].resizeHeight,1024);assert.equal(entries.size,1);
  const second=await loadEarthTexture(new AbortController().signal);
  assert.equal(second.cached,true);assert.equal(requests.length,1);
  assert.equal(TEXTURE_WIDTH*TEXTURE_HEIGHT*4,8*1024*1024);
});

test('falls back to the original NASA image when the resizing service fails',async()=>{
  const {requests}=mocks({failResize:true});
  assert.equal((await loadEarthTexture(new AbortController().signal)).cached,false);
  assert.deepEqual(requests,[earthAssets.surfaceOptimizedRemote,earthAssets.surfaceRemote]);
});

test('still displays Earth when persistent cache and WebP encoding are unavailable',async()=>{
  mocks({cacheUnavailable:true,encodeUnavailable:true});
  const result=await loadEarthTexture(new AbortController().signal);
  assert.equal(result.blob.type,'image/jpeg');
});

test('does not download anything after scene disposal',async()=>{
  const {requests}=mocks();const controller=new AbortController();controller.abort();
  await assert.rejects(loadEarthTexture(controller.signal));assert.equal(requests.length,0);
});
