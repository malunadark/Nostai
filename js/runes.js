import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";
import { FontLoader } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js";

let runes = [];

export function loadRunes(scene) {
  const loader = new FontLoader();
  loader.load('assets/fonts/FutharkAoe.ttf', function(font) {
    const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    for (let i = 0; i < 5; i++) {
      const geometry = new TextGeometry("ᚠ", { font: font, size: 0.5, height: 0.05 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.random() * 4 - 2, Math.random() * 2 + 1, Math.random() * -2);
      scene.add(mesh);
      runes.push(mesh);
    }
  });
}

export function animateRunes() {
  runes.forEach(r => {
    r.rotation.y += 0.01;
    r.position.y += Math.sin(Date.now() * 0.001) * 0.001;
  });
}
