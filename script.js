// === THREE.js СЦЕНА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,8);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// === СВЕТ ===
const ambientLight = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff,0.8);
dirLight.position.set(5,10,7);
scene.add(dirLight);

// === 3D ДВЕРЬ (Хроники Забвения) ===
const loader = new THREE.GLTFLoader();
loader.load('assets/Door.glb', function(gltf){
  const door = gltf.scene;
  door.position.set(0,0,-5);
  door.scale.set(1.5,1.5,1.5);
  door.traverse(node => { if(node.isMesh) node.material.transparent=true; });
  scene.add(door);

  let open = false;
  window.addEventListener('click', ()=>{
    open = !open;
    door.rotation.y = open ? Math.PI/2 : 0;
  });
});

// === РУНЫ DOM ===
const runes = document.querySelectorAll('.rune');
function animateRunes() {
  runes.forEach((rune,i)=>{
    const x = 50 + Math.sin(Date.now()*0.001+i)*200;
    const y = 100 + Math.cos(Date.now()*0.001+i)*200;
    rune.style.transform = `translate(${x}px,${y}px)`;
  });
  requestAnimationFrame(animateRunes);
}
animateRunes();

// === РЕНДЕР СЦЕНЫ ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === МУЗЫКА ВЕЩАТЕЛЬНАЯ ===
const music = document.getElementById('bg-music');
music.volume = 0.5;
