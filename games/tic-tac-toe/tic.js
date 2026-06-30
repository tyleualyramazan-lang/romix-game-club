let board = ["", "", "", "", "", "", "", "", ""];
let player = "X";
let gameMode = "";
let gameOver = false;

document.getElementById("player").innerHTML = localStorage.getItem("playerName") || "Player";

function startRobot() {
  gameMode = "robot";
  startGame();
}

function startTwoPlayer() {
  gameMode = "two";
  startGame();
}

function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("board").style.display = "grid";
  document.getElementById("restart").style.display = "block";

  board = ["", "", "", "", "", "", "", "", ""];
  player = "X";
  gameOver = false;

  draw();
  document.getElementById("status").innerHTML = "❌ кезегі";
}

function move(index) {
  if (board[index] !== "" || gameOver) return;

  board[index] = player;
  draw();

  if (checkWinner()) return;

  if (gameMode === "robot" && player === "X") {
    player = "O";
    document.getElementById("status").innerHTML = "🤖 Робот ойлап жатыр...";
    setTimeout(robotMove, 500);
  } else {
    player = player === "X" ? "O" : "X";
    document.getElementById("status").innerHTML = player === "X" ? "❌ кезегі" : "⭕ кезегі";
  }
}

function robotMove() {
  if (gameOver) return;
  let moveIndex = bestMove();
  board[moveIndex] = "O";
  draw();

  if (checkWinner()) return;

  player = "X";
  document.getElementById("status").innerHTML = "❌ кезегі";
}

function bestMove() {
  // 1. Жеңетін жүрісті тексеру
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (win("O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 2. Блок жасау (Ойыншының алдын алу)
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (win("X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 3. Кездейсоқ бос ұяшықты таңдау
  let empty = [];
  board.forEach((x, i) => {
    if (x === "") empty.push(i);
  });
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWinner() {
  if (win(player)) {
    gameOver = true;
    if (player === "X") {
      document.getElementById("status").innerHTML = "🎉 " + (localStorage.getItem("playerName") || "Сен") + " жеңдің! 😎";
    } else {
      document.getElementById("status").innerHTML = "🤖 Робот жеңді";
    }
    return true;
  }

  if (!board.includes("")) {
    gameOver = true;
    document.getElementById("status").innerHTML = "🤝 Тең ойын!";
    return true;
  }
  return false;
}

function win(p) {
  let combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Көлденең
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Тігінен
    [0, 4, 8], [2, 4, 6]             // Диactivity
  ];
  return combos.some(c => c.every(i => board[i] === p));
}

function draw() {
  let cells = document.querySelectorAll("#board div");
  cells.forEach((cell, i) => {
    cell.innerHTML = board[i];
    if (board[i] === "X") cell.style.color = "#00ff66";
    if (board[i] === "O") cell.style.color = "#ff0066";
  });
}

function restart() {
  startGame();
}

function goHome() {
  location.href = "../../index.html"; // Түбірлік папкаға қайту
}