// ====== CANVAS ======
const canvas = document.getElementById('water');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// ====== ONDAS CONTROLADAS ======
let waves = [];
const MAX_WAVES = 15;
let lastMove = 0;

function createWave(x, y, isScroll = false) {
    if (!ctx) return;
    if (waves.length > MAX_WAVES && !isScroll) return;

    const maxRadius = isScroll
        ? Math.hypot(canvas.width, canvas.height)
        : 140;

    const growRate = isScroll ? 8 : 2;
    const lineWidth = isScroll ? 6 : 2;

    waves.push({ x, y, radius: 0, maxRadius, growRate, lineWidth });
}

function canCreate() {
    const now = Date.now();
    if (now - lastMove > 50) { lastMove = now; return true; }
    return false;
}


// ====== VIBRAÇÃO E SONS ======
function vibrar() {
    const vib = getSetting('vibrate');
    if (navigator.vibrate && vib) navigator.vibrate(200);
}



// ====== EVENTOS ======
document.addEventListener("mousemove", (e) => { if (canCreate()) createWave(e.clientX, e.clientY); });
document.addEventListener("touchmove", (e) => { if (canCreate()) { const t = e.touches[0]; createWave(t.clientX, t.clientY); vibrar(); } });

let lastScroll = 0;
window.addEventListener("scroll", () => {
    let now = Date.now();
    if (now - lastScroll > 200) { createWave(window.innerWidth / 2, window.innerHeight / 2, true); vibrar(); lastScroll = now; }
    const container = document.querySelector('.container');
    if (container) container.style.transform = `translateY(${window.scrollY * 0.12}px)`;
});

let blocked = false;

function bloquearModo() {
    blocked = true;
    alert("Modo foco ativado. Evite sair!");
}

window.onblur = () => {
    if (blocked) {
        alert("Volta pro foco 👀");
    }
};
let lastActive = Date.now();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        lastActive = Date.now();
    } else {
        let diff = (Date.now() - lastActive) / 1000;
        if (diff > 10) {
            alert(`Você ficou ${Math.floor(diff)}s fora 😬`);
        }
    }
});
// ====== ANIMAÇÃO ======
function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += wave.growRate || 2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        const alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);
        ctx.strokeStyle = `rgba(0,240,230,${alpha})`;
        ctx.lineWidth = wave.lineWidth || 2;
        ctx.stroke();
        if (wave.radius > wave.maxRadius) waves.splice(i, 1);
    }
    requestAnimationFrame(draw);
}
draw();


// ====== CARDS ======
function revealCards() {
    document.querySelectorAll(".card").forEach(el => { const pos = el.getBoundingClientRect().top; if (pos < window.innerHeight - 100) el.classList.add("show"); });
}
window.addEventListener("load", () => { revealCards(); initWidget(); });
window.addEventListener("scroll", revealCards);


// ====== MOTIVAÇÃO ======
function motivacao() {
    const frases = ["Você está no controle.", "Menos tela, mais vida.", "Foco é poder.", "Disciplina cria liberdade."];
    const el = document.getElementById("motivacao"); if (el) el.innerText = frases[Math.floor(Math.random() * frases.length)];
}

function checkAchievements(stats) {
    if (stats.sessions === 10) {
        alert("🏆 10 sessões concluídas!");
    }
}
window.onbeforeunload = function () {
    return "Você quer mesmo sair do foco?";
};
// ====== TIMER / MECÂNICAS ======
let timerState = { remaining: 25 * 60, running: false, intervalId: null, defaultFocus: 25 * 60 };

function formatTime(sec) { const m = Math.floor(sec / 60); const s = sec % 60; return `${m}:${s < 10 ? '0' + s : s}`; }

function updateTimerDisplay() {
    document.querySelectorAll('#timer, #widget-timer').forEach(d => { if (d) d.innerText = formatTime(timerState.remaining); });
}



function startTimerWidget(minutes) {
    if (typeof minutes === 'number') { timerState.remaining = minutes * 60; timerState.defaultFocus = minutes * 60; }
    if (timerState.running) return;
    timerState.running = true;
    timerState.intervalId = setInterval(() => {
        timerState.remaining--;
        updateTimerDisplay();
        if (timerState.remaining < 0) {
            clearInterval(timerState.intervalId); timerState.running = false; timerState.intervalId = null; onTimerFinish(checkarAchievements);
        }
    }, 1000);
    saveTimerState();
}

function pauseTimerWidget() {
    if (!timerState.running) return; clearInterval(timerState.intervalId); timerState.running = false; timerState.intervalId = null; saveTimerState();
}

function resetTimerWidget() { clearInterval(timerState.intervalId); timerState.running = false; timerState.intervalId = null; timerState.remaining = timerState.defaultFocus || 25 * 60; updateTimerDisplay(); saveTimerState(); }

function play(src) {
    const audio = new Audio(src);
    audio.play();
}

function onTimerFinish() {
    const stats = getStats();

    stats.sessions = (stats.sessions || 0) + 1;
    stats.minutes = (stats.minutes || 0) + Math.floor((timerState.defaultFocus || 25 * 60) / 60);

    updateStreak(stats);
    saveStats(stats);
    updateStatsUI();

    checkAchievements(stats); // ✅ AQUI

    vibrar();
    createWave(window.innerWidth / 2, window.innerHeight / 2, true);

    alert('Sessão finalizada! Bom trabalho.');
}
/* LocalStorage helpers */
function getStats() { const s = localStorage.getItem('cd_stats'); return s ? JSON.parse(s) : { sessions: 0, minutes: 0, streak: 0, lastDate: null }; }
function saveStats(s) { localStorage.setItem('cd_stats', JSON.stringify(s)); }

function updateStreak(stats) { const today = new Date().toISOString().slice(0, 10); if (stats.lastDate) { const last = stats.lastDate; const diff = (new Date(today) - new Date(last)) / 86400000; if (diff === 1) stats.streak = (stats.streak || 0) + 1; else if (diff !== 0) stats.streak = 1; } else stats.streak = 1; stats.lastDate = today; }

function updateStatsUI() { const s = getStats(); const elS = document.getElementById('stat-sessions'); const elM = document.getElementById('stat-minutes'); const elSt = document.getElementById('stat-streak'); if (elS) elS.innerText = s.sessions || 0; if (elM) elM.innerText = s.minutes || 0; if (elSt) elSt.innerText = s.streak || 0; }

function saveTimerState() { localStorage.setItem('cd_timer', JSON.stringify({ remaining: timerState.remaining, running: timerState.running, defaultFocus: timerState.defaultFocus })); }

function loadTimerState() { const t = localStorage.getItem('cd_timer'); if (t) { const obj = JSON.parse(t); timerState.remaining = obj.remaining || obj.defaultFocus || 25 * 60; timerState.defaultFocus = obj.defaultFocus || 25 * 60; if (obj.running) startTimerWidget(); else updateTimerDisplay(); } else updateTimerDisplay(); }

/* Settings */
function getSetting(key) { const s = localStorage.getItem('cd_settings'); if (!s) return key === 'vibrate' ? true : false; const obj = JSON.parse(s); return obj[key]; }
function setSetting(key, value) { const s = localStorage.getItem('cd_settings'); const obj = s ? JSON.parse(s) : {}; obj[key] = value; localStorage.setItem('cd_settings', JSON.stringify(obj)); }


// ====== DESAFIOS ======
// ====== PERFIL (localStorage) ======
function getProfile() { const s = localStorage.getItem('cd_profile'); return s ? JSON.parse(s) : null; }
function saveProfile(p) { localStorage.setItem('cd_profile', JSON.stringify(p)); applyProfile(p); }
function clearProfile() { localStorage.removeItem('cd_profile'); applyProfile(null); }
function applyProfile(p) {
    const brand = document.querySelector('.brand a');
    if (brand) brand.innerText = (p && p.name) ? `Olá, ${p.name}` : 'Controle Digital';
    if (p && p.defaultFocus) { timerState.defaultFocus = Number(p.defaultFocus) * 60; timerState.remaining = timerState.defaultFocus; updateTimerDisplay(); }
    if (p && p.accent) document.documentElement.style.setProperty('--accent', p.accent);
}

// ====== DESAFIOS ======
const desafiosList = [
    "Fique 2 horas sem celular",
    "Durma sem usar tela",
    "Leia 10 páginas de um livro",
    "Saia para caminhar sem tecnologia",
    "Fique offline por 1 hora",
    "Desative as notificações e durma cedo"
];

function gerarDesafio(targetId = 'desafio') { const el = document.getElementById(targetId) || document.getElementById('widget-desafio'); if (!el) return; el.innerText = desafiosList[Math.floor(Math.random() * desafiosList.length)]; }

function completarDesafio() { const stats = getStats(); stats.sessions = stats.sessions || 0; stats.minutes = stats.minutes || 0; stats.completed = (stats.completed || 0) + 1; saveStats(stats); updateStatsUI(); }


// ====== WIDGET + ABAS ======
function initWidget() {
    // load state
    loadTimerState(); updateStatsUI(); motivacao();

    // toggle
    const toggle = document.getElementById('widget-toggle'); const panel = document.querySelector('.widget-panel'); const widget = document.getElementById('widget'); const openBtn = document.getElementById('open-widget');
    if (toggle && panel && widget) {
        toggle.addEventListener('click', () => { const hidden = panel.hasAttribute('hidden'); if (hidden) { panel.removeAttribute('hidden'); widget.setAttribute('aria-hidden', 'false'); } else { panel.setAttribute('hidden', ''); widget.setAttribute('aria-hidden', 'true'); } });
        if (openBtn) openBtn.addEventListener('click', () => { panel.removeAttribute('hidden'); widget.setAttribute('aria-hidden', 'false'); });
    }

    // tabs
    document.querySelectorAll('.widget-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.widget-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab'); document.querySelectorAll('.widget-body').forEach(body => body.classList.add('hidden'));
            const active = document.getElementById('tab-' + tab); if (active) active.classList.remove('hidden');
        });
    });

    // timer controls
    const start = document.getElementById('widget-start'); const pause = document.getElementById('widget-pause'); const reset = document.getElementById('widget-reset');
    if (start) start.addEventListener('click', () => startTimerWidget());
    if (pause) pause.addEventListener('click', () => pauseTimerWidget());
    if (reset) reset.addEventListener('click', () => resetTimerWidget());

    // quick sets
    document.querySelectorAll('.quick-sets [data-min]').forEach(b => b.addEventListener('click', () => { const m = Number(b.getAttribute('data-min')); startTimerWidget(m); }));

    // desafio buttons
    const gen = document.getElementById('widget-gerar'); if (gen) gen.addEventListener('click', () => gerarDesafio('widget-desafio'));
    const comp = document.getElementById('widget-completar'); if (comp) comp.addEventListener('click', () => completarDesafio());

    // settings
    const sv = document.getElementById('setting-vibrate'); if (sv) { sv.checked = getSetting('vibrate') !== false; sv.addEventListener('change', () => setSetting('vibrate', sv.checked)); }
    const ss = document.getElementById('setting-sounds'); if (ss) { ss.checked = getSetting('sounds') === true; ss.addEventListener('change', () => setSetting('sounds', ss.checked)); }

    // profile form (se presente)
    const inputName = document.getElementById('profile-name');
    const inputEmail = document.getElementById('profile-email');
    const inputFocus = document.getElementById('profile-focus');
    const inputAccent = document.getElementById('profile-accent');
    const btnSave = document.getElementById('profile-save');
    const btnClear = document.getElementById('profile-clear');
    const profile = getProfile();
    if (profile) {
        if (inputName) inputName.value = profile.name || '';
        if (inputEmail) inputEmail.value = profile.email || '';
        if (inputFocus) inputFocus.value = profile.defaultFocus || '25';
        if (inputAccent) inputAccent.value = profile.accent || '#00f0e6';
        applyProfile(profile);
    }
    if (btnSave) btnSave.addEventListener('click', () => {
        const p = { name: inputName ? inputName.value.trim() : '', email: inputEmail ? inputEmail.value.trim() : '', defaultFocus: inputFocus ? inputFocus.value : '25', accent: inputAccent ? inputAccent.value : '#00f0e6' };
        saveProfile(p); loadTimerState(); updateStatsUI();
    });
    if (btnClear) btnClear.addEventListener('click', () => { if (confirm('Excluir seus dados locais? Isso removerá seu perfil salvo.')) { clearProfile(); } });

    // legacy page buttons (expor utilitários globalmente para botões rápidos)
    window.startTimer = function() { startTimerWidget(25); };
    window.startTimerWidget = startTimerWidget;
    window.desafio = function() { gerarDesafio('desafio'); };
    window.gerarDesafio = gerarDesafio;
}
