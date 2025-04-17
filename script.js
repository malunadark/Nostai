.sun-rays {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,0,0.5) 0%, rgba(255,255,0,0) 80%);
    filter: blur(50px);
    opacity: 0.7;
    transform: translate(-50%, -50%);
    animation: sunMove 4s infinite alternate ease-in-out;
}

@keyframes sunMove {
    0% {
        transform: translate(-50%, -50%) scale(1); /* Начальная позиция, без изменений */
        opacity: 0.7;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.2); /* Расширение и увеличение эффекта */
        opacity: 0.5;
    }
}
<script>
  const loginButton = document.querySelector('.login-button');
  const modal = document.getElementById('loginModal');
  const characterSelection = document.getElementById('characterSelection');
  const factionModal = document.getElementById('factionModal');

  loginButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  function proceedToSelection() {
    modal.classList.add('hidden');
    characterSelection.classList.remove('hidden');
  }

  function selectCharacter(role) {
    characterSelection.classList.add('hidden');
    factionModal.classList.remove('hidden');
  }

  function chooseFaction(faction) {
    factionModal.classList.add('hidden');

    // Воспроизводим соответствующий звук
    const audio = document.getElementById('audio-' + faction);
    if (audio) {
      audio.play();
    }

    alert("Ты выбрал: " + {
      pridshie: "Придшие",
      padshie: "Падшие",
      otverzhenie: "Отверженные"
    }[faction]);

    // Здесь можно запускать стриминг/переход
  }
</script>



