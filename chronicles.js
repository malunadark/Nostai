document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('book-container');
  const flipSound = document.getElementById('book-page-turn-4_z1xaim4u.mp3');

  const book = document.createElement('div');
  book.id = 'chronicles-book';
  container.appendChild(book);

  const pages = [
    {title: "Глава 1", content: "Старый лес скрывает тайны…"},
    {title: "Глава 2", content: "Тени шепчут свои секреты…"},
    {title: "Глава 3", content: "Порог между мирами открыт…"},
    {title: "Глава 4", content: "Судьбы переплетаются, как нити света…"}
  ];

  pages.forEach(p => {
    const page = document.createElement('div');
    page.className = 'page';
    page.style.backgroundImage = "url('assets/book.png')";
    page.innerHTML = `<h2 class="page-title">${p.title}</h2><p class="page-content">${p.content}</p>`;
    book.appendChild(page);
  });

  // Инициализация turn.js
  $('#chronicles-book').turn({
    width: 800,
    height: 600,
    autoCenter: true,
    when: {
      turning: function(e, page, view) {
        flipSound.currentTime = 0;
        flipSound.play();
      }
    }
  });
});
