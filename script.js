// Сцена, камера, рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

// Загрузчик моделей
const loader = new THREE.GLTFLoader();

// Функция для загрузки модели
function loadModel(path, position) {
    loader.load(
        path,
        function (gltf) {
            const model = gltf.scene;
            model.position.copy(position);
            model.scale.set(1.5, 1.5, 1.5);
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(model);

            // Анимация "покачивания"
            animateModel(model);
        },
        undefined,
        function (error) {
            console.error('Ошибка загрузки модели:', path, error);
        }
    );
}

// Загрузка двух моделей
loadModel('assets/models/VS_RF.glb', new THREE.Vector3(-3, 0, 0));
loadModel('assets/models/Volonter_0425195121_texture.glb', new THREE.Vector3(3, 0, 0));

// Руна - создаём плоскую текстуру
function createRune(position) {
    const texture = new THREE.TextureLoader().load('assets/textures/runes/Runies.png');
    const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
    return sprite;
}

// Размещаем руны вокруг центра
const runes = [];
const runeCount = 5;
const radius = 5;

for (let i = 0; i < runeCount; i++) {
    const angle = (i / runeCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    runes.push(createRune(new THREE.Vector3(x, 1.5, z)));
}

// Плавное вращение рун
function animateRunes() {
    runes.forEach(rune => {
        rune.rotation.z += 0.01;
    });
}

// Покачивание моделей
function animateModel(model) {
    let up = true;
    setInterval(() => {
        if (up) {
            model.position.y += 0.01;
            if (model.position.y >= 0.5) up = false;
        } else {
            model.position.y -= 0.01;
            if (model.position.y <= 0) up = true;
        }
    }, 50);
}

// Анимация сцены
function animate() {
    requestAnimationFrame(animate);
    animateRunes();
    renderer.render(scene, camera);
}
animate();

// Адаптивность
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
