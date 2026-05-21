function openChronicles(){

    const fade =
    document.getElementById('fade');

    const sound =
    document.getElementById('openSound');

    sound.currentTime = 0;

    sound.play().catch(()=>{});

    fade.style.opacity = "1";

    setTimeout(()=>{

        window.location.href =
        "./html/chronicles.html";

    },1000);
}

/* =========================
   ПЕПЕЛ
========================= */

const canvas =
document.getElementById("ash");

const ctx =
canvas.getContext("2d");

function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

const particles = [];

const particleCount =
window.innerWidth > 1900
? 180
: 120;

for(let i = 0; i < particleCount; i++){

    particles.push({

        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,

        size:Math.random()*3 + 1,

        speedY:Math.random()*0.7 + 0.2,

        speedX:
        (Math.random()-0.5)*0.3,

        opacity:
        Math.random()*0.5 + 0.1
    });
}

function animateAsh(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(p=>{

        ctx.beginPath();

        ctx.fillStyle =
        `rgba(200,200,200,${p.opacity})`;

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        if(p.y > canvas.height){

            p.y = -10;

            p.x =
            Math.random()*canvas.width;
        }

    });

    requestAnimationFrame(
        animateAsh
    );
}

animateAsh();
