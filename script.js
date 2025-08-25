// === Основные настройки сцены ===
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("door-container").appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xaaaaff, 1.2, 50);
pointLight.position.set(0, 5, 10);
scene.add(pointLight);

// === Двери ===
const loader = new THREE.GLTFLoader();
const doors = [
  { name: "Голос Тени", url: "shadow.html", x: -3 },
  { name: "Дары Провидцев", url: "seer.html", x: -1 },
  { name: "Хроники Забвения", url: "chronicles.html", x: 1 },
  { name: "Порог Тайны", url: "mystery.html", x: 3 },
  { name: "Вход в Бездну", url: "register.html", x: 0, z: -3 }
];

const clickableObjects = [];

// Загружаем шрифт для надписей
const fontLoader = new THREE.FontLoader();
fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
  doors.forEach((doorData) => {
    loader.load("assets/Door.glb", (gltf) => {
      const door = gltf.scene;
      door.position.set(doorData.x, 0, doorData.z || 0);
      door.scale.set(1.2, 1.2, 1.2);

      // Делаем дверь "магической"
      door.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.6;
          child.material.depthWrite = false;
          child.material.side = THREE.DoubleSide;

          // Свечение
          child.material.emissive = new THREE.Color(0x6666ff);
          child.material.emissiveIntensity = 0.4;
        }
      });

      // Подпись над дверью
      const textGeo = new THREE.TextGeometry(doorData.name, {
        font: font,
        size: 0.4,
        height: 0.05
      });
      const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeo, textMat);

      textMesh.position.set(doorData.x - 1.5, 3, doorData.z || 0);

      // Делаем кликабельным
      door.userData.url = doorData.url;
      clickableObjects.push(door, textMesh);

      scene.add(door);
      scene.add(textMesh);
    });
  });
});

// === Обработка кликов по дверям ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjects, true);
  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.userData.url) {
      window.location.href = object.userData.url;
    }
  }
});

// === Анимация ===
function animate() {
  requestAnimationFrame(animate);

  // легкое "дыхание" у дверей
  clickableObjects.forEach((obj) => {
    if (obj.isMesh && obj.material && obj.material.opacity) {
      obj.material.opacity = 0.6 + Math.sin(Date.now() * 0.002) * 0.1;
    }
  });

  renderer.render(scene, camera);
}
animate();

// === Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
