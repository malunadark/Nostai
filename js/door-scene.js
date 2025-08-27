// === СЦЕНА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// === СВЕТ ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// === ЗАГРУЗКА ДВЕРИ ===
const loader = new THREE.GLTFLoader();
let door;
loader.load(
  "../assets/models/Door.glb",
  (gltf) => {
    door = gltf.scene;
    door.scale.set(1.5, 1.5, 1.5);
    door.position.set(0, 0, 0);
    door.userData = { url: "chronicles.html" };
    scene.add(door);
  },
  undefined,
  (error) => console.error("Ошибка загрузки двери:", error)
);

// === ЛЕТЯЩИЕ РУНЫ ===
const runeGeometry = new THREE.PlaneGeometry(0.4, 0.4);
const runeTexture = new THREE.TextureLoader().load("../assets/images/Хроники Забвения.png");
const runeMaterial = new THREE.MeshBasicMaterial({ map: runeTexture, transparent: true });
const runes = [];

for (let i = 0; i < 12; i++) {
  const rune = new THREE.Mesh(runeGeometry, runeMaterial);
  rune.position.set(
    (Math.random() - 0.5) * 8,
    Math.random() * 4 + 1,
    (Math.random() - 0.5) * 8
  );
  rune.rotation.z = Math.random() * Math.PI * 2;
  scene.add(rune);
  runes.push(rune);
}

// === ЗОНА заражения (легкая зеленая дымка у пола) ===
const zoneGeometry = new THREE.PlaneGeometry(20, 20);
const zoneTexture = new THREE.TextureLoader().load("../assets/images/smoke-fog.gif");
const zoneMaterial = new THREE.MeshBasicMaterial({
  map: zoneTexture,
  transparent: true,
  opacity: 0.15,
});
const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
zone.rotation.x = -Math.PI / 2;
zone.position.y = 0.01;
scene.add(zone);

// === РЕНДЕР ===
function animate() {
  requestAnimationFrame(animate);

  // вращение рун
  runes.forEach(r => {
    r.position.y += 0.01;
    r.rotation.z += 0.02;
    if (r.position.y > 6) r.position.y = 1;
  });

  renderer.render(scene, camera);
}
animate();

// === КЛИК ПО ДВЕРИ ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  if (!door) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(door, true);

  if (intersects.length > 0) {
    window.location.href = door.userData.url;
  }
});

// === АДАПТИВ ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
