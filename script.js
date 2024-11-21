// Seletores
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const restartButton = document.getElementById("restart-button");
const difficultyButtons = document.querySelectorAll(".difficulty");

// Variáveis do jogo
let moves = 0;
let time = 0;
let timer = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let rows = 0;
let cols = 0;

// Emojis para as cartas
const emojis = ["🍎", "🍌", "🍇", "🍒", "🍓", "🥝", "🍍", "🍑", "🍉", "🍋", "🥭", "🥥", "🥬", "🍆", "🥔", "🍠", "🍖", "🍗", "🦄", "🐼", "🐸", "🐶"];

// Função para iniciar o jogo com base na dificuldade
function startGame(size) {
  [rows, cols] = size.split("x").map(Number);
  const totalCards = rows * cols;
  const gameEmojis = emojis.slice(0, totalCards / 2).flatMap((emoji) => [emoji, emoji]);

  // Resetando as variáveis do jogo
  moves = 0;
  time = 0;
  matchesFound = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  movesDisplay.textContent = moves;
  timeDisplay.textContent = time;
  restartButton.classList.add("hidden");
  clearInterval(timer);

  // Configurando o cronômetro
  timer = setInterval(() => {
    time++;
    timeDisplay.textContent = time;
  }, 1000);

  // Embaralhar e criar cartas
  const shuffledCards = shuffle(gameEmojis);
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameBoard.innerHTML = ""; // Limpa o tabuleiro

  shuffledCards.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    const cardContent = document.createElement("span");
    cardContent.textContent = symbol;
    cardContent.style.visibility = "hidden";

    card.appendChild(cardContent);
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  // Exibir a tela do jogo e esconder a tela inicial
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
}

// Função para embaralhar as cartas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Função para virar as cartas
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  this.children[0].style.visibility = "visible";

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  movesDisplay.textContent = moves;

  checkMatch();
}

// Verifica se as cartas combinam
function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    disableCards();
    matchesFound++;
    if (matchesFound === (rows * cols) / 2) {
      endGame();
    }
  } else {
    unflipCards();
  }
}

// Desabilita as cartas
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Desvira as cartas
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    firstCard.children[0].style.visibility = "hidden";
    secondCard.classList.remove("flipped");
    secondCard.children[0].style.visibility = "hidden";
    resetBoard();
  }, 1000);
}

// Reseta o estado do tabuleiro
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Fim do jogo
function endGame() {
  clearInterval(timer);
  alert(`Parabéns! Você completou o jogo em ${moves} jogadas e ${time} segundos.`);
  restartButton.classList.remove("hidden");
}

// Evento do botão de reinício
restartButton.addEventListener("click", () => startGame(`${rows}x${cols}`));

// Eventos dos botões de dificuldade
difficultyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    startGame(e.target.dataset.size);
  });
});
