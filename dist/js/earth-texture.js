import {earthAssets} from './earth-assets.js';

export const TEXTURE_WIDTH = 2048;
export const TEXTURE_HEIGHT = 1024;
const CACHE = 'acustik-earth-texture-v1';
const CACHE_KEY = new URL('../assets/earth/cached-bathymetry-june-2048.webp', import.meta.url).href;

async function openCache() {
  try { return await globalThis.caches?.open(CACHE); } catch { return undefined; }
}

async function fetchTexture(url, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal.reason);
  signal.addEventListener('abort', abort, {once: true});
  if (signal.aborted) abort();
  const timer = setTimeout(() => controller.abort(), url === earthAssets.surfaceOptimizedRemote ? 4000 : 12000);
  try {
    const response = await fetch(url, {signal: controller.signal, cache: 'force-cache'});
    if (!response.ok) throw new Error(`Earth texture HTTP ${response.status}`);
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) throw new Error('Earth texture is not an image');
    return blob;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', abort);
  }
}

function encodeTexture(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
}

export async function loadEarthTexture(signal) {
  const cache = await openCache();
  if (signal.aborted) throw signal.reason;
  if (cache) {
    try {
      const hit = await cache.match(CACHE_KEY);
      if (hit) {
        const blob = await hit.blob();
        // Reject a corrupt cache entry before using it; fetch a fresh copy instead.
        const image = await createImageBitmap(blob);
        image.close();
        return {blob, cached: true, bytes: blob.size};
      }
    } catch { /* An unavailable/corrupt cache must not prevent first-load rendering. */ }
  }

  const sources = [earthAssets.surface, earthAssets.surfaceOptimizedRemote, earthAssets.surfaceRemote].filter(Boolean);
  let lastError;
  for (const source of sources) {
    if (signal.aborted) throw signal.reason;
    try {
      const original = await fetchTexture(source, signal);
      const image = await createImageBitmap(original, {resizeWidth: TEXTURE_WIDTH, resizeHeight: TEXTURE_HEIGHT, resizeQuality: 'high'});
      if (signal.aborted) { image.close(); throw signal.reason; }
      // Resize once, then persist the small WebP instead of downloading/reprocessing the original.
      let optimized;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = TEXTURE_WIDTH; canvas.height = TEXTURE_HEIGHT;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(image, 0, 0);
          optimized = await encodeTexture(canvas);
        }
      } catch { /* Display the downloaded image even if WebP encoding is unavailable. */ }
      finally { image.close(); }
      const blob = optimized || original;
      if (signal.aborted) throw signal.reason;
      // Cache failure (for example private mode/quota) is non-fatal.
      if (cache && optimized) {
        try { await cache.put(CACHE_KEY, new Response(blob, {headers: {'Content-Type': blob.type}})); } catch {}
      }
      return {blob, cached: false, bytes: blob.size, downloadBytes: original.size};
    } catch (error) { lastError = error; }
  }
  throw lastError || new Error('No Earth texture source');
}
