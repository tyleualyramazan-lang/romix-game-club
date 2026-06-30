const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Ойын баптаулары
let birdY = 200;
let birdX = 50;
let gravity = 0.4;
let velocity = 0;
let jump = -6;
let score = 0;
let gameOver = false;
let gameStarted = false;

let pipes = [];
let pipeWidth = 50;
let pipeGap = 110; // Құбырлар арасындағы бос орын
let pipeSpeed = 2;
let frameCount = 0;

document.getElementById("player").innerHTML = localStorage.getItem("playerName") || "Player";
let bestScore = localStorage.getItem("flappyBestScore") || 0;
document.getElementById("best").innerHTML = bestScore;

function initGame() {
  birdY = 200;
  velocity = 0;
  score = 0;
  gameOver = false;
  gameStarted = false;
  pipes = [];
  frameCount = 0;
  
  document.getElementById("score").innerHTML = score;
  document.getElementById("message").style.display = "none";
  
  draw();
}

// Ойынды цикл бойы жаңартып тұру
function update() {
  if (gameOver || !gameStarted) return;

  frameCount++;
  velocity += gravity;
  birdY += velocity;

  // Төбеге немесе еденге соғылуды тексеру
  if (birdY + 12 >= canvas.height || birdY - 12 <= 0) {
    endGame();
  }

  // Әр 100 кадр сайын жаңа құбыр қосу
  if (frameCount % 100 === 0) {
    let topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30;
    pipes.push({
      x: canvas.width,
      top: topPipeHeight,
      passed: false
    });
  }

  // Құбырларды қозғалту және соғылуды тексеру
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    // Құс құбырдың ішіне кірді ме?
    if (birdX + 12 > pipe.x && birdX - 12 < pipe.x + pipeWidth) {
      if (birdY - 12 < pipe.top || birdY + 12 > pipe.top + pipeGap) {
        endGame();
      }
    }

    // Ұпай санау
    if (!pipe.passed && pipe.x + pipeWidth < birdX) {
      pipe.passed = true;
      score++;
      document.getElementById("score").innerHTML = score;
    }

    // Экраннан шығып кеткен құбырларды өшіру
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
    }
  });
}

// Экранды суреттеу
function draw() {
  // Аспанды тазалау
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Құбырларды салу
  pipes.forEach(pipe => {
    ctx.fillStyle = "#73bf2e";
    // Жоғарғы құбыр
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.strokeStyle = "#538221";
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);

    // Төменгі құбыр
    let bottomY = pipe.top + pipeGap;
    ctx.fillRect(pipe.x, bottomY, pipeWidth, canvas.height - bottomY);
    ctx.strokeRect(pipe.x, bottomY, pipeWidth, canvas.height - bottomY);
  });

  // Құсты салу (Смайлик немесе шеңбер)
  ctx.font = "24px Arial";
  ctx.fillText("🐦", birdX - 12, birdY + 8);

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Бастау үшін экранды түрт!", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "start"; // Қалпына келтіру
  }
}

// Ойын циклі
function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Секіру функциясы (Экранды басқанда немесе Space пернесін басқанда)
function action() {
  if (gameOver) return;
  
  if (!gameStarted) {
    gameStarted = true;
  }
  velocity = jump;
}

// Түрту оқиғалары
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Экранның төмен сырғып кетуін тоқтатады
  action();
});

window.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "ArrowUp") {
    action();
  }
});

function endGame() {
  gameOver = true;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("flappyBestScore", bestScore);
    document.getElementById("best").innerHTML = bestScore;
  }
  document.getElementById("final-score").innerHTML = score;
  document.getElementById("message").style.display = "block";
}

function restartGame() {
  initGame();
  requestAnimationFrame(gameLoop);
}

function goHome() {
  location.href = "../../index.html";
}

// Ойын беті жүктелгенде іске қосу
window.onload = () => {
  initGame();
  requestAnimationFrame(gameLoop);
};