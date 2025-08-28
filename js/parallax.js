import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { scene } from './door-scene.js';

const loader = new THREE.TextureLoader();
const texture = loader.load('assets/images/Nostai.png');

const geometry = new THREE.PlaneGeometry(10, 6);
const material = new THREE.MeshBasicMaterial({ map: texture });
const background = new THREE.Mesh(geometry, material);

background.position.set(0, 0, -5);
scene.add(background);

window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 0.5;
  const y = (event.clientY / window.innerHeight - 0.5) * 0.5;
  background.position.x = x;
  background.position.y = -y;
});
