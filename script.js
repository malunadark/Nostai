const runes = document.querySelectorAll('.rune');

runes.forEach(rune => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  rune.style.left = `${x}px`;
  rune.style.top = `${y}px`;
});
function triggerEffect(type) {
  const container = document.getElementById('effect-container');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    if (type === 'fire') p.style.background = 'orange';
    if (type === 'water') p.style.background = 'aqua';
    if (type === 'air') p.style.background = 'white';
    if (type === 'smoke') p.style.background = 'gray';

    p.style.left = `${window.innerWidth / 2}px`;
    p.style.top = `${window.innerHeight / 2}px`;

    // движение в случайную сторону
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    p.style.transform = `translate(${x}px, ${y}px)`;

    container.appendChild(p);

    setTimeout(() => p.remove(), 2000);
  }
}
