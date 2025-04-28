// Создание сцены
const scene = new THREE.Scene();
scene.background = null;

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Рендерер
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('main-content').appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Загрузка 3D-моделей персонажей
const loader = new THREE.GLTFLoader();

// Данные о персонажах
const characters = [
    { 
        name: "Волонтёр", 
        path: "assets/models/volonter/scene.gltf", 
        position: { x: -3, y: 0, z: 0 }, 
        id: "volonter" 
    },
    { 
        name: "ВС РФ", 
        path: "assets/models/VS_RF/scene.gltf", 
        position: { x: 3, y: 0, z: 0 }, 
        id: "vs_rf"
    }
];

// Отслеживание загруженных моделей
const characterModels = [];

// Загружаем всех персонажей
characters.forEach(charData => {
    loader.load(charData.path, gltf => {
        const model = gltf.scene;
        model.position.set(charData.position.x, charData.position.y, charData.position.z);
        model.scale.set(2, 2, 2);
        model.userData.id = charData.id; // сохраняем ID для клика
        scene.add(model);
        characterModels.push(model);

        // Добавляем подпись
        const label = document.createElement('div');
        label.className = 'character-label';
        label.textContent = charData.name;
        document.getElementById('main-content').appendChild(label);

        function updateLabelPosition() {
            const vector = model.position.clone().project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
            label.style.left = `${x}px`;
            label.style.top = `${y + 30}px`;
        }

        renderer.setAnimationLoop(() => {
            updateLabelPosition();
            renderer.render(scene, camera);
        });
    });
});

// Управление кликами по моделям
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(characterModels, true);

    if (intersects.length > 0) {
        const selectedId = intersects[0].object.parent.userData.id;
        alert(`Вы выбрали фракцию: ${selectedId}`);
        // Здесь можешь перенаправить на страницу выбранной фракции, например:
        // window.location.href = `/factions/${selectedId}.html`;
    }
});

// Добавление рун
const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᛉ']; // Можно дополнять

runes.forEach(rune => {
    const runeDiv = document.createElement('div');
    runeDiv.className = 'rune';
    runeDiv.textContent = rune;
    runeDiv.style.left = `${Math.random() * 100}%`;
    runeDiv.style.top = `${Math.random() * 100}%`;
    document.getElementById('runes-container').appendChild(runeDiv);
});

// Адаптация к экрану
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
