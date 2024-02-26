'use strict';
// dom references
const message = document.querySelector('.message');
const scoreDisplay = document.querySelector('.score');
const highScoreDisplay = document.querySelector('.highscore');
const userGuess = document.querySelector('.guess');
const checkButton = document.querySelector('.btn.check');
const restartButton = document.querySelector('.btn.again');

// game state variables
let correctNumber = generateRandomNumber();
let score = 20;
let highScore = 0;

// initialize game for user
updateScoreDisplay();
highScoreDisplay.innerText = highScore;
userGuess.value = '';
restartButton.disabled = true;

function generateRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

function checkGuess() {
  // Directly read the number value; empty or invalid input becomes NaN
  const guess = Number(userGuess.value);

  // Check if the guess is within the valid range
  if (guess < 1 || guess > 20) {
    message.innerText = 'Please select a valid number between 1-20';
    return;
  }

  // Compare guess with the correct number
  if (guess === correctNumber) {
    handleCorrectGuess();
  } else {
    handleIncorrectGuess(guess);
  }
  userGuess.value = ''; // Clear input field
}

function restartGame() {
  score = 20;
  correctNumber = generateRandomNumber();
  message.innerText = 'New game started! Guess a number.';
  updateScoreDisplay();
  userGuess.disabled = false;
  restartButton.disabled = true;
  checkButton.disabled = true;
}

function endGame() {
  userGuess.disabled = true;
  restartButton.disabled = false;
  checkButton.disabled = true;
}

function updateScoreDisplay() {
  scoreDisplay.innerText = score;
}

// Event listeners
checkButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', restartGame);
userGuess.addEventListener('input', () => {
  // enable the check button if there's input
  checkButton.disabled = !userGuess.value;
});
