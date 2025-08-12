function loadScript(src) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${src}`));
    document.head.appendChild(script);
  });
}

Promise.resolve()
  .then(() => loadScript('https://code.jquery.com/jquery-3.6.0.min.js'))
  .then(() => loadScript('js/turn.min.js'))
  .then(() => loadScript('chronicles.js'))
  .catch(console.error);
