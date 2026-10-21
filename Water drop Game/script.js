
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress");
const progressTrack = document.querySelector(".progress-track");
const progressLabel = document.getElementById("progress-label");
const timerStat = document.getElementById("timer-stat");

const gameArea = document.getElementById("game-area");
const welcome = document.getElementById("welcome");
const gameMessage = document.getElementById("game-message");
const confetti = document.getElementById("confetti");

const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");

const WIN_SCORE = 100;
const GAME_TIME = 30;
const DROP_POINTS = 10;

let score = 0;
let timeLeft = GAME_TIME;
let playing = false;
let timerInterval = null;
let dropInterval = null;
let drops = [];

// Update score and progress bar
function updateScore() {
  scoreDisplay.textContent = score;

  const progress = Math.min((score / WIN_SCORE) * 100, 100);
  progressBar.style.width = progress + "%";
  progressTrack.setAttribute("aria-valuenow", progress);
  progressLabel.textContent = `${score} / ${WIN_SCORE}`;
}

// Remove all drops from the game area
function removeDrops() {
  drops.forEach(drop => drop.remove());
  drops = [];
}

// Create a clickable water drop
function createDrop() {
  if (!playing || drops.length >= 7) return;

  const drop = document.createElement("button");

  drop.className = "drop";
  drop.textContent = "💧";
  drop.type = "button";
  drop.setAttribute("aria-label", "Collect water drop for 10 points");

  const maxX = Math.max(0, gameArea.clientWidth - 65);
  const maxY = Math.max(0, gameArea.clientHeight - 75);

  drop.style.left = Math.random() * maxX + "px";
  drop.style.top = (45 + Math.random() *
    Math.max(0, maxY - 45)) + "px";

  drop.addEventListener("click", () => {
    if (!playing) return;

    score += DROP_POINTS;
    updateScore();

    gameMessage.textContent = "+10 points! Great job!";

    drop.remove();
    drops = drops.filter(item => item !== drop);

    if (score >= WIN_SCORE) {
      winGame();
    }
  });

  gameArea.appendChild(drop);
  drops.push(drop);
}

// Start the game
function startGame() {
  if (playing) return;

  clearInterval(timerInterval);
  clearInterval(dropInterval);
  removeDrops();
  clearConfetti();

  score = 0;
  timeLeft = GAME_TIME;
  playing = true;

  updateScore();
  timerDisplay.textContent = timeLeft;
  timerStat.classList.remove("is-urgent");

  welcome.classList.add("hidden");
  gameMessage.textContent = "Collect as many drops as you can!";

  createDrop();

  dropInterval = setInterval(createDrop, 700);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerStat.classList.add("is-urgent");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Win condition
function winGame() {
  if (!playing) return;

  playing = false;
  stopIntervals();
  removeDrops();
  timerStat.classList.remove("is-urgent");

  gameMessage.textContent = "🎉 YOU WIN! Amazing job! 🎉";

  welcome.classList.remove("hidden");
  welcome.innerHTML = `
    <span class="welcome-icon">🏆💧</span>
    <h2>You Saved Every Drop!</h2>
    <p>You reached ${score} points!</p>
    <p>Thank you for protecting water.</p>
    <button id="play-again" class="button primary">
      Play Again
    </button>
  `;

  document.getElementById("play-again")
    .addEventListener("click", startGame);

  celebrate();
}

// End the game if time runs out
function endGame() {
  if (!playing) return;

  playing = false;
  stopIntervals();
  removeDrops();
  timerStat.classList.remove("is-urgent");

  gameMessage.textContent = "⏰ Time is up!";

  welcome.classList.remove("hidden");
  welcome.innerHTML = `
    <span class="welcome-icon">💧</span>
    <h2>Game Over!</h2>
    <p>Your final score is ${score} points.</p>
    <p>${score >= WIN_SCORE
      ? "Amazing work!"
      : "Try again to reach 100 points!"}</p>
    <button id="play-again" class="button primary">
      Play Again
    </button>
  `;

  document.getElementById("play-again")
    .addEventListener("click", startGame);
}

// Stop all running game timers
function stopIntervals() {
  clearInterval(timerInterval);
  clearInterval(dropInterval);

  timerInterval = null;
  dropInterval = null;
}

// Create the confetti celebration
function celebrate() {
  clearConfetti();

  const confettiColors = [
    "#087fc1",
    "#00b4d8",
    "#90e0ef",
    "#ffb703",
    "#2a9d8f"
  ];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background =
      confettiColors[
        Math.floor(Math.random() * confettiColors.length)
      ];

    piece.style.animationDelay = Math.random() * 1.2 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    confetti.appendChild(piece);
  }

  setTimeout(clearConfetti, 4000);
}

// Remove confetti
function clearConfetti() {
  confetti.innerHTML = "";
}

// Reset the game to its original state
function resetGame() {
  playing = false;

  stopIntervals();
  removeDrops();
  clearConfetti();

  score = 0;
  timeLeft = GAME_TIME;
  timerStat.classList.remove("is-urgent");

  updateScore();
  timerDisplay.textContent = timeLeft;

  gameMessage.textContent = "";

  welcome.innerHTML = `
    <span class="welcome-icon">💧</span>
    <h2>Ready to Play?</h2>
    <p>Collect 10 water drops to win!</p>
    <button id="start-btn" class="button primary">
      Start Game
    </button>
  `;

  welcome.classList.remove("hidden");

  document.getElementById("start-btn")
    .addEventListener("click", startGame);
}

// Connect buttons to game functions
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
