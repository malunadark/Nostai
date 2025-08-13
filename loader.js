// Динамическая подгрузка скриптов
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if(document.querySelector(`script[src="${src}"]`)){
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Подгрузка необходимых библиотек (например, turn.js)
loadScript('https://cdnjs.cloudflare.com/ajax/libs/turn.js/4.1.0/turn.min.js')
  .then(() => console.log('turn.js загружен'))
  .catch(err => console.error('Ошибка загрузки turn.js', err));
