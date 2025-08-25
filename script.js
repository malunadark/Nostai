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
const fontLoader = new THREE.FontLoader();
const clickableObjects = [];

// Позиции дверей (подогнаны под твой фон)
const doorPositions = {
  "Вход в Бездну": { x: 0, y: 0, z: -10 },        // по центру, напротив солнца
  "Хроники Забвения": { x: -6, y: 0, z: -8 },     // слева у мужчины
  "Порог Тайны": { x: 6, y: 0, z: -8 },           // справа у костра
  "Дары Провидцев": { x: 4, y: 0, z: -12 },       // возле грузовика
  "Голос Тени": { x: -10, y: 0, z: -14 }          // дальние деревья
};

Object.entries(doorPositions).forEach(([name, pos]) => {
  loader.load("assets/Door.glb", (gltf) => {
    const door = gltf.scene;
    door.scale.set(2, 2, 2);
    door.position.set(pos.x, pos.y, pos.z);
    scene.add(door);

    // Текст над дверью
    fontLoader.load('assets/fonts/destroycyr.json', (font) => {
      const geometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.4,
        height: 0.05
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.set(pos.x - 1.5, pos.y + 3, pos.z);
      textMesh.userData.link = name;
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
