// Инициализация сцены Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5); // смещение камеры

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(3, 10, 5);
scene.add(directional);

// Загрузка 3D-моделей персонажей
const loader = new THREE.GLTFLoader();
const characters = {};

const characterPaths = {
  volunteer: 'models/volunteer.glb',
  vsrf: 'models/vsrf.glb',
  redCross: 'models/red_cross.glb',
  ems: 'models/ems.glb'
};

let loadedModels = 0;
const totalModels = Object.keys(characterPaths).length;

for (const [key, path] of Object.entries(characterPaths)) {
  loader.load(path, function(gltf) {
    characters[key] = gltf.scene;
    gltf.scene.visible = false;
    scene.add(gltf.scene);

    loadedModels++;
    if (loadedModels === totalModels) {
      console.log('Все модели загружены');
      // Можешь добавить тут: displayCharacter('volunteer');
    }
  });
}

// Функция для отображения выбранного персонажа
function displayCharacter(faction) {
  for (const [key, model] of Object.entries(characters)) {
    if (model) model.visible = (key === faction);
  }
}

// Анимация появления рун
function showRunes(faction) {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.style.backgroundImage = `url('textures/runes/${faction}.png')`;
  document.body.appendChild(rune);
  requestAnimationFrame(() => rune.classList.add('fade-in'));
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
