import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/geometries/TextGeometry.js';
import { scene } from './door-scene.js';

const loader = new FontLoader();
loader.load('assets/fonts/FutharkAoe.json', (font) => {
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x442200 });
  const runes = [];
  const chars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ'];

  chars.forEach((char, i) => {
    const geometry = new TextGeometry(char, { font, size: 0.5, height: 0.05 });
    const mesh = new THREE.Mesh(geometry, runeMaterial);
    mesh.position.set(Math.random() * 4 - 2, Math.random() * 3, Math.random() * -1);
    scene.add(mesh);
    runes.push(mesh);
  });

  function animateRunes() {
    runes.forEach((rune, i) => {
      rune.rotation.y += 0.01 + i * 0.001;
      rune.scale.setScalar(1 + Math.sin(Date.now() * 0.003 + i) * 0.1);
    });
    requestAnimationFrame(animateRunes);
  }
  animateRunes();
});
