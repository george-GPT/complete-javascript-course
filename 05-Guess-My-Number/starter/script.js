'use strict';
// dom references
document.querySelector('.between');
document.querySelector('.btn again');
document.querySelector('.number');
document.querySelector('.guess');
document.querySelector('.message');
document.querySelector('.label-score');
document.querySelector('.label-highscore');
document.querySelector('.highscore');

// user inputs a number, guessing what secret number is between 1-20
// after guessing, score goes down one and a response is printed with feedback
//

function computerNumber() {
  const correctNumber = Math.trunc(Math.random() * 20) + 1;
  return correctNumber;
}

function userGuess(correctNumber) {
  // declare variable to compare with cpu number
  // user input == number input
  // number input is valid
  // if number === computerNumber then game over, update score, update highscore, display start over button.
  // if number is greater than choice, display "too high"
  // if number is lower than choice, display, "too low"
  // after each guess, increment decreasing of score number
  // if score number = 0, game over screen, update score, display start over screen
}

function resetGame() {
  // reset all html input data except for highscore
}

// bonus: make the highscore persist
