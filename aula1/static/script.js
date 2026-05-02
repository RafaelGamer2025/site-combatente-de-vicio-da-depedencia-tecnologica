// ====== EFEITO ÁGUA ======
const canvas = document.getElementById("water");
const ctx = canvas.getContext("2d");
const elements = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        const pos = el.getBoundingClientRect().top;

        if (pos < window.innerHeight - 100) {
            el.classList.add("show");
        }
    });
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let waves = [];

document.addEventListener("touchstart", (e) => {
    waves.push({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        radius: 0
    });
});

document.addEventListener("mousemove", (e) => {
    waves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0
    });
});
document.addEventListener("scroll", () => {
    waves.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 0
    });
});
window.addEventListener("scroll", () => {
    let scroll = window.scrollY;
    document.querySelector(".container").style.transform =
        `translateY(${scroll * 0.2}px)`;
});
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waves.forEach((wave, i) => {
        wave.radius += 2;

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,255, ${1 - wave.radius / 100})`;
        ctx.stroke();

        if (wave.radius > 100) {
            waves.splice(i, 1);
        }
    });

    requestAnimationFrame(draw);
}

draw();


// ====== MOTIVAÇÃO ======
function motivacao() {
    const frases = [
        "Você está no controle.",
        "Menos tela, mais vida.",
        "Foco é poder.",
        "Disciplina cria liberdade."
    ];

    document.getElementById("msg").innerText =
        frases[Math.floor(Math.random() * frases.length)];
}


// ====== TIMER ======
function startTimer() {
    let tempo = 25 * 60;
    let display = document.getElementById("timer");

    let intervalo = setInterval(() => {
        let min = Math.floor(tempo / 60);
        let seg = tempo % 60;

        display.innerText = `${min}:${seg}`;
        tempo--;

        if (tempo < 0) {
            clearInterval(intervalo);
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
        "Fique offline por 1 hora"
    ];

    document.getElementById("desafio").innerText =
        lista[Math.floor(Math.random() * lista.length)];
}