import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.0/examples/jsm/controls/OrbitControls.js';

// === Сцена ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 5);
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Raycaster для кликов
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let clickableObjects = [];

// Загружаем дверь
const loader = new GLTFLoader();
loader.load('assets/Door.glb', (gltf) => {
  const door = gltf.scene;
  door.scale.set(1.5, 1.5, 1.5);
  door.position.set(0, 0, 0);

  door.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.95;
      if (child.material.emissive) {
        child.material.emissive.setHex(0x55aaff);
        child.material.emissiveIntensity = 0.6;
      }
      clickableObjects.push(child);
    }
  });

  scene.add(door);
});

// Рендер
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Клик по двери
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjects);
  if (intersects.length > 0) {
    document.getElementById('modal-title').innerText = "Порог Тайны";
    document.getElementById('modal-text').innerText =
      "💧 Ты прикоснулась к двери. Врата раскрывают путь между мирами...";
    document.getElementById('modal').style.display = 'block';
  }
});

// Модалка закрыть
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Мут/плей аудио
const audio = document.getElementById('bg-audio');
const muteBtn = document.getElementById('mute-btn');

muteBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    muteBtn.textContent = '🔊';
  } else {
    audio.pause();
    muteBtn.textContent = '🔇';
  }
});

// Летающие руны
function createRune() {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.innerText = ['ᚠ','ᛉ','ᛏ','ᛃ','ᛗ','ᚨ'][Math.floor(Math.random() * 6)];
  rune.style.left = Math.random() * 100 + 'vw';
  rune.style.fontSize = (Math.random() * 20 + 20) + 'px';
  rune.style.animationDuration = (Math.random() * 10 + 10) + 's';
  document.getElementById('flying-runes').appendChild(rune);
  setTimeout(() => rune.remove(), 15000);
}
setInterval(createRune, 1000);
