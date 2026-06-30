// Пазлдың бастапқы реті (8 - бос орын)
let tiles = [1, 2, 3, 4, 5, 6, 7, 8, ""];
let moves = 0;
let seconds = 0;
let timerInterval;
let gameActive = true;

document.getElementById("player").innerHTML = localStorage.getItem("playerName") || "Player";

function initGame() {
  moves = 0;
  seconds = 0;
  gameActive = true;
  document.getElementById("moves").innerHTML = moves;
  document.getElementById("timer").innerHTML = "00:00";
  document.getElementById("status").innerHTML = "Сандарды ретімен жина!";
  
  shuffleTiles();
  renderBoard();
  
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

// Пазлдарды кездейсоқ араластыру (шешімі бар болатындай қылып)
function shuffleTiles() {
  do {
    for (let i = tiles.length - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable() || isWon()); // Шешілмейтін немесе бірден жеңіс боп тұратын күйді болдырмау
}

// 3x3 пазлдың шешілуі мүмкін екенін тексеру логикасы
function isSolvable() {
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

// Экранға пазлдарды шығару
function renderBoard() {
  const board = document.getElementById("puzzle-board");
  board.innerHTML = "";
  
  tiles.forEach((tile, index) => {
    const tileDiv = document.createElement("div");
    tileDiv.classList.add("tile");
    if (tile === "") {
      tileDiv.classList.add("empty");
    } else {
      tileDiv.innerHTML = tile;
      tileDiv.onclick = () => moveTile(index);
    }
    board.appendChild(tileDiv);
  });
}

// Пазлды жылжыту
function moveTile(index) {
  if (!gameActive) return;
  
  const emptyIndex = tiles.indexOf("");
  
  // Көрші ұяшықтарды анықтау (оң, сол, жоғары, төмен)
  const isAdjacent = 
    (Math.abs(index - emptyIndex) === 1 && Math.floor(index / 3) === Math.floor(emptyIndex / 3)) ||
    Math.abs(index - emptyIndex) === 3;
    
  if (isAdjacent) {
    // Орындарын ауыстыру
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moves++;
    document.getElementById("moves").innerHTML = moves;
    renderBoard();
    checkWin();
  }
}

// Жеңісті тексеру
function checkWin() {
  if (isWon()) {
    gameActive = false;
    clearInterval(timerInterval);
    document.getElementById("status").innerHTML = "🎉 Керемет! Сен жеңдің! 😎";
  }
}

function isWon() {
  const winOrder = [1, 2, 3, 4, 5, 6, 7, 8, ""];
  return tiles.every((val, i) => val === winOrder[i]);
}

// Таймер функциясы
function updateTimer() {
  seconds++;
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  document.getElementById("timer").innerHTML = 
    (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
}

function restartGame() {
  initGame();
}

function goHome() {
  clearInterval(timerInterval);
  location.href = "../../index.html";
}

// Бет жүктелгенде ойынды іске қосу
window.onload = initGame;