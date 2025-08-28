import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { scene } from './door-scene.js';

const particles = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const smokeTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/smoke.png');

for (let i = 0; i < 50; i++) {
  const material = new THREE.SpriteMaterial({ map: smokeTexture, opacity: 0.2 });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(Math.random()*6-3, Math.random()*4, Math.random()*6-3);
  sprite.scale.set(2,2,2);
  particles.add(sprite);
}
scene.add(particles);

function animateSmoke() {
  particles.children.forEach(p => {
    p.rotation += 0.002;
  });
  requestAnimationFrame(animateSmoke);
}
animateSmoke();
