// Three.js сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Загрузчик моделей
const loader = new THREE.GLTFLoader();

// Массив моделей
const models = [
    { 
        name: "ВС РФ", 
        path: 'assets/models/VS_RF.glb', 
        position: new THREE.Vector3(-3, 0, 0) 
    },
    { 
        name: "Волонтёр", 
        path: 'assets/models/Volonter_0425195121_texture.glb', 
        position: new THREE.Vector3(3, 0, 0) 
    }
];

// Загрузка моделей
models.forEach((modelData) => {
    loader.load(modelData.path, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelData.position);
        model.scale.set(1.5, 1.5, 1.5); // Увеличиваем модели
        scene.add(model);
    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
    });
});

// Камера
camera.position.z = 10;

// Анимация
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// При изменении размеров окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
