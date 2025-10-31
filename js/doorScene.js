import * as THREE from './three.module.js';

// Функция создания сцены с дверью и "за ней"
export function createDoorScene() {
  const group = new THREE.Group();

  // === Рама двери ===
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 3.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4 })
  );
  group.add(frame);

  // === Прозрачное стекло двери ===
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 2.8),
    new THREE.MeshPhysicalMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.15,
      transmission: 0.95,
      reflectivity: 1,
      roughness: 0.05,
      clearcoat: 1
    })
  );
  glass.position.z = 0.055;
  group.add(glass);

  // === Надпись на двери ===
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
  group.add(textMesh);

  // === Люди за дверью ===
  const peopleGroup = new THREE.Group();
  const personGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.7, 8);
  const personMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.6 });

  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(personGeometry, personMaterial);
    p.position.set((Math.random() - 0.5) * 2, 0.85, -1.5 - Math.random()); // чуть дальше двери
    peopleGroup.add(p);
  }
  group.add(peopleGroup);

  // === Руны летают за дверью ===
  const runeGeometry = new THREE.TetrahedronGeometry(0.05);
  const runeMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff6600 });
  const runes = [];
  for (let i = 0; i < 10; i++) {
    const rune = new THREE.Mesh(runeGeometry, runeMaterial);
    rune.position.set((Math.random() - 0.5) * 3, Math.random() * 2, -1.5 - Math.random());
    group.add(rune);
    runes.push(rune);
  }

  // === Дым ===
  const smokeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
  });
  const smokeGroup = new THREE.Group();
  for (let i = 0; i < 15; i++) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), smokeMaterial);
    s.position.set((Math.random() - 0.5) * 3, Math.random() * 2, -1.3 - Math.random());
    s.rotation.z = Math.random() * Math.PI;
    smokeGroup.add(s);
  }
  group.add(smokeGroup);

  // === Анимация двери ===
  let opened = false;
  document.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    const duration = 1.5;
    const start = performance.now();

    function rotate(time) {
      const t = (time - start) / 1000;
      if (t < duration) {
        group.rotation.y = Math.PI / 2 * (t / duration);
        requestAnimationFrame(rotate);
      } else {
        group.rotation.y = Math.PI / 2;
      }
    }
    requestAnimationFrame(rotate);
  });

  // === Анимация рун и дыма ===
  function update(delta) {
    runes.forEach(r => {
      r.position.y += 0.002 + Math.random() * 0.002;
      if (r.position.y > 2) r.position.y = 0;
      r.rotation.x += 0.01;
      r.rotation.y += 0.01;
    });

    smokeGroup.children.forEach(s => {
      s.position.y += 0.001 + Math.random() * 0.001;
      if (s.position.y > 2) s.position.y = 0;
      s.rotation.z += 0.002;
    });
  }

  group.update = update;

  return group;
}
