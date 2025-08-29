import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/loaders/GLTFLoader.js";

let doors = [];

export function loadDoors(scene) {
  const loader = new GLTFLoader();
  loader.load("assets/models/Door.glb", (gltf) => {
    const door = gltf.scene;
    door.position.set(0, 0, 0);
    scene.add(door);
    doors.push(door);
  }, undefined, (err) => console.error("Ошибка загрузки двери:", err));
}

export function animateDoors() {
  doors.forEach(door => {
    door.rotation.y += 0.002;
  });
}
