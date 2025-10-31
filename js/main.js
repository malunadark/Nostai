// main.js
import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { createDoorScene } from './doorScene.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

// === ЗАГРУЗКА ФОНА ===
const loader = new THREE.TextureLoader();
loader.load(
  './assets/images/Nostai.png',
  (texture) => {
    scene.background = texture;
  },
  undefined,
  (err) => console.warn('⚠️ Не удалось загрузить фон:', err)
);

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 6);

// === РЕНДЕРЕР ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === КОНТРОЛЫ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.target.set(0, 1, 0);

// === ОСВЕЩЕНИЕ ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffaa33, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// === ДВЕРЬ ===
const door = createDoorScene();
scene.add(door);

// === ДЫМ / СПРАЙТЫ ===
const smokeTexture = loader.load('./assets/images/smoke-fog.gif');
const smokeMaterial = new THREE.SpriteMaterial({
  map: smokeTexture,
  transparent: true,
  opacity: 0.25
});

const smokeGroup = new THREE.Group();
for (let i = 0; i < 15; i++) {
  const sprite = new THREE.Sprite(smokeMaterial);
  sprite.position.set(
    (Math.random() - 0.5) * 6,
    Math.random() * 3,
    (Math.random() - 0.5) * 6
  );
  sprite.scale.set(3, 3, 1);
  smokeGroup.add(sprite);
}
scene.add(smokeGroup);

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);

  // движение дыма
  smokeGroup.children.forEach((s, i) => {
    s.position.y += 0.002 + Math.random() * 0.001;
    if (s.position.y > 4) s.position.y = 0;
    s.rotation.z += 0.001 * (i + 1);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// === РЕСАЙЗ ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
