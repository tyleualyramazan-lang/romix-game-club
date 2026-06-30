const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [];
let food;
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let level = 1;
let speed = 150;
let timer;
let life = 3;
let shield = false;
let fast = false;

let obstacles = [];
let bonuses = [];
let particles = [];
let texts = [];

let best = localStorage.getItem("bestScore") || 0;
document.getElementById("best").innerHTML = best;
document.getElementById("player").innerHTML = localStorage.getItem("playerName") || "Player";

function startGame() {
  snake = [{ x: 200, y: 200 }];
  score = 0;
  level = 1;
  life = 3;
  shield = false;
  speed = 150;
  direction = "RIGHT";
  nextDirection = "RIGHT";

  obstacles = [];
  bonuses = [];
  particles = [];
  texts = [];

  document.getElementById("score").innerHTML = 0;
  document.getElementById("life").innerHTML = life;
  document.getElementById("level").innerHTML = level;

  createFood();
  createObstacles();
  createBonus();

  clearInterval(timer);
  timer = setInterval(gameLoop, speed);
}

function gameLoop() {
  ctx.clearRect(0, 0, 400, 400);
  drawMap();
  drawObstacles();
  drawBonus();
  drawFood();
  drawSnake();
  updateParticles();
  updateTexts();
  moveSnake();
}

function moveSnake() {
  direction = nextDirection;
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "RIGHT") head.x += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Картадан шығуды тексеру
  if (head.x < 0 || head.y < 0 || head.x >= 400 || head.y >= 400) {
    damage();
    return;
  }

  // Кедергілермен соғысуды тексеру
  for (let o of obstacles) {
    if (head.x === o.x && head.y === o.y) {
      damage();
      return;
    }
  }

  // Өз-өзіне соғысуды тексеру
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      damage();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    eatFood();
  } else {
    snake.pop();
  }
}

function eatFood() {
  score++;
  document.getElementById("score").innerHTML = score;

  createParticles(food.x, food.y);
  createText("+1", food.x, food.y);
  playSound();

  if (score % 5 === 0) {
    level++;
    speed = Math.max(50, speed - 15); // Жылдамдық шектен тыс асып кетпеуі үшін
    document.getElementById("level").innerHTML = level;
    clearInterval(timer);
    timer = setInterval(gameLoop, speed);
  }
  createFood();
}

function drawMap() {
  ctx.fillStyle = "#020202";
  ctx.fillRect(0, 0, 400, 400);
}

function drawSnake() {
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#70ff00" : "#22aa00";
    ctx.beginPath();
    ctx.arc(s.x + 10, s.y + 10, i === 0 ? 10 : 7, 0, Math.PI * 2);
    ctx.fill();

    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(s.x + 6, s.y + 6, 2, 0, Math.PI * 2);
      ctx.arc(s.x + 14, s.y + 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function drawFood() {
  ctx.font = "22px Arial";
  ctx.fillText("🍰", food.x, food.y + 20);
}

function createObstacles() {
  for (let i = 0; i < 5; i++) { // Мобильді құрылғыда қиын болмас үшін 5 кедергі жеткілікті
    obstacles.push({
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    });
  }
}

function drawObstacles() {
  ctx.fillStyle = "#555";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, box, box);
  });
}

function createBonus() {
  bonuses.push({
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
    type: Math.random() > 0.5 ? "shield" : "fast"
  });
}

function drawBonus() {
  bonuses.forEach(b => {
    ctx.font = "20px Arial";
    ctx.fillText(b.type === "shield" ? "🛡" : "⚡", b.x, b.y + 20);
  });
}

function damage() {
  if (shield) {
    shield = false;
    return;
  }
  life--;
  document.getElementById("life").innerHTML = life;

  if (life <= 0) {
    gameOver();
  } else {
    // Өмір қалса, жыланды ортаға қайтарамыз
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
  }
}

function gameOver() {
  clearInterval(timer);
  if (score > best) {
    best = score;
    localStorage.setItem("bestScore", score);
  }
  document.getElementById("best").innerHTML = best;
  document.getElementById("final").innerHTML = score;
  document.getElementById("message").style.display = "block";
}

function createParticles(x, y) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: x,
      y: y,
      life: 30,
      speedX: (Math.random() - 0.5) * 5,
      speedY: (Math.random() - 0.5) * 5
    });
  }
}

function updateParticles() {
  particles.forEach((p, index) => {
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(p.x, p.y, 4, 4);
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    if (p.life <= 0) particles.splice(index, 1);
  });
}

function createText(t, x, y) {
  texts.push({ text: t, x: x, y: y, life: 40 });
}

function updateTexts() {
  texts.forEach((t, index) => {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(t.text, t.x, t.y);
    t.y--;
    t.life--;
    if (t.life <= 0) texts.splice(index, 1);
  });
}

function playSound() {
  try {
    let audio = new (window.AudioContext || window.webkitAudioContext)();
    let osc = audio.createOscillator();
    osc.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.1);
  } catch(e) { console.log("Audio error"); }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

function changeDirection(d) {
  if (d === "UP" && direction !== "DOWN") nextDirection = "UP";
  if (d === "DOWN" && direction !== "UP") nextDirection = "DOWN";
  if (d === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
  if (d === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
}

function restartGame() {
  document.getElementById("message").style.display = "none";
  startGame();
}

function goHome() {
  clearInterval(timer);
  location.href = "../../index.html"; // Түбірлік папкаға оралу
}

// Бет толық жүктелгенде іске қосу
window.onload = startGame;