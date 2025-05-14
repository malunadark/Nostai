window.addEventListener('DOMContentLoaded', () => {
  const runes = document.querySelectorAll('.rune');

  // Случайное размещение рун
  runes.forEach(rune => {
    rune.style.position = 'absolute';
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    rune.style.left = `${x}px`;
    rune.style.top = `${y}px`;
  });

  // Эффект (частицы)
  window.triggerEffect = function(type) {
    const container = document.getElementById('effect-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');

      // Цвет частицы в зависимости от типа
      if (type === 'fire') p.style.background = 'orange';
      else if (type === 'water') p.style.background = 'aqua';
      else if (type === 'air') p.style.background = 'white';
      else if (type === 'smoke') p.style.background = 'gray';

      // Начальная позиция — по центру
      p.style.left = `${window.innerWidth / 2}px`;
      p.style.top = `${window.innerHeight / 2}px`;

      // Движение в случайном направлении
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      p.style.transform = `translate(${x}px, ${y}px)`;

      container.appendChild(p);

      // Удаление через 2 секунды
      setTimeout(() => p.remove(), 2000);
    }
  };
});
