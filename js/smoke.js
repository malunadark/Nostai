import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";

let smokeParticles = [];

export function createSmoke(scene) {
  const textureLoader = new THREE.TextureLoader();
  const smokeTexture = textureLoader.load("assets/images/smoke-fog.gif");

  const geometry = new THREE.PlaneGeometry(5, 5);
  const material = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: 0.5
  });

  for (let i = 0; i < 10; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(Math.random() * 10 - 5, Math.random() * 5, Math.random() * -5);
    scene.add(particle);
    smokeParticles.push(particle);
  }
}

export function animateSmoke() {
  smokeParticles.forEach(p => {
    p.rotation.z += 0.001;
    p.position.y += 0.001;
    if (p.position.y > 5) p.position.y = 0;
  });
}
