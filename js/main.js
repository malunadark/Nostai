// === ФОН ===
const loader = new THREE.TextureLoader();
loader.load(
  './assets/images/Nostai.png',  // ✅
  (texture) => { scene.background = texture; },
  undefined,
  (err) => console.warn('⚠️ Не удалось загрузить фон')
);

// === ДЫМ ===
const smokeTexture = loader.load('./assets/images/smoke-fog.gif'); // ✅
