import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 5);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Свет
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(0, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambient);

// Туман
scene.fog = new THREE.FogExp2(0x000000, 0.15);

// Прозрачная дверь (рамка + стекло)
const doorGroup = new THREE.Group();

// Рамка двери
const frameGeo = new THREE.BoxGeometry(2.2, 3.2, 0.1);
const frameMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.6,
  roughness: 0.3,
});
const frame = new THREE.Mesh(frameGeo, frameMat);
doorGroup.add(frame);

// "Стекло"
const glassGeo = new THREE.PlaneGeometry(1.8, 2.8);
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x88aaff,
  transparent: true,
  opacity: 0.15,
  transmission: 0.95,
  reflectivity: 1,
  roughness: 0.05,
  clearcoat: 1,
});
const glass = new THREE.Mesh(glassGeo, glassMat);
glass.position.z = 0.055;
doorGroup.add(glass);

scene.add(doorGroup);

// Надпись "Хроники Забвения"
const loader = new THREE.FontLoader();
loader.load('assets/fonts/destroycyr.typeface.json', (font) => {
  const textGeo = new THREE.TextGeometry('Хроники Забвения', {
    font: font,
    size: 0.3,
    height: 0.05,
    curveSegments: 8,
    bevelEnabled: false,
  });
  const textMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x8888ff,
    emissiveIntensity: 0.8,
  });
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-1.3, -2, 0.2);
  doorGroup.add(textMesh);
});

// Орбит-контрол
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Анимация лёгкого парения двери
function animate() {
  requestAnimationFrame(animate);
  doorGroup.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Адаптивность
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
