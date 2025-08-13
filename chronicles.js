document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('book-container');

  // Создаём книгу
  const book = document.createElement('div');
  book.id = 'chronicles-book';
  container.appendChild(book);

  // Пример страниц
  const pages = [
    {title: "Глава 1", content: "Старый лес скрывает тайны…"},
    {title: "Глава 2", content: "Тени шепчут свои секреты…"},
    {title: "Глава 3", content: "Порог между мирами открыт…"}
  ];

  pages.forEach((p, i) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.innerHTML = `<h2 class="page-title">${p.title}</h2><p class="page-content">${p.content}</p>`;
    book.appendChild(page);
  });

  // Инициализация turn.js
  if(typeof $ !== 'undefined' && $('#chronicles-book').turn){
    $('#chronicles-book').turn({
      width: 800,
      height: 600,
      autoCenter: true
    });
  }
});
