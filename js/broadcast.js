const chat = document.getElementById('chat');
const messages = [
  "Придшие: ситуация критическая...",
  "Падшие: подготовка к выживанию идёт.",
  "Отверженные: слышим сигналы с севера.",
  "Придшие: осторожно, туман приближается.",
  "Падшие: держим позиции и ждём."
];

let index = 0;

function showMsg() {
  if(index >= messages.length) index = 0;
  const msg = document.createElement('div');
  msg.className = 'msg';
  msg.textContent = messages[index++];
  chat.appendChild(msg);
  if(chat.children.length > 10) chat.removeChild(chat.firstChild);
  setTimeout(showMsg, 3000 + Math.random()*3000);
}

showMsg();
