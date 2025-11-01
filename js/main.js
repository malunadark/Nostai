// main.js — руническое дыхание NOSTAI
console.log("main.js запущен");

const runeContainer = document.getElementById("rune-container");

const runes = [
  "ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ",
  "ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛋ","ᛏ","ᛒ","ᛖ","ᛗ",
  "ᛚ","ᛜ","ᛞ","ᛟ"
];

// Создание рун с разными анимациями
runes.forEach((rune, i) => {
  const el = document.createElement("div");
  el.className = "rune rune-type" + ((i % 5) + 1);
  el.textContent = rune;

  el.style.left = Math.random() * 90 + "%";
  el.style.top = Math.random() * 90 + "%";
  el.style.animationDelay = (Math.random() * 10) + "s";
  el.style.fontSize = (40 + Math.random() * 30) + "px";
  el.style.opacity = (0.6 + Math.random() * 0.4).toString();

  runeContainer.appendChild(el);
});
