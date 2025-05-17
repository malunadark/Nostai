// Модалка
const descriptions = {
  "Хроники Забвения": "🔥 Архив сожжённой памяти, отражения войн, провалов и ритуалов забвения.",
  "Порог Тайны": "💧 Врата между мирами, где истина и иллюзия сплетаются в одно.",
  "Голом Тени": "⚔ Тайный орден, рожденный из боли и темноты. Их клятвы вечны.",
  "Дары Провидцев": "➿ Наследие тех, кто видел сквозь время. Дары, изменяющие судьбу."
};

document.querySelectorAll('button').forEach(btn => {
  if (btn.id !== 'mute-btn') {
    btn.addEventListener('click', () => {
      const title = btn.textContent.trim();
      document.getElementById('modal-title').innerText = title;
      document.getElementById('modal-text').innerText = descriptions[title] || "Скрытый раздел...";
      document.getElementById('modal').style.display = 'block';
    });
  }
});

document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Мут/плей аудио
const audio = document.getElementById('bg-audio');
const muteBtn = document.getElementById('mute-btn');

muteBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    muteBtn.textContent = '🔊';
  } else {
    audio.pause();
    muteBtn.textContent = '🔇';
  }
});

// Летающие руны
function createRune() {
  const rune = document.createElement('div');
  rune.className = 'rune';
  rune.innerText = ['ᚠ','ᛉ','ᛏ','ᛃ','ᛗ','ᚨ'][Math.floor(Math.random() * 6)];
  rune.style.left = Math.random() * 100 + 'vw';
  rune.style.fontSize = (Math.random() * 20 + 20) + 'px';
  rune.style.animationDuration = (Math.random() * 10 + 10) + 's';
  document.getElementById('flying-runes').appendChild(rune);
  setTimeout(() => rune.remove(), 15000);
}

setInterval(createRune, 1000);

function openModal() {
  document.querySelector('.overlay').classList.add('active');
  document.querySelector('.background').classList.add('dimmed');
}

function closeModal() {
  document.querySelector('.overlay').classList.remove('active');
  document.querySelector('.background').classList.remove('dimmed');
}

