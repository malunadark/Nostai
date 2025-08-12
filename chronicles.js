// Функция для динамической загрузки скрипта с колбэками
function loadScript(src) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector(`script[src="${src}"]`)) {
      // Скрипт уже загружен
      resolve();
      return;
    }
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${src}`));
    document.head.appendChild(script);
  });
}

function initBook() {
  const pageTurnSound = document.getElementById('page-turn-sound');
  $('#book').turn({
    width: 900,
    height: 600,
    autoCenter: true,
    gradients: true,
    duration: 800
  }).bind('turning', function(event, page, view) {
    if (pageTurnSound) {
      pageTurnSound.currentTime = 0;
      pageTurnSound.play();
    }
  });

  // Показать книгу и убрать лоадер
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.style.visibility = 'visible';
    }, 800);
  } else {
    document.body.style.visibility = 'visible';
  }
}

// Последовательная загрузка скриптов
loadScript('https://code.jquery.com/jquery-3.6.0.min.js')
  .then(() => loadScript('js/turn.min.js'))
  .then(() => {
    // Ждём пока DOM будет готов и jQuery будет доступен
    if (window.jQuery) {
      $(function() {
        initBook();
      });
    } else {
      console.error('jQuery не найден после загрузки');
    }
  })
  .catch(error => {
    console.error(error);
  });
