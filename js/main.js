// THREE.js и утилиты с CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js";

// Локальные модули
import { loadDoors, animateDoors } from './doors.js';
import { loadRunes, animateRunes } from './runes.js';
import { setupParallax } from './parallax.js';
import { createSmoke, animateSmoke } from './smoke.js';
import { setupMusic, toggleMusic } from './music.js';

// Сцена
const container = document.getElementById("scene-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Контролы
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// Эффекты
setupParallax(container);
createSmoke(scene);

// Дверь и руны
loadDoors(scene);
loadRunes(scene);

// Музыка
setupMusic();
document.getElementById("toggle-music")?.addEventListener("click", toggleMusic);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateDoors();
  animateRunes();
  animateSmoke();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
