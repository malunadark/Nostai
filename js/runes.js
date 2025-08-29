import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js";

let runes = [];

export function loadRunes(scene) {
  const loader = new THREE.FontLoader();
  
  loader.load('assets/fonts/FutharkAoe.ttf', function(font) {
    const runeChars = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ"]; // пример рун
    runeChars.forEach((char, i) => {
      const geometry = new THREE.TextGeometry(char, {
        font: font,
        size: 0.5,
        height: 0.05,
      });
      const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(i - 2, 1, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      runes.push(mesh);
    });
  });
}

export function animateRunes() {
  runes.forEach(r => {
    r.rotation.y += 0.01;
    r.position.y += Math.sin(Date.now() * 0.001 + r.position.x) * 0.001;
  });
}

