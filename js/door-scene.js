let open = false;

export function toggleDoorAnimation() {
  open = !open;
}

export function animateDoorScene(doors) {
  doors.forEach(door => {
    door.rotation.y += open ? 0.01 : -0.005;
  });
}
