export function setupParallax(container) {
  container.style.background = "url('assets/images/Nostai.png') no-repeat center center fixed";
  container.style.backgroundSize = "cover";
  
  // Простейший JS параллакс по движению мыши
  container.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
    container.style.backgroundPosition = `${50 - moveX}% ${50 - moveY}%`;
  });
}
