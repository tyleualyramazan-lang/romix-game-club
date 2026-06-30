function startGame() {
  let name = document.getElementById("playerName").value;

  if (name.trim() === "") {
    alert("Атыңды енгіз");
    return;
  }

  // Ойындармен сәйкес болу үшін кілтті "playerName" деп өзгерттік
  localStorage.setItem("playerName", name);

  document.getElementById("welcome").innerHTML =
    "Қош келдің, " + name + " 🎮";
}

function openSnake() {
  window.location.href = "games/snake/snake.html";
}

function openTicTacToe() {
  window.location.href = "games/tic-tac-toe/tic.html";
}

function openPuzzle() {
  window.location.href = "games/puzzle/puzzle.html";
}

function openMemory() {
  window.location.href = "games/memory/memory.html";
}

function openFlappy() {
  window.location.href = "games/flappy/flappy.html";
}