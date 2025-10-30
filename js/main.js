import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

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

// === ПРОЗРАЧНАЯ ДВЕРЬ ===
const doorGroup = new THREE.Group();

// рама двери
const frameGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);
const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.5,
  roughness: 0.4,
});
const frame = new THREE.Mesh(frameGeometry, frameMaterial);
doorGroup.add(frame);

// стекло
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

scene.add(doorGroup);

// === НАДПИСЬ "ХРОНИКИ ЗАБВЕНИЯ" ===
// создаём текстуру через canvas, чтобы использовать твой ttf
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 256;

ctx.fillStyle = 'rgba(0, 0, 0, 0)';
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
const textGeometry = new THREE.PlaneGeometry(3, 0.8);
const textMesh = new THREE.Mesh(textGeometry, textMaterial);
textMesh.position.set(0, -2.2, 0.2);
doorGroup.add(textMesh);

// === ТУМАН ===
scene.fog = new THREE.FogExp2(0x000000, 0.15);

// === КОНТРОЛ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);
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
