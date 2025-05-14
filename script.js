import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffcc99, 1.5, 100);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// Частицы сияния
const particlesCount = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffcc, size: 0.1 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Руны
const runeChars = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᛉ','ᛏ','ᛗ','ᛟ','ᛃ','ᛞ','ᛇ','ᛜ','ᛁ','ᛅ','ᛒ','ᚹ','ᚾ','ᛚ'];
const runeSprites = [];

function createRuneTexture(runeChar) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '80px FutharkAoe';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(runeChar, size / 2, size / 2);

  return new THREE.CanvasTexture(canvas);
}

function addRuneSprites() {
  const radius = 5;
  runeChars.forEach((char, index) => {
    const angle = (index / runeChars.length) * Math.PI * 2;
    const texture = createRuneTexture(char);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    );
    sprite.scale.set(1.5, 1.5, 1.5);
    sprite.userData = { baseAngle: angle, speed: 0.2 + Math.random() * 0.3 };
    scene.add(sprite);
    runeSprites.push(sprite);
  });
}

addRuneSprites();

// Анимация
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  runeSprites.forEach((sprite, i) => {
    const baseAngle = sprite.userData.baseAngle;
    const angle = baseAngle + time * sprite.userData.speed;
    const radius = 5;
    sprite.position.x = Math.cos(angle) * radius;
    sprite.position.y = Math.sin(angle) * radius;
    sprite.material.opacity = 0.7 + 0.3 * Math.sin(time * 3 + i);
    sprite.rotation.z += 0.005;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
