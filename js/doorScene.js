import * as THREE from './three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { FontLoader } from './loaders/FontLoader.js';
import { TextGeometry } from './loaders/TextGeometry.js';

// === Сцена ===
const scene = new THREE.Scene();

// === Фон ===
const loader = new THREE.TextureLoader();
loader.load('assets/images/Nostai.png', (texture) => {
    scene.background = texture;
});

// === Камера ===
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,1.5,5);

// === Рендер ===
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Свет ===
const ambient = new THREE.AmbientLight(0xffffff,1.5);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff,1);
dirLight.position.set(3,5,5);
scene.add(dirLight);

// === Контролы ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Прозрачная 3D-дверь ===
const doorGeometry = new THREE.BoxGeometry(1.5,2.5,0.05);
const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.6,
    roughness: 0.5,
    metalness: 0.1
});
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0,1.25,0);
scene.add(door);

// Добавим границу двери (BoxHelper)
const doorBox = new THREE.BoxHelper(door, 0xffffff);
scene.add(doorBox);

// === Текст на двери ===
const fontLoader = new FontLoader();
fontLoader.load('assets/fonts/destroycyr.typeface.json', (font) => {
    const textGeo = new TextGeometry('Хроники Забвения', {
        font: font,
        size: 0.25,
        height: 0.02,
        curveSegments: 8
    });
    const textMat = new THREE.MeshStandardMaterial({color:0xffddaa, emissive:0xffaa88, emissiveIntensity:0.5});
    const textMesh = new THREE.Mesh(textGeo,textMat);
    textGeo.center();
    textMesh.position.set(0,2.0,0.03);
    scene.add(textMesh);
});

// === Анимация двери (приближение + открытие) ===
let doorOpen = false;
function openDoorAnimation() {
    if(doorOpen) return;
    doorOpen = true;

    const startZ = camera.position.z;
    const targetZ = 2.5;

    let startTime = performance.now();
    const duration = 2000; // 2 сек

    function animate(time){
        const elapsed = time - startTime;
        const t = Math.min(elapsed/duration,1);

        // камера приближается
        camera.position.z = startZ*(1-t) + targetZ*t;

        // дверь слегка открывается
        door.rotation.y = Math.PI/2 * t;

        renderer.render(scene,camera);

        if(t<1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// === Клик для анимации двери ===
document.addEventListener('click', ()=>{ openDoorAnimation(); });

// === Resize ===
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Анимация сцены ===
function animateScene(){
    requestAnimationFrame(animateScene);
    controls.update();
    renderer.render(scene,camera);
}
animateScene();
