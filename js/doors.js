// Сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("door-container").appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 5, 5);
scene.add(pointLight);

// Загрузчики
const loader = new THREE.GLTFLoader();
const fontLoader = new THREE.FontLoader();

// Данные двери
const doorData = { name: "Хроники Забвения", url: "chronicles.html", x: 0, z: 0 };

loader.load("assets/Door.glb", (gltf) => {
  const door = gltf.scene;
  door.position.set(doorData.x, 0, doorData.z);
  door.scale.set(1.5, 1.5, 1.5);

  // Прозрачность и свечение
  door.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0.75;
      child.material.depthWrite = false;
      child.material.emissive = new THREE.Color(0x2222ff);
      child.material.emissiveIntensity = 0.4;
    }
  });

  scene.add(door);

  // Надпись над дверью
  fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
    const geometry = new THREE.TextGeometry(doorData.name, {
      font: font,
      size: 0.45,
      height: 0.05
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.set(-2.5, 3.2, 0);
    scene.add(textMesh);

    // Клик по двери
    window.addEventListener("click", (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([door, textMesh], true);

      if (intersects.length > 0) {
        window.location.href = doorData.url;
      }
    });
  });
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Анимация двери
function spawnDoor() {
    const door = document.createElement('div');
    door.style.position = 'absolute';
    door.style.width = '100px';
    door.style.height = '200px';
    door.style.background = 'rgba(200,180,100,0.8)';
    door.style.top = Math.random()*window.innerHeight+'px';
    door.style.left = Math.random()*window.innerWidth+'px';
    door.style.transform = 'rotateY(0deg)';
    document.body.appendChild(door);

    setInterval(()=> {
        door.style.transform = `rotateY(${(performance.now()/50)%360}deg)`;
    },16);
}
spawnDoor();

// Адаптивность
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
