let scene, camera, renderer, door;
let isAnimating = false;
let targetUrl = null;

initScene();
animate();

function initScene() {
  const container = document.getElementById('three-container');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 5);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('assets/images/door.glb', gltf => {
    door = gltf.scene;
    door.position.set(0, 0, 0);
    door.scale.set(1.5, 1.5, 1.5);
    scene.add(door);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.getElementById('enterBtn').addEventListener('click', () => {
    targetUrl = 'register.html';
    triggerCameraMove();
  });

  document.getElementById('chroniclesBtn').addEventListener('click', () => {
    targetUrl = 'chronicles.html';
    triggerCameraMove();
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function triggerCameraMove() {
  if (isAnimating || !door) return;
  isAnimating = true;

  const startZ = camera.position.z;
  const endZ = 1.5;
  const duration = 3000;
  const start = performance.now();

  function move(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    camera.position.z = startZ + (endZ - startZ) * progress;

    if (progress < 1) {
      requestAnimationFrame(move);
    } else {
      openDoor(() => {
        window.location.href = targetUrl;
      });
    }
  }

  requestAnimationFrame(move);
}

function openDoor(callback) {
  const duration = 1000;
  const startRotation = door.rotation.y;
  const endRotation = startRotation + Math.PI / 2;
  const start = performance.now();

  function rotate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    door.rotation.y = startRotation + (endRotation - startRotation) * progress;

    if (progress < 1) {
      requestAnimationFrame(rotate);
    } else {
      setTimeout(callback, 300);
    }
  }

  requestAnimationFrame(rotate);
}
