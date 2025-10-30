import * as THREE from './three.module.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { FontLoader } from './loaders/FontLoader.js';
import { TextGeometry } from './loaders/TextGeometry.js';

// Функция создания двери
export function createDoor(scene) {
  const loader = new GLTFLoader();

  loader.load(
    'assets/models/door_optimized.glb',
    (gltf) => {
      const door = gltf.scene;
      door.position.set(0, 0, 0);
      door.scale.set(1.5, 1.5, 1.5);
      scene.add(door);

      console.log('✅ Дверь загружена');

      // --- Текст "Хроники Забвения" ---
      const fontLoader = new FontLoader();
      fontLoader.load('assets/fonts/destroycyr.json', (font) => {
        const textGeometry = new TextGeometry('Хроники Забвения', {
          font: font,
          size: 0.25,
          height: 0.03,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-1.2, 2, 0);
        scene.add(textMesh);
      });

      // --- Анимация открытия двери ---
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
    },
    (xhr) => console.log(`Загрузка двери: ${ (xhr.loaded / xhr.total * 100).toFixed(0) }%`),
    (error) => console.error('❌ Ошибка загрузки двери:', error)
  );
}
