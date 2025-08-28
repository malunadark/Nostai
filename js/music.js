const music = document.getElementById('bg-music');
let isPlaying = true;

document.body.addEventListener('click', () => {
  if (isPlaying) {
    music.pause();
  } else {
    music.play();
  }
  isPlaying = !isPlaying;
});
