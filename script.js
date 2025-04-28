let scene, camera, renderer, loader;
let characters = {};

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene-container').appendChild(renderer.domElement);

  // Свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Загрузка только 2 персонажей
  loader = new THREE.GLTFLoader();

  const characterModels = {
    vsrf: 'assets/models/VS_RF.glb',
    volunteer: 'assets/models/Volonter_0425195121_texture.glb'
  };

  const positions = [
    { x: -2, z: 0 },
    { x: 2, z: 0 }
  ];

  let index = 0;
  for (let key in characterModels) {
    loader.load(characterModels[key], function (gltf) {
      const model = gltf.scene;
      model.position.set(positions[index].x, 0, positions[index].z);
      scene.add(model);
      characters[key] = model;
      index++;
    });
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function enterNostai() {
  const username = document.getElementById('username').value.trim();
  if (username) {
    document.getElementById('loginModal').style.display = 'none';
    init();
    spawnRunes();
  } else {
    alert('Введите имя!');
  }
}

// Создание рун через текстовый шрифт
function spawnRunes() {
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᛃ']; // Примеры рунических символов

  runes.forEach((rune, index) => {
    const runeElement = document.createElement('div');
    runeElement.className = 'rune';
    runeElement.innerText = rune;
    runeElement.style.top = `${50 + Math.sin(index * 1.5) * 100}px`;
    runeElement.style.left = `${50 + Math.cos(index * 1.5) * 100}px`;
    document.body.appendChild(runeElement);
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
