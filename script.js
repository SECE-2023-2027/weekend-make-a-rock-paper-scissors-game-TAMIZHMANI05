// Game state
const state = {
  scores: {
    player: 0,
    computer: 0,
  },
  choices: ["rock", "paper", "scissors"],
  soundEnabled: true,
  isDarkTheme: true,
};

// DOM Elements
const elements = {
  playerScore: document.getElementById("playerScore"),
  computerScore: document.getElementById("computerScore"),
  resultMessage: document.getElementById("resultMessage"),
  gameTip: document.getElementById("gameTip"),
  playerChoiceDisplay: document.getElementById("playerChoiceDisplay"),
  computerChoiceDisplay: document.getElementById("computerChoiceDisplay"),
  choiceButtons: document.querySelectorAll(".choice-btn"),
  playAgain: document.getElementById("playAgain"),
  resetScore: document.getElementById("resetScore"),
  toggleSound: document.getElementById("toggleSound"),
  toggleTheme: document.getElementById("toggleTheme"),
};

// Sound Effects
const sounds = {
  click: new Audio("assets/click.mp3"),
  win: new Audio("assets/win.mp3"),
  lose: new Audio("assets/lose.mp3"),
  draw: new Audio("assets/draw.mp3"),
};

// Game Tips
const gameTips = {
  rock: {
    paper: "Paper covers Rock!",
    scissors: "Rock smashes Scissors!",
  },
  paper: {
    rock: "Paper covers Rock!",
    scissors: "Scissors cut Paper!",
  },
  scissors: {
    rock: "Rock smashes Scissors!",
    paper: "Scissors cut Paper!",
  },
};

// Initialize game
function initGame() {
  loadGameState();
  updateScoreDisplay();
  addEventListeners();
}

// Event Listeners
function addEventListeners() {
  elements.choiceButtons.forEach((button) => {
    button.addEventListener("click", () =>
      handlePlayerChoice(button.dataset.choice)
    );
  });

  elements.playAgain.addEventListener("click", resetRound);
  elements.resetScore.addEventListener("click", resetGame);
  elements.toggleSound.addEventListener("click", toggleSound);
  elements.toggleTheme.addEventListener("click", toggleTheme);
}

// Handle player choice
function handlePlayerChoice(playerChoice) {
  playSound("click");

  const computerChoice = getComputerChoice();

  // Display choices
  displayChoice("player", playerChoice);

  // Animate computer choice
  elements.resultMessage.textContent = "3...";
  setTimeout(() => {
    elements.resultMessage.textContent = "2...";
    setTimeout(() => {
      elements.resultMessage.textContent = "1...";
      setTimeout(() => {
        displayChoice("computer", computerChoice);
        const result = determineWinner(playerChoice, computerChoice);
        updateGame(result, playerChoice, computerChoice);
      }, 500);
    }, 500);
  }, 500);
}

// Get computer choice
function getComputerChoice() {
  return state.choices[Math.floor(Math.random() * state.choices.length)];
}

// Display choice
function displayChoice(player, choice) {
  const display =
    player === "player"
      ? elements.playerChoiceDisplay
      : elements.computerChoiceDisplay;
  display.innerHTML = `<img src="assets/${choice}.png" alt="${choice}" class="choice-icon">`;
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";

  const wins = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  return wins[playerChoice] === computerChoice ? "win" : "lose";
}

// Update game
function updateGame(result, playerChoice, computerChoice) {
  // Update score
  if (result === "win") {
    state.scores.player++;
    playSound("win");
    elements.playerChoiceDisplay.classList.add("winning");
  } else if (result === "lose") {
    state.scores.computer++;
    playSound("lose");
    elements.computerChoiceDisplay.classList.add("winning");
  } else {
    playSound("draw");
  }

  // Update displays
  updateScoreDisplay();
  displayResult(result);
  displayGameTip(playerChoice, computerChoice);
  saveGameState();

  // Remove winning animation
  setTimeout(() => {
    elements.playerChoiceDisplay.classList.remove("winning");
    elements.computerChoiceDisplay.classList.remove("winning");
  }, 1000);
}

// Display result
function displayResult(result) {
  const messages = {
    win: "🎉 You Win! 🎉",
    lose: "😔 You Lose! 😔",
    draw: "🤝 It's a Draw! 🤝",
  };

  elements.resultMessage.textContent = messages[result];
}

// Display game tip
function displayGameTip(playerChoice, computerChoice) {
  if (gameTips[playerChoice] && gameTips[playerChoice][computerChoice]) {
    elements.gameTip.textContent = gameTips[playerChoice][computerChoice];
  } else if (
    gameTips[computerChoice] &&
    gameTips[computerChoice][playerChoice]
  ) {
    elements.gameTip.textContent = gameTips[computerChoice][playerChoice];
  } else {
    elements.gameTip.textContent = "";
  }
}

// Update score display
function updateScoreDisplay() {
  elements.playerScore.textContent = state.scores.player;
  elements.computerScore.textContent = state.scores.computer;
}

// Reset round
function resetRound() {
  playSound("click");
  elements.playerChoiceDisplay.innerHTML = "";
  elements.computerChoiceDisplay.innerHTML = "";
  elements.resultMessage.textContent = "Choose your weapon!";
  elements.gameTip.textContent = "";
}

// Reset game
function resetGame() {
  playSound("click");
  state.scores.player = 0;
  state.scores.computer = 0;
  updateScoreDisplay();
  resetRound();
  saveGameState();
}

// Sound control
function playSound(soundName) {
  if (state.soundEnabled && sounds[soundName]) {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play().catch(() => {});
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  elements.toggleSound.textContent = state.soundEnabled ? "🔊" : "🔇";
  saveGameState();
}

// Theme control
function toggleTheme() {
  state.isDarkTheme = !state.isDarkTheme;
  document.body.dataset.theme = state.isDarkTheme ? "dark" : "light";
  elements.toggleTheme.textContent = state.isDarkTheme ? "🌙" : "☀️";
  saveGameState();
}

// Local Storage
function saveGameState() {
  const gameState = {
    scores: state.scores,
    soundEnabled: state.soundEnabled,
    isDarkTheme: state.isDarkTheme,
  };
  localStorage.setItem("rpsGameState", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("rpsGameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    state.scores = gameState.scores;
    state.soundEnabled = gameState.soundEnabled;
    state.isDarkTheme = gameState.isDarkTheme;

    // Update UI to match loaded state
    elements.toggleSound.textContent = state.soundEnabled ? "🔊" : "🔇";
    elements.toggleTheme.textContent = state.isDarkTheme ? "🌙" : "☀️";
    document.body.dataset.theme = state.isDarkTheme ? "dark" : "light";
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", initGame);
