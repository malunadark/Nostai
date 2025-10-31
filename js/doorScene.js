import * as THREE from './three.module.js';

export function createDoorScene() {
  const doorGroup = new THREE.Group();

  // === РАМА ДВЕРИ ===
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 3.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4 })
  );
  doorGroup.add(frame);

  // === ПРОЗРАЧНОЕ СТЕКЛО ===
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 2.8),
    new THREE.MeshPhysicalMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.2,
      transmission: 0.95,
      reflectivity: 1,
      roughness: 0.05,
      clearcoat: 1
    })
  );
  glass.position.z = 0.055;
  doorGroup.add(glass);

  // === НАДПИСЬ НА ДВЕРИ ===
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.font = '80px DestroyCyr';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff6600';
  ctx.shadowBlur = 20;
  ctx.fillText('Хроники Забвения', canvas.width / 2, canvas.height / 2);

  const textTexture = new THREE.CanvasTexture(canvas);
  const textMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 0.8),
    new THREE.MeshBasicMaterial({ map: textTexture, transparent: true })
  );
  textMesh.position.set(0, 1, 0.06);
  doorGroup.add(textMesh);

  // === АНИМАЦИЯ ОТКРЫТИЯ ДВЕРИ ===
  let opened = false;
  document.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    const duration = 1.5;
    const start = performance.now();

    function rotate(time) {
      const t = (time - start) / 1000;
      if (t < duration) {
        doorGroup.rotation.y = Math.PI / 2 * (t / duration);
        requestAnimationFrame(rotate);
      } else {
        doorGroup.rotation.y = Math.PI / 2;
      }
    }
    requestAnimationFrame(rotate);
  });

  return doorGroup;
}
