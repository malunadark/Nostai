// ==== Импорты Three.js ====
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js';

// ==== Сцена и камера ====
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

// ==== Рендерер ====
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// ==== Контролы камеры ====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ==== Свет ====
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// ==== Куб для примера ====
const geometry = new THREE.BoxGeometry(2, 2, 0.2);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ==== Загрузка двери ====
const loader = new GLTFLoader();
loader.load(
  'assets/models/Door.glb',
  (gltf) => {
    const door = gltf.scene;
    door.position.set(0, 0, 0);
    scene.add(door);
  },
  undefined,
  (error) => console.error('Ошибка загрузки двери:', error)
);

// ==== Картина Nostai ====
const textureLoader = new THREE.TextureLoader();
const nostaiTexture = textureLoader.load('assets/images/Nostai.png');

const nostaiGeometry = new THREE.PlaneGeometry(2, 2, 100, 100);
const nostaiMaterial = new THREE.MeshStandardMaterial({
  map: nostaiTexture,
  displacementMap: nostaiTexture,
  displacementScale: 0.15,
  bumpMap: nostaiTexture,
  bumpScale: 0.25,
  transparent: true
});

const nostaiMesh = new THREE.Mesh(nostaiGeometry, nostaiMaterial);
nostaiMesh.position.set(-3, 1.5, 0); // слева от двери
scene.add(nostaiMesh);

const nostaiLight = new THREE.PointLight(0xffffff, 1.5, 10);
nostaiLight.position.set(-2, 3, 2);
scene.add(nostaiLight);

// ==== 3D Руны ====
const runes = [];
const fontLoader = new FontLoader();
fontLoader.load('assets/fonts/FutharkAoe.json', function (font) {
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x442200 });
  const runeChars = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ']; // примеры рун

  runeChars.forEach((char, i) => {
    const geometry = new TextGeometry(char, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 4,
    });
    const mesh = new THREE.Mesh(geometry, runeMaterial);
    mesh.position.set(Math.random() * 4 - 2, Math.random() * 3, Math.random() * -1);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    scene.add(mesh);
    runes.push(mesh);
  });
});

// ==== Анимация ====
function animate() {
  requestAnimationFrame(animate);

  // Вращение куба
  cube.rotation.y += 0.005;

  // Вращение картины
  nostaiMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;

  // Вращение рун
  runes.forEach((rune, i) => {
    rune.rotation.y += 0.01 + i * 0.001;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ==== Обновление при изменении размера окна ====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
