const pages = document.querySelectorAll('.page');
const flipSound = document.getElementById('flip-sound');

let currentPage = 0;

// Установка всех страниц в исходное положение
pages.forEach((page, index) => {
  if (index !== currentPage) {
    page.style.transform = 'translateX(50%)'; // справа от книги
    page.style.zIndex = 1;
  } else {
    page.style.transform = 'translateX(0)';
    page.style.zIndex = 10;
  }
});

// Функция перелистывания страницы вперёд
function flipPageForward() {
  if (currentPage >= pages.length - 1) return;

  const page = pages[currentPage];

  // Проигрываем звук перелистывания
  flipSound.currentTime = 0;
  flipSound.play();

  // Анимация перелистывания
  page.classList.add('turning');

  // После анимации убираем страницу в задний план
  setTimeout(() => {
    page.style.transform = 'translateX(-50%)';
    page.style.zIndex = 1;
    page.classList.remove('turning');
    currentPage++;
    pages[currentPage].style.transform = 'translateX(0)';
    pages[currentPage].style.zIndex = 10;
  }, 800);
}

// Функция перелистывания страницы назад
function flipPageBack() {
  if (currentPage <= 0) return;

  const page = pages[currentPage - 1];

  flipSound.currentTime = 0;
  flipSound.play();

  pages[currentPage].style.transform = 'translateX(50%)';
  pages[currentPage].style.zIndex = 1;

  page.style.transform = 'translateX(0)';
  page.style.zIndex = 10;
  currentPage--;
}

// Привязка клика к каждой странице
pages.forEach(page => {
  page.addEventListener('click', () => {
    flipPageForward();
  });
});

// Опционально: клавиши стрелок для перелистывания
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') flipPageForward();
  if (e.key === 'ArrowLeft') flipPageBack();
});
