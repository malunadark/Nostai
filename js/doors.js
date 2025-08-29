import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/GLTFLoader.js";

export function loadDoors(scene) {
  const loader = new GLTFLoader();
  loader.load(
    "assets/models/Door.glb",
    (gltf) => {
      const door = gltf.scene;
      door.traverse(node => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      scene.add(door);
    },
    undefined,
    (err) => console.error("Ошибка загрузки двери:", err)
  );
}
