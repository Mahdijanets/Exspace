import * as THREE from 'three';
import {earthAssets} from './earth-assets.js';
import {loadEarthTexture,TEXTURE_WIDTH} from './earth-texture.js';

// An unlit material displays the day map equally on every hemisphere.
// It keeps the sphere, UVs and camera controls; scene lights cannot darken it.
export function makeEarthUnlit(root) {
  const replacements = new Map();
  root.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = false;
    object.receiveShadow = false;
    const convert = original => {
      if (!replacements.has(original)) {
        const material = new THREE.MeshBasicMaterial({
          map: original.map || null,
          color: original.color || 0xffffff,
          alphaMap: original.alphaMap || null,
          transparent: original.transparent,
          opacity: original.opacity,
          alphaTest: original.alphaTest,
          side: original.side,
          depthWrite: original.depthWrite,
          vertexColors: original.vertexColors,
          toneMapped: false
        });
        replacements.set(original, material);
      }
      return replacements.get(original);
    };
    object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
  });
  replacements.forEach((replacement, original) => original.dispose());
}

export function disposeModel(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.filter(Boolean).forEach(material => {
      materials.add(material);
      Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
    });
  });
  textures.forEach(texture => texture.dispose());
  materials.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose());
}

export function normalizeEarth(model, radius = 2.05) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const diameter = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(diameter) || diameter <= 0) throw new Error('Invalid Earth bounds');
  // Keep the original hierarchy/materials and centre it inside a new pivot.
  const pivot = new THREE.Group();
  const offset = new THREE.Group();
  offset.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-1);
  offset.add(model); pivot.add(offset);
  pivot.scale.setScalar(radius * 2 / diameter);
  pivot.rotation.z = THREE.MathUtils.degToRad(23.44);
  pivot.rotation.y = 2.8;
  return pivot;
}

export async function upgradeEarth({placeholder, parent, renderer, signal, onStatus, onCredit}) {
  onStatus('Loading detailed NASA Earth…');
  // A downloaded GLB wins. No unverified remote GLB URLs or silent model substitution.
  try {
    const response = earthAssets.model ? await fetch(earthAssets.model, {signal}) : null;
    if (response?.ok) {
      const buffer = await response.arrayBuffer();
      if (signal.aborted) return;
      if (new DataView(buffer).getUint32(0, true) !== 0x46546c67) throw new Error('Not a GLB');
      const {GLTFLoader} = await import('three/addons/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      const gltf = await loader.parseAsync(buffer, new URL('assets/earth/', location.href).href);
      const model = normalizeEarth(gltf.scene);
      makeEarthUnlit(model);
      if (signal.aborted) { disposeModel(model); return; }
      model.traverse(object => {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.filter(Boolean).forEach(material => {
          Object.values(material).forEach(value => {
            if (value?.isTexture) value.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          });
        });
      });
      parent.add(model); parent.remove(placeholder); disposeModel(placeholder);
      onCredit('NASA / VTAD · Earth with Clouds', earthAssets.modelSource);
      onStatus('');
      return;
    }
  } catch (error) { if (signal.aborted) return; }

  // A real NASA surface map still makes the existing interactive globe detailed.
  {
    if (signal.aborted) return;
    try {
      const result = await loadEarthTexture(signal);
      const {blob} = result;
      const width = Math.min(TEXTURE_WIDTH, renderer.capabilities.maxTextureSize);
      const bitmap = await createImageBitmap(blob, {imageOrientation: 'flipY', resizeWidth: width, resizeHeight: width / 2, resizeQuality: 'high'});
      if (signal.aborted) { bitmap.close(); return; }
      const texture = new THREE.CanvasTexture(bitmap);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      // Release the decoded bitmap only when this texture is no longer used.
      texture.addEventListener('dispose', () => bitmap.close());
      placeholder.material.map.dispose();
      placeholder.material.map = texture;
      placeholder.material.roughness = .85;
      placeholder.material.needsUpdate = true;
      placeholder.userData.textureBytes = result.bytes;
      placeholder.userData.textureCached = result.cached;
      placeholder.userData.textureDownloadBytes = result.downloadBytes || 0;
      onCredit('NASA Earth Observatory · Blue Marble', earthAssets.surfaceSource);
      onStatus('');
      return;
    } catch (error) { if (signal.aborted) return; }
  }
  onStatus('NASA data could not load. Showing the simplified Earth.');
}
