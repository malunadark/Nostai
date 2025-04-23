// Инициализация сцены Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(3, 10, 5);
scene.add(directional);

// Загрузка моделей
const loader = new THREE.GLTFLoader();
const characters = {};

const characterPaths = {
  volunteer: 'assets/models/volunteer.glb',
  vsrf: 'assets/models/vsrf.glb',
};

let loadedModels = 0;
const totalModels = Object.keys(characterPaths).length;

for (const [key, path] of Object.entries(characterPaths)) {
  loader.load(path, function (gltf) {
    const model = gltf.scene;
    model.visible = true; // пока показываем все — потом скроем
    model.userData.faction = key;
    characters[key] = model;
    scene.add(model);

    loadedModels++;
    if (loadedModels === totalModels) {
      console.log('Все модели загружены');
      // displayCharacter('volunteer'); // Можно включить одну по умолчанию
    }
  });
}

// Отображение одного персонажа
function displayCharacter(faction) {
  for (const [key, model] of Object.entries(characters)) {
    if (model) model.visible = (key === faction);
  }
}

// Появление руны
const runePaths = {
  volunteer: 'textures/runes/volunteer.png',
  vsrf: 'textures/runes/vsrf.png',
};

function showRunes(faction) {
  // Удаляем старые руны
  document.querySelectorAll('.rune').forEach(r => r.remove());

  const runeCount = 6;
  const radius = 1.2; // радиус круга

  // Получаем позицию модели в мировых координатах
  const model = characters[faction];
  if (!model) return;

  const worldPosition = new THREE.Vector3();
  model.getWorldPosition(worldPosition);

  for (let i = 0; i < runeCount; i++) {
    const angle = (i / runeCount) * Math.PI * 2;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    // Позиция руны в 3D
    const runePosition = worldPosition.clone().add(new THREE.Vector3(offsetX, offsetY, 0));
    
    // Перевод в 2D-координаты экрана
    const screenPos = runePosition.clone().project(camera);
    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

    const rune = document.createElement('div');
    rune.className = 'rune';
    rune.style.left = `${x}px`;
    rune.style.top = `${y}px`;
    rune.style.backgroundImage = `url('${runePaths[faction]}')`;

    document.body.appendChild(rune);
    requestAnimationFrame(() => rune.classList.add('fade-in'));
  }
}


// Raycaster для клика по моделям
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(characters), true);

  if (intersects.length > 0) {
    let selected = intersects[0].object;

    while (selected && !selected.userData.faction && selected.parent) {
      selected = selected.parent;
    }

    if (selected && selected.userData.faction) {
      const faction = selected.userData.faction;
      displayCharacter(faction);
      showRunes(faction);
    }
  }
});

// Ресайз окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
