const canvas = document.getElementById('runesCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
let particles = [];

// Генерация рун
for(let i=0; i<100; i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    rune: runes[i % runes.length],
    size: 20 + Math.random()*20,
    dx: (Math.random()-0.5)*2,
    dy: (Math.random()-0.5)*2,
    type: i % 5 // Паттерн движения каждые 5 рун
  });
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.save();
    ctx.fillStyle = `rgba(255,${140 + Math.random()*50},0,0.8)`;
    ctx.font = `${p.size}px FutharkAoe`;
    ctx.translate(p.x,p.y);
    if(p.type === 2) ctx.rotate((Date.now()/1000)%6.28);
    ctx.fillText(p.rune,0,0);
    ctx.restore();
  });
  update();
  requestAnimationFrame(draw);
}

function update() {
  particles.forEach(p=>{
    switch(p.type){
      case 0: p.y += 0.5; if(p.y>canvas.height) p.y=0; break; // падение
      case 1: p.y += Math.sin(Date.now()/1000+p.x)*0.5; break; // парение
      case 2: p.x += p.dx; p.y += p.dy; break; // вращение
      case 3: p.x += Math.sin(Date.now()/1000)*0.5; break; // дрейф
      case 4: p.x += (Math.random()-0.5); p.y += (Math.random()-0.5); break; // хаос
    }
    if(p.x>canvas.width) p.x=0;
    if(p.x<0) p.x=canvas.width;
  });
}

// Музыка
const music = document.getElementById('bgMusic');
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click',()=>{
  if(music.paused){
    music.play();
    muteBtn.textContent = '🔊';
  } else {
    music.pause();
    muteBtn.textContent = '🔇';
  }
});

draw();
window.addEventListener('resize',()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
