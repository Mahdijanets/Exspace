import * as THREE from '../vendor/three/three.module.js';
import { GLTFLoader } from '../vendor/three/loaders/GLTFLoader.js';
import { DRACOLoader } from '../vendor/three/loaders/DRACOLoader.js';

export async function mountModel(button, isOpen, reduced) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(116, 124);
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6478aa, 3));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 4);
  scene.add(light);
  const draco = new DRACOLoader();
  draco.setDecoderPath(new URL('../games/the-way-home/draco/', import.meta.url).href);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let gltf;
  try { gltf = await loader.loadAsync(new URL('../games/the-way-home/models/akustik.glb', import.meta.url).href); }
  catch (error) { draco.dispose(); renderer.dispose(); throw error; }
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = 1.8 / Math.max(size.y, size.x, size.z);
  const holder = new THREE.Group();
  holder.scale.setScalar(scale);
  holder.position.copy(center).multiplyScalar(-scale);
  holder.add(model);
  scene.add(holder);
  const camera = new THREE.PerspectiveCamera(34, 116 / 124, .01, 100);
  camera.position.set(0, .1, 3.8);
  camera.lookAt(0, 0, 0);
  const mixer = new THREE.AnimationMixer(model);
  const clips = Object.fromEntries(gltf.animations.map(clip => [clip.name.toLowerCase(), mixer.clipAction(clip)]));
  let current;
  function animateClip(name) {
    const next = clips[name] || clips.idle;
    if (next === current || !next) return;
    current?.fadeOut(.3);
    next.reset().fadeIn(.3).play();
    current = next;
  }
  animateClip('idle');
  renderer.domElement.setAttribute('aria-hidden', 'true');
  button.prepend(renderer.domElement);
  button.querySelector('img').style.visibility = 'hidden';
  let previous = 0;
  function frame(time) {
    requestAnimationFrame(frame);
    if (document.hidden || time - previous < 33) return;
    const delta = Math.min((time - previous) / 1000, .1);
    previous = time;
    if (!reduced.matches) {
      const walking = !isOpen() && time % 6500 < 3000;
      animateClip(isOpen() ? 'interact' : walking ? 'walk' : 'idle');
      mixer.update(delta);
      holder.rotation.y = walking ? Math.sin(time / 3000) * .5 : .12;
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  draco.dispose();
}
