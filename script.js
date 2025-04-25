// Three.js сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);

const directional = new THREE.DirectionalLight(0xffffff, 2);
directional.position.set(5, 10, 7.5);
scene.add(directional);

// Загрузка моделей
const loader = new THREE.GLTFLoader();
const characters = {};

const characters = {};
const characterPaths = {
  vsrf: 'assets/models/VS_RF.glb',
  volonter: 'assets/models/Volonter_0425195121_texture.glb'
};

const modelDistance = 2;
const loader = new THREE.GLTFLoader();

let loadedModels = 0;
const totalModels = Object.keys(characterPaths).length;

Object.entries(characterPaths).forEach(([key, path], index) => {
  loader.load(path, function (gltf) {
    const model = gltf.scene;
    model.userData.faction = key;
    model.visible = true;

    const angle = index * (Math.PI * 2 / totalModels);
    model.position.set(Math.cos(angle) * modelDistance, 0, Math.sin(angle) * modelDistance);
    model.lookAt(0, 1.6, 0);
    model.scale.set(1.5, 1.5, 1.5);

    characters[key] = model;
    scene.add(model);

    loadedModels++;
    if (loadedModels === totalModels) {
      console.log('Все модели загружены');
    }
  });
});


// Показываем только одну модель
function displayCharacter(faction) {
  for (const [key, model] of Object.entries(characters)) {
    model.visible = (key === faction);
  }
}

// Ритуальные руны
const runePaths = {
  volunteer: 'textures/runes/volunteer.png',
  vsrf: 'textures/runes/vsrf.png',
};

function showRunes(faction) {
  document.querySelectorAll('.rune').forEach(el => el.remove());

  const runeCount = 6;
  const radius = 1.5;
  const model = characters[faction];
  if (!model) return;

  const worldPosition = new THREE.Vector3();
  model.getWorldPosition(worldPosition);

  for (let i = 0; i < runeCount; i++) {
    const angle = (i / runeCount) * Math.PI * 2;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    const runePosition = worldPosition.clone().add(new THREE.Vector3(offsetX, offsetY, 0));
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

// Клик по моделям
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

// Resize
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

const factionRunes = {
  vsrf: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᛃ', 'ᛏ'] // символы Futhark
};

function showRunes(faction) {
  document.querySelectorAll('.rune').forEach(r => r.remove());

  const model = characters[faction];
  if (!model) return;

  const worldPosition = new THREE.Vector3();
  model.getWorldPosition(worldPosition);

  const runes = factionRunes[faction] || [];
  const radius = 1.5;

  runes.forEach((symbol, i) => {
    const angle = (i / runes.length) * Math.PI * 2;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    const runePos = worldPosition.clone().add(new THREE.Vector3(offsetX, offsetY, 0));
    const screenPos = runePos.clone().project(camera);
    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

    const rune = document.createElement('div');
    rune.className = 'rune';
    rune.textContent = symbol;
    rune.style.left = `${x}px`;
    rune.style.top = `${y}px`;
    rune.style.fontFamily = 'Futhark';
    rune.style.fontSize = '48px';
    rune.style.color = '#ffcc00';
    rune.style.textShadow = '0 0 10px #ffcc88';

    document.body.appendChild(rune);
    requestAnimationFrame(() => rune.classList.add('fade-in'));
  });
}

