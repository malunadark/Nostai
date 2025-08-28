// ========================
// door-scene.js
// ========================

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ========================
// СЦЕНА И КАМЕРА
// ========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ========================
// СВЕТ
// ========================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// ========================
// ЗАГРУЗКА ДВЕРИ
// ========================
const loader = new GLTFLoader();
loader.load(
  '../assets/models/Door (1).glb',
  (gltf) => {
    const door = gltf.scene;
    door.position.set(0, 0, 0);
    scene.add(door);
  },
  undefined,
  (error) => console.error(error)
);

// ========================
// КАРТИНА NOSTAI
// ========================
const textureLoader = new THREE.TextureLoader();
const nostaiTexture = textureLoader.load('../assets/images/Nostai.png');

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
nostaiMesh.position.set(-3, 1.5, 0);
scene.add(nostaiMesh);

const nostaiLight = new THREE.PointLight(0xffffff, 1.5, 10);
nostaiLight.position.set(-2, 3, 2);
scene.add(nostaiLight);

// ========================
// ДЫМ (простая частица)
// ========================
const smokeTexture = textureLoader.load('../assets/images/smoke-fog.png');
const smokeMaterial = new THREE.SpriteMaterial({ map: smokeTexture, transparent: true, opacity: 0.5 });
for (let i = 0; i < 30; i++) {
  const sprite = new THREE.Sprite(smokeMaterial);
  sprite.position.set(Math.random() * 4 - 2, Math.random() * 2, Math.random() * -2);
  sprite.scale.set(2, 2, 1);
  scene.add(sprite);
}

// ========================
// ========================
// РУНЫ (3D текст)
// ========================
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const fontLoader = new FontLoader();
fontLoader.load('../assets/fonts/FutharkAoe.json', function (font) {
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x442200 });

  const runes = [];
  const runeChars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ']; // примеры рун, можешь заменить на свои

  runeChars.forEach((char, i) => {
    const geometry = new TextGeometry(char, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 4,
    });
    const mesh = new THREE.Mesh(geometry, runeMaterial);

    // случайное положение
    mesh.position.set(Math.random() * 4 - 2, Math.random() * 3, Math.random() * -1);
    mesh.rotation.y = Math.random() * Math.PI * 2;

    scene.add(mesh);
    runes.push(mesh);
  });

  // Анимация рун
  function animateRunes() {
    runes.forEach((rune, i) => {
      rune.rotation.y += 0.01 + i * 0.001;
    });
    requestAnimationFrame(animateRunes);
  }
  animateRunes();
});


// ========================
// АНИМАЦИИ
// ========================
function animate() {
  requestAnimationFrame(animate);

  // Лёгкое покачивание картины
  nostaiMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;

  // Руна вращается
  runes.forEach((rune, i) => {
    rune.rotation.z += 0.01 + i * 0.001;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ========================
// ОБНОВЛЕНИЕ РАЗМЕРА
// ========================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
