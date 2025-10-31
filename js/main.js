import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { createDoorScene } from './doorScene.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 6);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 10;
controls.minDistance = 3;
controls.target.set(0, 1, 0);

// Ambient Light
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffaa33, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Door
const door = createDoorScene();
scene.add(door);

// Летающие руны
const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 });
const runeGeometry = new THREE.SphereGeometry(0.05, 12, 12);
const runes = [];
for(let i=0;i<12;i++){
  const rune = new THREE.Mesh(runeGeometry, runeMaterial);
  rune.position.set((Math.random()-0.5)*4, Math.random()*3, (Math.random()-0.5)*4);
  scene.add(rune);
  runes.push(rune);
}

// Анимация
function animate(){
  requestAnimationFrame(animate);

  door.rotation.y += 0.002;

  runes.forEach((r,i)=>{
    r.position.y += 0.004 + Math.random()*0.002;
    if(r.position.y>3) r.position.y=0;
    r.rotation.y += 0.01*(i+1);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
