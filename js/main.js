// js/main.js — рунная анимация и звук (работает независимо от радио)
(function(){
  const canvas = document.getElementById('runesCanvas');
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
  const particles = [];
  for(let i=0;i<120;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      rune: runes[i % runes.length],
      size: 18 + Math.random()*28,
      dx: (Math.random()-0.5)*1.6,
      dy: (Math.random()-0.5)*1.2,
      rot: Math.random()*Math.PI*2,
      rotSpeed: (Math.random()-0.5)*0.02,
      type: i % 5
    });
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      ctx.save();
      // тёмно-оранжевый с лёгким градиентом альфа
      const alpha = 0.65;
      ctx.fillStyle = `rgba(255,${120 + Math.floor(Math.random()*80)},0,${alpha})`;
      ctx.font = `${p.size}px FutharkAoe`;
      ctx.translate(p.x,p.y);
      if(p.type === 2){
        p.rot += p.rotSpeed;
        ctx.rotate(p.rot);
      }
      ctx.fillText(p.rune, 0, 0);
      ctx.restore();
    });
    update();
    requestAnimationFrame(draw);
  }

  function update(){
    particles.forEach(p=>{
      switch(p.type){
        case 0: p.y += 0.4 + Math.sin((p.x + performance.now()/1000)/2)*0.4; break; // падение
        case 1: p.y += Math.sin((performance.now()/1000 + p.x)*0.6)*0.6; break; // парение
        case 2: p.x += p.dx; p.y += p.dy; break; // движение произвольное
        case 3: p.x += Math.sin(performance.now()/1000 + p.y/100)*0.4; break; // дрейф
        case 4: p.x += (Math.random()-0.5)*0.8; p.y += (Math.random()-0.5)*0.8; break; // хаос
      }
      if(p.x > canvas.width + 40) p.x = -40;
      if(p.x < -40) p.x = canvas.width + 40;
      if(p.y > canvas.height + 40) p.y = -40;
      if(p.y < -40) p.y = canvas.height + 40;
    });
  }

  // Звук: кнопка mute
  const music = document.getElementById('bgMusic');
  const muteBtn = document.getElementById('muteBtn');
  if(muteBtn && music){
    muteBtn.addEventListener('click', ()=>{
      if(music.paused){ music.play(); muteBtn.textContent = '🔊'; }
      else { music.pause(); muteBtn.textContent = '🔇'; }
    });
  }

  draw();
})();
