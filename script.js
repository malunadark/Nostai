// === СЦЕНА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Свет
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Фоновый свет
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// === ЗАГРУЗКА ДВЕРИ ===
const loader = new THREE.GLTFLoader();
let door;
loader.load("assets/Door.glb", (gltf) => {
  door = gltf.scene;
  door.scale.set(2, 2, 2);
  door.position.set(0, 0, 0);
  scene.add(door);
});

// === 3D ТАБЛИЧКИ МИРОВ ===
const worldsData = [
  { name: "Порог Тайны", link: "door_tainy.html", pos: [-2, 1, -3] },
  { name: "Хроники Забвения", link: "door_zabvenie.html", pos: [2, 1.5, -3] },
  { name: "Голос Тени", link: "door_teni.html", pos: [-1, 0.5, -4] },
  { name: "Дары Провидцев", link: "door_providcy.html", pos: [1, 0.7, -4] },
  { name: "Вход в Бездну", link: "abyss.html", pos: [0, 2, -5] }
];

const loaderFont = new THREE.FontLoader();
const clickableObjects = [];

loaderFont.load('assets/fonts/destroycyr.json', font => {
  worldsData.forEach(world => {
    const geometry = new THREE.TextGeometry(world.name, {
      font: font,
      size: 0.3,
      height: 0.05
    });
    const material = new THREE.MeshBasicMaterial({ color: world.name.includes("Бездну") ? 0xff4444 : 0x55aaff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...world.pos);
    mesh.userData.link = world.link;
    scene.add(mesh);
    clickableObjects.push(mesh);
  });
});

// === АНИМАЦИЯ ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === КЛИК ПО ДВЕРИ ===
function enterWorld(link) {
  if (!door) return;

  gsap.to(camera.position, {
    duration: 2,
    z: 1,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to(door.rotation, {
        duration: 2,
        y: Math.PI / 2,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = link;
        }
      });
    }
  });
}

// === RAYCAST ДЛЯ 3D ТАБЛИЧЕК ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);
  if (intersects.length > 0) {
    const link = intersects[0].object.userData.link;
    enterWorld(link);
  }
});

// === РУНЫ ===
function createRune() {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.innerText = ['ᚠ','ᛉ','ᛏ','ᛃ','ᛗ','ᚨ'][Math.floor(Math.random() * 6)];
  rune.style.left = Math.random() * 100 + 'vw';
  rune.style.fontSize = (Math.random() * 30 + 20) + 'px';
  rune.style.animationDuration = (Math.random() * 8 + 6) + 's';
  document.getElementById('flying-runes').appendChild(rune);
  setTimeout(() => rune.remove(), 15000);
}
setInterval(createRune, 800);

// === Адаптивность ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
