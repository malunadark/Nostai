import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap';

// === СЦЕНА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const fontLoader = new FontLoader();
const clickableObjects = [];

// === Параметры двери ===
const doorPos = { x: 0, y: 0, z: 0 };
const doorName = "PORTAL";

// === Загрузка двери ===
loader.load("assets/Door.glb", (gltf) => {
  const door = gltf.scene;
  door.scale.set(2, 2, 2);
  door.position.set(doorPos.x, doorPos.y, doorPos.z);

  door.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.6;
      child.material.depthWrite = false;
      child.material.side = THREE.DoubleSide;
      child.material.emissive = new THREE.Color(0x88ccff);
      child.material.emissiveIntensity = 0.3;

      // Пульсация
      gsap.to(child.material, { 
        opacity: 0.9, 
        duration: 2, 
        yoyo: true, 
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  });

  scene.add(door);

  // Текст над дверью
  fontLoader.load('assets/fonts/destroycyr.json', (font) => {
    const geometry = new TextGeometry(doorName, {
      font: font,
      size: 0.4,
      height: 0.05
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.set(doorPos.x - 1.5, doorPos.y + 3, doorPos.z);
    textMesh.userData.link = doorName;
    scene.add(textMesh);
    clickableObjects.push(textMesh);
  });
});

// === РУНЫ ВОКРУГ ДВЕРИ ===
fontLoader.load('assets/fonts/FutharkAoe.json', (font) => {
  const runes = [];
  const runeText = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ"]; // примеры рун

  for (let i = 0; i < runeText.length; i++) {
    const geometry = new TextGeometry(runeText[i], { font: font, size: 0.3, height: 0.05 });
    const material = new THREE.MeshBasicMaterial({ color: 0x88ccff });
    const rune = new THREE.Mesh(geometry, material);

    // случайная позиция вокруг двери
    const angle = (i / runeText.length) * Math.PI * 2;
    const radius = 2;
    rune.position.set(
      Math.cos(angle) * radius,
      1 + Math.sin(angle * 2),
      Math.sin(angle) * radius
    );

    // анимация вращения
    gsap.to(rune.rotation, { y: "+=6.28", duration: 10 + Math.random()*5, repeat: -1, ease: "linear" });

    scene.add(rune);
    runes.push(rune);
  }
});

// === ЦИКЛ АНИМАЦИИ ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === ОБНОВЛЕНИЕ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ОКНА ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
