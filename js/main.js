import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { createDoor } from './door.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

// === РЕНДЕР ===
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === СВЕТ ===
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1));

// === КОНТРОЛЛЕР ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === ДОБАВЛЯЕМ ДВЕРЬ ===
createDoor(scene);

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === АДАПТИВ ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
