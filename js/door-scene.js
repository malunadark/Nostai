import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js';

// === Сцена и камера ===
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// === Контролы ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Свет ===
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// === Фон с параллаксом ===
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('assets/images/Nostai.png');
const bgGeometry = new THREE.PlaneGeometry(10, 6, 50, 50);
const bgMaterial = new THREE.MeshStandardMaterial({
  map: bgTexture,
  displacementMap: bgTexture,
  displacementScale: 0.15,
  transparent: true
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -5);
scene.add(bgMesh);

// Параллакс при движении мыши
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  bgMesh.position.x = x * 0.5;
  bgMesh.position.y = -y * 0.5;
});

// === Дым (простая плоскость с прозрачной GIF) ===
const smokeTexture = loader.load('assets/images/smoke-fog.gif');
const smokeMaterial = new THREE.MeshBasicMaterial({ map: smokeTexture, transparent: true, opacity: 0.35 });
const smokeGeometry = new THREE.PlaneGeometry(12, 8);
const smokeMesh = new THREE.Mesh(smokeGeometry, smokeMaterial);
smokeMesh.position.set(0,0,-4.9);
scene.add(smokeMesh);

// === Руны ===
const fontLoader = new FontLoader();
fontLoader.load('assets/fonts/FutharkAoe.json', function(font){
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x442200 });
  const runes = [];
  const chars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ'];

  chars.forEach((c,i)=>{
    const geo = new TextGeometry(c,{font: font, size:0.5, height:0.05});
    const mesh = new THREE.Mesh(geo, runeMaterial);
    mesh.position.set(Math.random()*4-2, Math.random()*2+1, Math.random()*-1);
    scene.add(mesh);
    runes.push(mesh);
  });

  // Анимация рун
  function animateRunes(){
    runes.forEach((r,i)=>{
      r.rotation.y += 0.01 + i*0.002;
      const scale = 1 + Math.sin(Date.now()*0.005 + i)*0.1;
      r.scale.setScalar(scale);
    });
    requestAnimationFrame(animateRunes);
  }
  animateRunes();
});

// === Анимация сцены ===
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === Ресайз окна ===
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Музыка ===
const music = document.getElementById('bg-music');
music.volume = 0.5;
document.body.addEventListener('click', ()=>{ music.play().catch(()=>{}); });
