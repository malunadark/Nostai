import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";

let particles = [];

export function createSmoke(scene) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("assets/images/smoke-fog.gif"); // прозрачный дым
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 50; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() * 10 - 5, Math.random() * 5, Math.random() * -5);
    mesh.rotation.z = Math.random() * Math.PI;
    scene.add(mesh);
    particles.push(mesh);
  }
}

export function animateSmoke() {
  particles.forEach(p => {
    p.rotation.z += 0.001;
    p.position.y += 0.001;
    if (p.position.y > 5) p.position.y = 0;
  });
}
