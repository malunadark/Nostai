.sun-rays {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,0,0.5) 0%, rgba(255,255,0,0) 80%);
    filter: blur(50px);
    opacity: 0.7;
    transform: translate(-50%, -50%);
    animation: sunMove 4s infinite alternate ease-in-out;
}

@keyframes sunMove {
    0% {
        transform: translate(-50%, -50%) scale(1); /* Начальная позиция, без изменений */
        opacity: 0.7;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.2); /* Расширение и увеличение эффекта */
        opacity: 0.5;
    }
}


