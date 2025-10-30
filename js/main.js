// === ИМПОРТЫ ===
import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/controls/OrbitControls.js';
import { createDoorScene } from './js/doorScene.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

// === ФОН ===
const loader = new THREE.TextureLoader();
loader.load(
  './assets/images/Nostai.png',
  (texture) => {
    scene.background = texture;
  },
  undefined,
  (err) => console.warn('⚠️ Не удалось загрузить фон — используется CSS фон')
);

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 5);

// === РЕНДЕР ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === СВЕТ ===
const mainLight = new THREE.PointLight(0xffa500, 2, 10);
mainLight.position.set(0, 2, 2);
scene.add(mainLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// === ПРОЗРАЧНАЯ ДВЕРЬ ===
const doorGroup = createDoorScene();
scene.add(doorGroup);

// === ДЫМ ===
const smokeTexture = loader.load('./assets/images/smoke-fog.gif');
const smokeMaterial = new THREE.SpriteMaterial({
  map: smokeTexture,
  transparent: true,
  opacity: 0.3,
});

for (let i = 0; i < 10; i++) {
  const smoke = new THREE.Sprite(smokeMaterial);
  smoke.position.set(
    (Math.random() - 0.5) * 6,
    Math.random() * 3,
    (Math.random() - 0.5) * 4
  );
  smoke.scale.set(6, 3, 1);
  smoke.rotation.z = Math.random() * Math.PI; // лёгкое вращение
  scene.add(smoke);
}

// === КОНТРОЛ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.minDistance = 2;
controls.maxDistance = 8;

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);

  // вращение двери
  doorGroup.rotation.y += 0.002;

  // мягкое пульсирующее свечение
  mainLight.intensity = 1.8 + Math.sin(Date.now() * 0.003) * 0.2;

  // вращение дыма
  scene.children.forEach((obj) => {
    if (obj.material && obj.material.map === smokeTexture) {
      obj.rotation.z += 0.001;
    }
  });

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
