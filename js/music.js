const music = document.getElementById('bg-music');
let audio;

export function setupMusic() {
  audio = new Audio("assets/audio/Уходящая Судьба.mp3");
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(() => {
    console.log("Авто-воспроизведение заблокировано браузером");
  });
}

export function toggleMusic() {
  if (!audio) return;
  if (audio.paused) audio.play();
  else audio.pause();
}
