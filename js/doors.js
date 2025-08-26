// Создание сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("door-container").appendChild(renderer.domElement);

// Свет
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

// Загрузчики
const loader = new THREE.GLTFLoader();
const fontLoader = new THREE.FontLoader();

// Двери (названия и ссылки)
const doors = [
  { name: "Голос Тени", url: "shadow.html", x: -3 },
  { name: "Дары Провидцев", url: "seer.html", x: -1 },
  { name: "Хроники Забвения", url: "chronicles.html", x: 1 },
  { name: "Порог Тайны", url: "mystery.html", x: 3 },
  { name: "Вход в Бездну", url: "register.html", x: 0, z: -3 }
];

// Загружаем шрифт
fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  doors.forEach((doorData) => {
    loader.load("assets/Door.glb", (gltf) => {
      const door = gltf.scene;
      door.position.set(doorData.x, 0, doorData.z || 0);
      door.scale.set(1.2, 1.2, 1.2);

      // прозрачность
      door.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.6;
          child.material.depthWrite = false;
          child.material.side = THREE.DoubleSide;
        }
      });

      scene.add(door);

      // текст над дверью
      const geometry = new THREE.TextGeometry(doorData.name, {
        font: font,
        size: 0.3,
        height: 0.05
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.set(doorData.x - 1, 2.5, (doorData.z || 0));
      textMesh.userData.url = doorData.url;
      scene.add(textMesh);

      clickableObjects.push(textMesh);
    });
  });
});

// Кликабельные объекты
const clickableObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const url = intersects[0].object.userData.url;
    if (url) window.location.href = url;
  }
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Адаптивность
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
