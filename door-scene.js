// ====== Импорты Three.js ======
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js";

// ====== Сцена ======
const container = document.getElementById("scene-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ====== Свет ======
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ====== Параллакс-фон ======
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("assets/images/Nostai.png");

const bgGeometry = new THREE.PlaneGeometry(20, 12, 100, 100);
const bgMaterial = new THREE.MeshStandardMaterial({
  map: bgTexture,
  displacementMap: bgTexture,
  displacementScale: 0.3,
  bumpMap: bgTexture,
  bumpScale: 0.4,
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -5);
scene.add(bgMesh);

// ====== Дым ======
const smokeTexture = textureLoader.load("assets/images/smoke-fog.gif");
const smokeMaterial = new THREE.MeshBasicMaterial({
  map: smokeTexture,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
});
const smokeGeometry = new THREE.PlaneGeometry(20, 12);
const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.set(0, 0, -4.9);
scene.add(smoke);

// ====== Руны ======
const fontLoader = new FontLoader();
fontLoader.load("assets/fonts/FutharkAoe.json", (font) => {
  const runeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    emissive: 0x442200,
    emissiveIntensity: 0.6,
  });

  const runeChars = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ"];
  const runes = [];

  runeChars.forEach((char, i) => {
    const geometry = new TextGeometry(char, {
      font: font,
      size: 0.6,
      height: 0.05,
      curveSegments: 4,
    });
    const mesh = new THREE.Mesh(geometry, runeMaterial);
    mesh.position.set(Math.random() * 6 - 3, Math.random() * 4 - 2, Math.random() * 2 - 1);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    scene.add(mesh);
    runes.push(mesh);
  });

  // Анимация рун
  function animateRunes() {
    runes.forEach((rune, i) => {
      rune.rotation.y += 0.01 + i * 0.002;
      rune.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + i) * 0.2);
    });
    requestAnimationFrame(animateRunes);
  }
  animateRunes();
});

// ====== Музыка ======
const bgMusic = document.getElementById("bg-music");
document.body.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
});

// ====== Анимация сцены ======
function animate() {
  requestAnimationFrame(animate);

  // параллакс фона
  bgMesh.rotation.y = Math.sin(Date.now() * 0.0003) * 0.1;
  smoke.material.map.offset.x += 0.0005;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ====== Resize ======
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
