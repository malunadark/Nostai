window.addEventListener('DOMContentLoaded', () => {
  const runes = document.querySelectorAll('.rune');

  // Распределение рун случайно по экрану
  runes.forEach(rune => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    rune.style.left = `${x}px`;
    rune.style.top = `${y}px`;
  });

  // Магический эффект (частицы)
  window.triggerEffect = function(type) {
    const container = document.getElementById('effect-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');

      // Цвет по типу эффекта
      if (type === 'fire') p.style.background = 'orange';
      else if (type === 'water') p.style.background = 'aqua';
      else if (type === 'air') p.style.background = 'white';
      else if (type === 'smoke') p.style.background = 'gray';

      // Положение в центре
      const x0 = window.innerWidth / 2;
      const y0 = window.innerHeight / 2;
      p.style.left = `${x0}px`;
      p.style.top = `${y0}px`;

      // Движение
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 150;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      p.style.transform = `translate(${x}px, ${y}px)`;

      container.appendChild(p);

      // Удаление через 2 сек
      setTimeout(() => p.remove(), 2000);
    }
  };
});
