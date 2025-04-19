// Инициализация сцены Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Загрузка 3D-моделей персонажей
const loader = new THREE.GLTFLoader();
const characters = {};

const characterPaths = {
  volunteer: 'models/volunteer.glb',
  vsrf: 'models/vsrf.glb',
  redCross: 'models/red_cross.glb',
  ems: 'models/ems.glb'
};

for (const [key, path] of Object.entries(characterPaths)) {
  loader.load(path, function(gltf) {
    characters[key] = gltf.scene;
    scene.add(gltf.scene);
  });
}

// Функция для отображения выбранного персонажа
function displayCharacter(faction) {
  for (const [key, model] of Object.entries(characters)) {
    model.visible = (key === faction);
  }
}

// Анимация появления рун
function showRunes(faction) {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.style.backgroundImage = `url('textures/runes/${faction}.png')`;
  document.body.appendChild(rune);
  rune.classList.add('fade-in');
}

// Обработчик выбора фракции
document.querySelectorAll('.faction-button').forEach(button => {
  button.addEventListener('click', () => {
    const faction = button.dataset.faction;
    displayCharacter(faction);
    showRunes(faction);
  });
});

// Анимация солнечных лучей
const sunRays = document.createElement('div');
sunRays.className = 'sun-rays';
document.body.appendChild(sunRays);

// Анимация сцены
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
