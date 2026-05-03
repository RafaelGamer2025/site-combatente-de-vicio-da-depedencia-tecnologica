// ====== CANVAS ======
const canvas = document.getElementById("water");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// ====== ONDAS CONTROLADAS ======
let waves = [];
const MAX_WAVES = 15;
let lastMove = 0;

function createWave(x, y) {
    if (waves.length > MAX_WAVES) return;

    waves.push({
        x,
        y,
        radius: 0
    });
}

function canCreate() {
    const now = Date.now();
    if (now - lastMove > 50) {
        lastMove = now;
        return true;
    }
    return false;
}


// ====== VIBRAÇÃO ======
function vibrar() {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}


// ====== EVENTOS ======

// mouse
document.addEventListener("mousemove", (e) => {
    if (canCreate()) {
        createWave(e.clientX, e.clientY);
    }
});

// celular
document.addEventListener("touchmove", (e) => {
    if (canCreate()) {
        const t = e.touches[0];
        createWave(t.clientX, t.clientY);
        vibrar();
    }
});

// scroll (leve, sem spam)
let lastScroll = 0;

window.addEventListener("scroll", () => {
    let now = Date.now();

    if (now - lastScroll > 200) {
        createWave(window.innerWidth / 2, window.innerHeight / 2);
        vibrar();
        lastScroll = now;
    }

    // efeito parallax leve
    let scroll = window.scrollY;
    document.querySelector(".container").style.transform =
        `translateY(${scroll * 0.2}px)`;
});


// ====== ANIMAÇÃO ======
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waves.forEach((wave, i) => {
        wave.radius += 2;

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,255,${1 - wave.radius / 120})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (wave.radius > 900) {
            waves.splice(i, 1);
        }
    });

    requestAnimationFrame(draw);
}
draw();


// ====== CARDS (corrigido) ======
function revealCards() {
    document.querySelectorAll(".card").forEach(el => {
        const pos = el.getBoundingClientRect().top;

        if (pos < window.innerHeight - 100) {
            el.classList.add("show");
        }
    });
}

window.addEventListener("load", revealCards);
window.addEventListener("scroll", revealCards);


// ====== MOTIVAÇÃO ======
function motivacao() {
    const frases = [
        "Você está no controle.",
        "Menos tela, mais vida.",
        "Foco é poder.",
        "Disciplina cria liberdade."
    ];

    document.getElementById("motivacao").innerText =
        frases[Math.floor(Math.random() * frases.length)];
}


// ====== TIMER (CORRIGIDO) ======
let intervaloTimer = null;

function startTimer() {
    if (intervaloTimer) clearInterval(intervaloTimer);

    let tempo = 25 * 60;
    const display = document.getElementById("timer");

    intervaloTimer = setInterval(() => {
        let min = Math.floor(tempo / 60);
        let seg = tempo % 60;

        display.innerText = `${min}:${seg < 10 ? "0" + seg : seg}`;
        tempo--;

        if (tempo < 0) {
            clearInterval(intervaloTimer);
            intervaloTimer = null;
            alert("Tempo finalizado!");
        }
    }, 1000);
}


// ====== DESAFIO ======
function desafio() {
    const lista = [
        "Fique 2 horas sem celular",
        "Durma sem usar tela",
        "Leia 10 páginas de um livro",
        "Saia para caminhar sem tecnologia",
        "Fique offline por 1 hora",
        "desative as notificaçoes e durma cedo"
    ];

    document.getElementById("desafio").innerText =
        lista[Math.floor(Math.random() * lista.length)];
}