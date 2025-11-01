// radioScene.js
// Этот файл — ES-модуль. Он импортирует локальный three.module.js.
// Убедись, что у тебя есть js/three.module.js рядом.
// Если нет — можно вставить/подключить локальную копию three.js (build/three.module.js).

import * as THREE from './three.module.js';

// Настройка renderer с альфой (чтобы фон был прозрачным)
const canvas = document.getElementById('radioCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor(0x000000, 0); // прозрачный

// Сцена и камера (ортографическая чуть более стабильна для UI)
const scene = new THREE.Scene();
const fov = 35;
const aspect = canvas.clientWidth / canvas.clientHeight;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.set(0, 20, 60);

// Лёгкий ambient + directional
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xfff1d6, 0.8);
dir.position.set(50, 50, 50);
scene.add(dir);

// Создаём стилизованное радио: корпус (box), панель (plane), антенна (cylinder), индикатор (sphere)
const group = new THREE.Group();
scene.add(group);

// корпус
const bodyGeo = new THREE.BoxGeometry(46, 28, 18);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2d2a26, metalness: 0.25, roughness: 0.6 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.set(0, 0, 0);
group.add(body);

// фронтальная панель (другой материал)
const panelGeo = new THREE.PlaneGeometry(40, 20);
const panelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.45 });
const panel = new THREE.Mesh(panelGeo, panelMat);
panel.position.set(0, 0, 9.5);
group.add(panel);

// резьба/жёсткий край (рамка)
const rimGeo = new THREE.BoxGeometry(46.5, 29.5, 2);
const rimMat = new THREE.MeshStandardMaterial({ color: 0x1a120f, metalness: 0.3, roughness: 0.8 });
const rim = new THREE.Mesh(rimGeo, rimMat);
rim.position.set(0, 0, -4);
group.add(rim);

// антенна
const antGeo = new THREE.CylinderGeometry(0.4, 0.4, 40, 8);
const antMat = new THREE.MeshStandardMaterial({ color: 0xbebebe, metalness: 0.9, roughness: 0.25 });
const ant = new THREE.Mesh(antGeo, antMat);
ant.position.set(18, 12, 0);
ant.rotation.z = -0.25;
group.add(ant);

// индикатор (свечение)
const indicatorGeo = new THREE.SphereGeometry(3.4, 16, 12);
const indicatorMat = new THREE.MeshStandardMaterial({ emissive: 0xff6a00, emissiveIntensity: 0.9, color: 0x330000 });
const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
indicator.position.set(-12, 5, 9.8);
group.add(indicator);

// добавим плоскую "антенну-капсюль" на конце
const tipGeo = new THREE.SphereGeometry(0.9, 8, 8);
const tip = new THREE.Mesh(tipGeo, antMat);
tip.position.set(18, 32, 0);
group.add(tip);

// лёгкая подложка (тень) — плоскость с градиентом через прозрачность
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
const shadowGeo = new THREE.PlaneGeometry(80, 40);
const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = -16;
shadowPlane.position.z = -6;
scene.add(shadowPlane);

// масштаб группы — уменьшаем, чтобы вписать в canvas
group.scale.set(0.9, 0.9, 0.9);

// лёгкая анимация: покачивание и пульс эмиссии индикатора
let tStart = performance.now();

function animateRadio(now) {
  const t = (now - tStart) / 1000;
  group.rotation.y = Math.sin(t * 0.6) * 0.08;
  group.rotation.x = Math.sin(t * 0.3) * 0.03;
  // пульсация индикатора
  const pulse = 0.6 + Math.abs(Math.sin(t * 3)) * 0.9;
  indicator.material.emissiveIntensity = pulse;
  // маленькое движение антенны (как будто ловит сигнал)
  ant.rotation.z = -0.25 + Math.sin(t * 4) * 0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(animateRadio);
}
requestAnimationFrame(animateRadio);

// Обработчик клика — переход на страницу вещательной
canvas.addEventListener('click', (e) => {
  // простая навигация
  window.location.href = 'html/broadcast.html';
});

// Поддержка ресайза canvas (если окно изменится)
function resizeRadio() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== w || canvas.height !== h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resizeRadio);
resizeRadio();

// Если three.module.js не найден, модуль импорт выбросит ошибку до сюда.
// В случае ошибки — ничего не сломает остальную страницу (см. index.html: fallback блок)
