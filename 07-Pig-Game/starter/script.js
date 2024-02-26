'use strict';
// dom elements
const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');
const scoreDisplay0 = document.getElementById('score--0');
const scoreDisplay1 = document.getElementById('score--1');
const currentScore0 = document.getElementById('current--0');
const currentScore1 = document.getElementById('current--1');
// Corrected the selector here. If dice is a class, use '.dice'
const diceElement = document.querySelector('.dice');
const newGame = document.querySelector('.btn--new');
const rollDice = document.querySelector('.btn--roll');
const holdButton = document.querySelector('.btn--hold');

// initialize game logic & UI
scoreDisplay0.textContent = 0;
scoreDisplay1.textContent = 0;
currentScore0.textContent = 0;
currentScore1.textContent = 0;
diceElement.classList.add('hidden');
let currentScore = 0;
let activePlayer = 0;
let scores = [0, 0]; // Changed to let to allow reassignment
let gameActive = true; // Changed to match the variable used in userDiceRoll
newGame.style.display = 'none';

function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0Element.classList.toggle('player--active');
  player1Element.classList.toggle('player--active');
}

// function userDiceRoll
function userDiceRoll() {
  if (gameActive) {
    // Changed from playing to gameActive
    const dice = Math.floor(Math.random() * 6) + 1;
    diceElement.classList.remove('hidden');
    // Assuming you have images named dice-1.png through dice-6.png in the correct directory
    diceElement.src = `dice-${dice}.png`;
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
}

// function userHoldScore
function userHoldScore() {
  if (gameActive) {
    // Check if the game is active when trying to hold the score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer]; // Corrected to score-- from current--
    if (scores[activePlayer] >= 20) {
      gameActive = false;
      diceElement.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      newGame.style.display = 'block';
    } else {
      switchPlayer();
    }
  }
}

function newGameFunction() {
  scoreDisplay0.textContent = 0;
  scoreDisplay1.textContent = 0;
  currentScore0.textContent = 0;
  currentScore1.textContent = 0;
  diceElement.classList.add('hidden');
  currentScore = 0;
  activePlayer = 0;
  scores = [0, 0]; // Reset scores
  gameActive = true; // Reset gameActive
  player0Element.classList.remove('player--winner');
  player1Element.classList.remove('player--winner');
  player0Element.classList.add('player--active');
  player1Element.classList.remove('player--active'); // Ensure the active class is set correctly
  newGame.style.display = 'none';
}

// buttons
newGame.addEventListener('click', newGameFunction);
rollDice.addEventListener('click', userDiceRoll);
holdButton.addEventListener('click', userHoldScore);
