// main.js
import { startDoorScene } from './doorScene.js';

console.log("main.js модуль загружен");

const messagesDiv = document.getElementById('messages');
const enterBtn = document.getElementById('enter-btn');

const factions = ['Придшие', 'Падшие', 'Отверженные'];
const sampleMessages = [
    'Ваша миссия важна.',
    'Берегитесь врагов!',
    'Найдите союзников.',
    'Тьма приближается...',
    'Сила внутри вас!'
];

function addRandomMessage() {
    const faction = factions[Math.floor(Math.random() * factions.length)];
    const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const div = document.createElement('div');
    div.textContent = `[${faction}]: ${message}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    if (messagesDiv.children.length > 12) {
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
}

setInterval(addRandomMessage, 3000);

// Кнопка входа
enterBtn.addEventListener('click', () => {
    startDoorScene(); // вызов мини-модуля doorScene
});
