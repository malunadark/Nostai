import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 2); 
scene.add(ambientLight);

const loader = new GLTFLoader();
loader.load('assets/models/VS_RF.glb', function(gltf) {
  gltf.scene.scale.set(1.5, 1.5, 1.5);
  gltf.scene.position.set(0, 0, 0);
  scene.add(gltf.scene);
}, undefined, function(error) {
  console.error('Ошибка загрузки GLB модели:', error);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
