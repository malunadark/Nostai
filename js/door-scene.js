import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js';

// ==== Сцена ====
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ==== Свет ====
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// ==== Простая геометрия двери (пример) ====
const loader = new GLTFLoader();
loader.load(
  'assets/models/Door.glb',
  (gltf) => {
    const door = gltf.scene;
    door.position.set(0,0,0);
    scene.add(door);
  },
  undefined,
  (err) => console.error(err)
);

// ==== Nostai картинка с параллакс-эффектом ====
const textureLoader = new THREE.TextureLoader();
const nostaiTexture = textureLoader.load('assets/images/Nostai.png');

const nostaiGeometry = new THREE.PlaneGeometry(3, 2, 100, 100);
const nostaiMaterial = new THREE.MeshStandardMaterial({
  map: nostaiTexture,
  displacementMap: nostaiTexture,
  displacementScale: 0.1,
  bumpMap: nostaiTexture,
  bumpScale: 0.2,
  transparent: true
});
const nostaiMesh = new THREE.Mesh(nostaiGeometry, nostaiMaterial);
nostaiMesh.position.set(-3, 1.5, 0);
scene.add(nostaiMesh);

const nostaiLight = new THREE.PointLight(0xffffff, 1.5, 10);
nostaiLight.position.set(-2, 3, 2);
scene.add(nostaiLight);

// ==== Руны с пульсацией ====
const fontLoader = new FontLoader();
fontLoader.load('assets/fonts/FutharkAoe.json', (font) => {
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x442200 });
  const runes = [];
  const runeChars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ'];

  runeChars.forEach((char, i) => {
    const geom = new TextGeometry(char, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 4
    });
    const mesh = new THREE.Mesh(geom, runeMaterial);
    mesh.position.set(Math.random()*4-2, Math.random()*3, Math.random()*-1);
    scene.add(mesh);
    runes.push(mesh);
  });

  function animateRunes() {
    runes.forEach((rune,i)=>{
      rune.rotation.y += 0.01 + i*0.001;
      const scale = 1 + Math.sin(Date.now()*0.003 + i)*0.1;
      rune.scale.set(scale, scale, scale);
    });
    requestAnimationFrame(animateRunes);
  }
  animateRunes();
});

// ==== Анимация сцены ====
function animate(){
  requestAnimationFrame(animate);
  nostaiMesh.rotation.y = Math.sin(Date.now()*0.001)*0.15;
  controls.update();
  renderer.render(scene,camera);
}
animate();

// ==== Обновление при изменении окна ====
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==== Музыка ====
const music = document.getElementById('bg-music');
music.volume = 0.5;

const musicBtn = document.getElementById('music-toggle');
musicBtn.addEventListener('click', ()=>{
  if(music.paused){
    music.play();
    musicBtn.textContent = "⏸ Пауза";
  } else {
    music.pause();
    musicBtn.textContent = "▶ Воспроизвести";
  }
});
