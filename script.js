// === СЦЕНА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Свет
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x555555));

// === ЗАГРУЗКА ДВЕРЕЙ ===
const loader = new THREE.GLTFLoader();
const doorPositions = [
  [-4, 0, -6],
  [-2, 0, -5],
  [0, 0, -7],  // центр
  [2, 0, -5],
  [4, 0, -6],
  [1, 0, -8]
];

const doorNames = [
  "Порог Тайны",
  "Голос Тени",
  "Вход в Бездну",
  "Хроники Забвения",
  "Дары Провидцев",
  "Сумеречный Предел"
];

const clickableObjects = [];
const fontLoader = new THREE.FontLoader();

doorPositions.forEach((pos, i) => {
  loader.load("assets/Door.glb", (gltf) => {
    const door = gltf.scene;
    door.scale.set(2, 2, 2);
    door.position.set(...pos);
    scene.add(door);

    // Добавляем название
    fontLoader.load('assets/fonts/destroycyr.json', (font) => {
      const geometry = new THREE.TextGeometry(doorNames[i], {
        font: font,
        size: 0.3,
        height: 0.05
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.set(pos[0] - 1, pos[1] + 3, pos[2]);
      textMesh.userData.link = doorNames[i];
      scene.add(textMesh);
      clickableObjects.push(textMesh);
    });
  });
});

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === РУНЫ ===
function createRune() {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.innerText = ['ᚠ','ᛉ','ᛏ','ᛃ','ᛗ','ᚨ'][Math.floor(Math.random() * 6)];
  rune.style.left = Math.random() * 100 + 'vw';
  rune.style.fontSize = (Math.random() * 30 + 20) + 'px';
  rune.style.animationDuration = (Math.random() * 8 + 6) + 's';
  document.getElementById('flying-runes').appendChild(rune);
  setTimeout(() => rune.remove(), 15000);
}
setInterval(createRune, 800);

// === МУЗЫКА ===
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

music.play().catch(() => {}); // автозапуск
musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "🔊";
  } else {
    music.pause();
    musicToggle.textContent = "🔈";
  }
});

// === Адаптивность ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
