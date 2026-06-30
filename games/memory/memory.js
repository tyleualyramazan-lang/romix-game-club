// 8 түрлі смайлик (әрқайсысынан 2 данадан, жалпы 16 карта)
const emojis = ["🦁", "🦁", "🦊", "🦊", "🐼", "🐼", "🐸", "🐸", "🐵", "🐵", "🦄", "🦄", "🐝", "🐝", "🦀", "🦀"];
let shuffledEmojis = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let lockBoard = false;

document.getElementById("player").innerHTML = localStorage.getItem("playerName") || "Player";
let bestMoves = localStorage.getItem("memoryBestMoves") || "-";
document.getElementById("best-moves").innerHTML = bestMoves;

function initGame() {
  moves = 0;
  matchedCount = 0;
  flippedCards = [];
  lockBoard = false;
  document.getElementById("moves").innerHTML = moves;
  document.getElementById("status").innerHTML = "Бірдей жұптарды тап!";
  
  shuffle();
  renderBoard();
}

// Карточкаларды кездейсоқ араластыру
function shuffle() {
  shuffledEmojis = [...emojis];
  for (let i = shuffledEmojis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledEmojis[i], shuffledEmojis[j]] = [shuffledEmojis[j], shuffledEmojis[i]];
  }
}

// Экранға карточкаларды шығару
function renderBoard() {
  const board = document.getElementById("memory-board");
  board.innerHTML = "";
  
  shuffledEmojis.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });
}

// Карточканы басу (ашу)
function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("flip") || card.classList.contains("matched")) return;

  card.classList.add("flip");
  card.innerHTML = card.dataset.emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").innerHTML = moves;
    checkMatch();
  }
}

// Екі картаның сәйкестігін тексеру
function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Жұп табылса
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedCount += 2;
    flippedCards = [];
    
    if (matchedCount === emojis.length) {
      handleWin();
    }
  } else {
    // Жұп қате болса, 0.8 секундтан кейін қайта жабамыз
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove("flip");
      card2.classList.remove("flip");
      card1.innerHTML = "";
      card2.innerHTML = "";
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

// Жеңіс жағдайы
function handleWin() {
  document.getElementById("status").innerHTML = "🎉 Тамаша! Барлық жұптарды таптың! 😎";
  
  // Рекордты жаңарту (ең аз жүріс)
  if (bestMoves === "-" || moves < parseInt(bestMoves)) {
    localStorage.setItem("memoryBestMoves", moves);
    document.getElementById("best-moves").innerHTML = moves;
    bestMoves = moves;
  }
}

function restartGame() {
  initGame();
}

function goHome() {
  location.href = "../../index.html";
}

// Бет жүктелгенде ойынды бастау
window.onload = initGame;