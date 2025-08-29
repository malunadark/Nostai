export let doors = [];

export function addDoor(doorMesh) {
  doors.push(doorMesh);
}

export function animateDoors() {
  doors.forEach(door => {
    // Пример плавного открытия/закрытия
    door.rotation.y += Math.sin(Date.now() * 0.001) * 0.001;
  });
}
