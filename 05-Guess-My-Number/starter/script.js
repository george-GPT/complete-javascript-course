'use strict';

// DOM references
const message = document.querySelector('.message');
const scoreDisplay = document.querySelector('.score');
const highScoreDisplay = document.querySelector('.highscore');
const userGuess = document.querySelector('.guess');
const checkButton = document.querySelector('.btn.check');
const restartButton = document.querySelector('.btn.again');

// Initialize global variables (game logic)
let correctNumber = generateRandomNumber();
let score = 20;
let highScore = 0;

// Initialize global variables (user interface)
updateScoreDisplay();
scoreDisplay.innerText = score; // Use the variable score for initialization
highScoreDisplay.innerText = highScore; // Initialize with highScore variable
userGuess.value = ''; // Use value for input elements
restartButton.disabled = true;

// Function to generate CPU number
function generateRandomNumber() {
  return Math.floor(Math.random() * 20) + 1; // Add return statement
}

// Function to check user guess with CPU number
function checkGuess() {
  const guess = Number(userGuess.value);
  if (guess < 1 || guess > 20) {
    message.innerText = 'Please enter a valid number from 1-20.';
  } else if (guess === correctNumber) {
    message.innerText = 'Correct!'; // Add a success message
    endGame();
  } else {
    message.innerText = guess > correctNumber ? 'Too high!' : 'Too low!';
    score -= 1;
    updateScoreDisplay();
  }
}

function updateScoreDisplay() {
  scoreDisplay.innerText = score;
}

function restartGame() {
  correctNumber = generateRandomNumber();
  score = 20;
  updateScoreDisplay(); // Use the function to update the score display
  userGuess.value = ''; // Clear the input field
  userGuess.disabled = false;
  checkButton.disabled = true; // Disable check button until input is entered
  restartButton.disabled = true;
  message.innerText = 'Start guessing...'; // Reset message
}

function endGame() {
  userGuess.disabled = true;
  restartButton.disabled = false;
  if (score > highScore) {
    highScore = score; // Update highScore variable
    highScoreDisplay.innerText = highScore; // Update display
  }
}

checkButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', restartGame);
userGuess.addEventListener('input', function () {
  checkButton.disabled = userGuess.value === ''; // Simplified logic for disabling/enabling check button
});
