import {mkdirSync,copyFileSync,readFileSync,writeFileSync} from 'node:fs';
// Optional local vendoring after `npm install three@0.180.0 --save-exact`.
mkdirSync('dist/vendor/three/addons/controls',{recursive:true});
mkdirSync('dist/vendor/three/addons/loaders',{recursive:true});
mkdirSync('dist/vendor/three/addons/utils',{recursive:true});
for(const file of ['three.module.js','three.core.js'])copyFileSync(`node_modules/three/build/${file}`,`dist/vendor/three/${file}`);
copyFileSync('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/three/addons/controls/OrbitControls.js');
copyFileSync('node_modules/three/examples/jsm/loaders/GLTFLoader.js','dist/vendor/three/addons/loaders/GLTFLoader.js');
copyFileSync('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js','dist/vendor/three/addons/utils/BufferGeometryUtils.js');
copyFileSync('node_modules/three/LICENSE','dist/vendor/three/LICENSE');
for(const page of ['index','solar']){const path=`dist/${page}.html`;writeFileSync(path,readFileSync(path,'utf8').replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js','./vendor/three/three.module.js').replaceAll('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/','./vendor/three/addons/'))}
console.log('Three.js installed locally.');
