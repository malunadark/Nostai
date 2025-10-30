import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { createDoorScene } from './doorScene.js';

// === СЦЕНА ===
const scene = new THREE.Scene();

// === ФОН ===
new THREE.TextureLoader().load('../assets/images/Nostai.png', texture => {
  scene.background = texture;
});

// === КАМЕРА ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,1.5,5);

// === РЕНДЕР ===
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === СВЕТ ===
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(3,5,5);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff,0.4));

// === ДОБАВЛЕНИЕ ПРОЗРАЧНОЙ ДВЕРИ ===
const doorGroup = createDoorScene();
scene.add(doorGroup);

// === КОНТРОЛЫ ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

// === АНИМАЦИЯ ===
function animate(){
  requestAnimationFrame(animate);
  doorGroup.rotation.y += 0.002; // лёгкое вращение
  controls.update();
  renderer.render(scene,camera);
}
animate();

// === АДАПТИВ ===
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
