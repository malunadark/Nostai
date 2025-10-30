import * as THREE from './three.module.js';
import { FontLoader } from './loaders/FontLoader.js';
import { TextGeometry } from './loaders/TextGeometry.js';

export function createDoor(scene) {
  // === Прозрачная дверь ===
  const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1, 0);
  scene.add(door);

  // === Надпись на двери ===
  const fontLoader = new FontLoader();
  fontLoader.load('assets/fonts/destroycyr.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Хроники Забвения', {
      font: font,
      size: 0.25,
      height: 0.03,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-1.2, 2, 0);
    scene.add(textMesh);
  });

  // === Анимация открытия двери ===
  document.addEventListener('click', () => {
    const openAngle = Math.PI / 2;
    const duration = 1.5;
    let startTime = performance.now();

    function animateDoor(time) {
      const elapsed = (time - startTime) / 1000;
      if (elapsed < duration) {
        door.rotation.y = openAngle * (elapsed / duration);
        requestAnimationFrame(animateDoor);
      } else {
        door.rotation.y = openAngle;
      }
    }
    requestAnimationFrame(animateDoor);
  });
}
