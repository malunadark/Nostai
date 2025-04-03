document.addEventListener("DOMContentLoaded", function () {
    const fire = document.querySelector(".fire");

    function flickerFire() {
        let randomScale = 1 + Math.random() * 0.2;
        let randomOpacity = 0.7 + Math.random() * 0.3;
        fire.style.transform = `translateX(-50%) scale(${randomScale})`;
        fire.style.opacity = randomOpacity;
    }

    setInterval(flickerFire, 200);
});
