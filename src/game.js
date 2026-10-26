const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const ui = document.getElementById('ui');
const startBtn = document.getElementById('start-btn');

let score = 0, gameActive = false, player = { x: 0, y: 0, w: 40, h: 40 }, enemies = [], particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; player.x = canvas.width / 2 - 20; player.y = canvas.height - 100; }
window.addEventListener('resize', resize); resize();

window.addEventListener('mousemove', (e) => player.x = e.clientX - 20);
window.addEventListener('touchmove', (e) => player.x = e.touches[0].clientX - 20);

function spawnEnemy() {
    if (!gameActive) return;
    enemies.push({ x: Math.random() * (canvas.width - 30), y: -30, w: 30, h: 30, speed: 3 + score/1000 });
    setTimeout(spawnEnemy, Math.max(200, 1000 - score/10));
}

function update() {
    if (!gameActive) return;
    score++;
    scoreEl.innerText = Math.floor(score / 10);
    enemies.forEach((e, i) => {
        e.y += e.speed;
        if (e.y > canvas.height) enemies.splice(i, 1);
        if (e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) gameOver();
    });
    requestAnimationFrame(loop);
}

function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0ff';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#f0f';
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}

function loop() { update(); draw(); }

function gameOver() {
    gameActive = false;
    ui.style.display = 'flex';
    document.getElementById('title').innerText = 'GAME OVER';
    startBtn.innerText = 'RESTART';
}

startBtn.onclick = () => {
    gameActive = true;
    score = 0;
    enemies = [];
    ui.style.display = 'none';
    document.getElementById('score-board').style.display = 'block';
    spawnEnemy();
    loop();
};