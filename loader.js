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

// Подгружаем локальный turn.min.js
loadScript('js/turn.min.js')
  .then(() => console.log('turn.min.js загружен'))
  .catch(err => console.error('Ошибка загрузки turn.min.js', err));
