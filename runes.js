import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";

let runes = [];

export function loadRunes(scene) {
  const textureLoader = new THREE.TextureLoader();
  const runeTexture = textureLoader.load("assets/images/руны.png");

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: runeTexture,
    transparent: true,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 5; i++) {
    const rune = new THREE.Mesh(geometry, material.clone());
    rune.position.set(Math.random() * 6 - 3, Math.random() * 3 + 1, Math.random() * -4);
    scene.add(rune);
    runes.push(rune);
  }
}

export function animateRunes() {
  runes.forEach(r => {
    r.rotation.y += 0.01;
    r.rotation.z += 0.005;
    r.position.y += Math.sin(Date.now() * 0.001 + r.position.x) * 0.002;
  });
}
