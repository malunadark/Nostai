import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

// === СЦЕНА ===
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.12);

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

// === РЕНДЕР ===
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === СВЕТ ===
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 2, 5);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// === ПРОЗРАЧНАЯ 3D-ДВЕРЬ ===
const doorGroup = new THREE.Group();

// Рама двери
const frameGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);
const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.4 });
const frame = new THREE.Mesh(frameGeometry, frameMaterial);
doorGroup.add(frame);

// Стекло
const glassGeometry = new THREE.PlaneGeometry(1.8, 2.8);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x88aaff,
  transparent: true,
  opacity: 0.1,
  transmission: 0.95,
  reflectivity: 1,
  roughness: 0.05,
  clearcoat: 1,
});
const glass = new THREE.Mesh(glassGeometry, glassMaterial);
glass.position.z = 0.055;
doorGroup.add(glass);

// Надпись на двери через canvas
const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 256;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(0,0,0,0)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = '80px DestroyCyr';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = '#ff6600';
ctx.shadowBlur = 20;
ctx.fillText('Хроники Забвения', canvas.width / 2, canvas.height / 2);

const texture = new THREE.CanvasTexture(canvas);
const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.8), textMaterial);
textMesh.position.set(0, 1, 0.06); // надпись чуть выше центра двери
doorGroup.add(textMesh);

// Добавляем дверь в сцену
scene.add(doorGroup);

// === КОНТРОЛЬ КАМЕРЫ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// === КЛИК ДЛЯ ОТКРЫТИЯ ДВЕРИ ===
let doorOpened = false;
document.addEventListener('click', () => {
  if (doorOpened) return;
  doorOpened = true;
  const duration = 1.5;
  const targetAngle = Math.PI / 2;
  const startTime = performance.now();

  function openDoor(time) {
    const elapsed = (time - startTime) / 1000;
    if (elapsed < duration) {
      doorGroup.rotation.y = targetAngle * (elapsed / duration);
      requestAnimationFrame(openDoor);
    } else {
      doorGroup.rotation.y = targetAngle;
      // Здесь можно добавить переход на другую страницу
      // window.location.href = 'nextPage.html';
    }
  }
  requestAnimationFrame(openDoor);
});

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
