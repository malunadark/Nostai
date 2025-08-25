// Подключаем сцену
const container = document.getElementById("door-container");
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);

// Рендер
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Загрузчик моделей
const loader = new THREE.GLTFLoader();

// Двери (название + ссылка при клике)
const doors = [
  { name: "Голос Тени", url: "shadow.html", x: -3 },
  { name: "Дары Провидцев", url: "seer.html", x: -1 },
  { name: "Хроники Забвения", url: "chronicles.html", x: 1 },
  { name: "Порог Тайны", url: "mystery.html", x: 3 },
  { name: "Вход в Бездну", url: "register.html", x: 0, z: -3 }
];

// Хранение дверей
const clickable = [];

// Шрифт для надписей
const fontLoader = new THREE.FontLoader();
fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  doors.forEach((doorData) => {
    loader.load("assets/Door.glb", (gltf) => {
      const door = gltf.scene;
      door.position.set(doorData.x, 0, doorData.z || 0);
      door.scale.set(1.2, 1.2, 1.2);

      // Лёгкое свечение + прозрачность
      door.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.9;
          child.material.emissive = new THREE.Color(0x333333);
          child.material.emissiveIntensity = 0.25;
        }
      });

      scene.add(door);
      clickable.push({ mesh: door, url: doorData.url });

      // Текст над дверью
      const textGeo = new THREE.TextGeometry(doorData.name, {
        font: font,
        size: 0.3,
        height: 0.05
      });
      const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(doorData.x - 1, 3, doorData.z || 0);
      scene.add(textMesh);

      // Пульсация двери
      gsap.to(door.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    });
  });
});

// Управление мышью (Raycaster)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickable.map(c => c.mesh), true);
  if (intersects.length > 0) {
    const clicked = clickable.find(c => intersects[0].object.parent === c.mesh || intersects[0].object === c.mesh);
    if (clicked) {
      window.location.href = clicked.url;
    }
  }
}
window.addEventListener("click", onMouseClick);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Адаптивность
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
