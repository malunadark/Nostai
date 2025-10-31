import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { createDoorScene } from './doorScene.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

// === ФОН ===
const loader = new THREE.TextureLoader();
loader.load(
  './assets/images/Nostai.png',
  texture => scene.background = texture,
  undefined,
  err => console.warn('⚠️ Не удалось загрузить фон:', err)
);

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 6);

// === РЕНДЕРЕР ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === КОНТРОЛЫ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 10;
controls.minDistance = 3;
controls.target.set(0, 1, 0);

// === ОСВЕЩЕНИЕ ===
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffaa33, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// === ПРОЗРАЧНАЯ ДВЕРЬ ===
const doorGroup = createDoorScene();
scene.add(doorGroup);

// === ДЫМ ===
const smokeTexture = loader.load('./assets/images/smoke-fog.gif');
const smokeMaterial = new THREE.SpriteMaterial({ map: smokeTexture, transparent: true, opacity: 0.3 });
const smokeGroup = new THREE.Group();
for (let i = 0; i < 15; i++) {
  const sprite = new THREE.Sprite(smokeMaterial);
  sprite.position.set((Math.random() - 0.5) * 6, Math.random() * 3, (Math.random() - 0.5) * 6);
  sprite.scale.set(3, 3, 1);
  smokeGroup.add(sprite);
}
scene.add(smokeGroup);

// === ЛЕТАЮЩИЕ РУНЫ (пример) ===
const runeTexture = loader.load('./assets/images/руны.png');
const runeMaterial = new THREE.SpriteMaterial({ map: runeTexture, transparent: true, opacity: 0.8 });
const runes = [];
for (let i = 0; i < 10; i++) {
  const rune = new THREE.Sprite(runeMaterial);
  rune.position.set((Math.random() - 0.5) * 6, Math.random() * 3, (Math.random() - 0.5) * 6);
  rune.scale.set(0.5, 0.5, 0.5);
  scene.add(rune);
  runes.push(rune);
}

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);

  // Дым
  smokeGroup.children.forEach((s, i) => {
    s.position.y += 0.002 + Math.random() * 0.001;
    if (s.position.y > 4) s.position.y = 0;
    s.rotation.z += 0.001 * (i + 1);
  });

  // Руны
  runes.forEach((r, i) => {
    r.position.y += 0.003 + Math.random() * 0.002;
    if (r.position.y > 4) r.position.y = 0;
    r.rotation.z += 0.002 * (i + 1);
  });

  // Плавная анимация двери
  doorGroup.rotation.y += 0.002;

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
