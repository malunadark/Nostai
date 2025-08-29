export function setupParallax(container) {
  container.style.background = "url('assets/images/Nostai.png') no-repeat center center";
  container.style.backgroundSize = "cover";

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    container.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  });
}
