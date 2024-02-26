const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const coinSound = new Audio();
coinSound.src = 'bubble.mp3';
coinSound.preload = 'auto'; // Preload the sound file
const backgroundMusic = new Audio();
backgroundMusic.src = 'pokemon.mp3'; // Load background music
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.15; // Set volume to 70%
const textureImage = new Image();
textureImage.src = 'wall.jpg';
const obstacles = [];
// Define a buffer margin around the coin for safer positioning
const coinBufferMargin = 10; // Increase this value as needed
let scoreFontSize = 20; // Normal font size
let isScoreAnimating = false;
let scoreAnimationDuration = 0.5; // Duration in seconds
let scoreAnimationTime = 0;
let popupClosed = false;
let speedBoost = {
  x: 0,
  y: 0,
  width: 35,
  height: 35,
  isActive: false, // Determines if the speed boost is active and visible
  isCollected: false, // Determines if the speed boost has been collected
};

function playCoinSound() {
  coinSound.currentTime = 0; // Reset sound to the beginning to allow repeated play
  coinSound.play();
}

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Define initial player speed
const initialPlayerSpeed = 1.25;

// Function to calculate vertical difference between game canvas and visible screen
const verticalDifference = (canvas.height - window.innerHeight) / 2;

// Define a grid for obstacle placement to ensure even distribution
const gridRows = 5; // Number of rows in the grid
const gridColumns = 6; // Number of columns in the grid
const gridCellWidth = canvas.width / gridColumns;
const gridCellHeight = canvas.height / gridRows;
const minObstacleMargin = 20; // Minimum margin from cell edges

function generateObstacles() {
  // Clear any existing obstacles
  obstacles.length = 0;

  // Define static obstacles
  // Example layout: [x, y, width, height]
  const staticObstacles = [
    [50, 100, 100, 30],
    [200, 200, 150, 30],
    [400, 300, 200, 30],
    [600, 100, 100, 30],
    [150, 450, 150, 30],
    [350, 550, 200, 30],
    [550, 400, 100, 30],
  ];

  // Loop through the defined obstacles and add them to the obstacles array
  staticObstacles.forEach((obstacle) => {
    obstacles.push({
      x: obstacle[0],
      y: obstacle[1],
      width: obstacle[2],
      height: obstacle[3],
    });
  });
}

// Call generateObstacles() here to ensure it's done once and the obstacles layout is static
generateObstacles();

// Function to draw obstacles on the canvas
function drawObstacles() {
  // Create pattern from texture image
  const texturePattern = ctx.createPattern(textureImage, 'repeat');

  obstacles.forEach((obstacle) => {
    // Set pattern as fill style
    ctx.fillStyle = texturePattern;

    // Draw obstacle shape
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Call generateObstacles function at the start of the game
generateObstacles();

// Load player image
const playerImage = new Image();
playerImage.src = 'raccoon.png'; // Adjust the path to match where your image is located

const coinImage = new Image();
coinImage.src = 'coin.png'; // Adjust the path to match where your image is located

// New game state variables
let gameRunning = false;
let timeLeft = 30; // 30 seconds to play the game
let gameTimer;
let highScore = 0;

// Start Game button element
const startButton = document.createElement('button');
startButton.textContent = 'Play Again';
startButton.style.position = 'absolute';
startButton.onclick = startGame;
document.body.appendChild(startButton);

function randomizeCoinPosition() {
  let validCoinPosition = false;
  const maxAttempts = 1000;
  let attempts = 0;

  while (!validCoinPosition && attempts < maxAttempts) {
    // Generate random position considering coin size plus buffer
    coin.x =
      Math.random() * (canvas.width - coin.width - 2 * coinBufferMargin) +
      coinBufferMargin;
    coin.y =
      Math.random() * (canvas.height - coin.height - 2 * coinBufferMargin) +
      coinBufferMargin;

    // Check if the coin's adjusted position (with buffer) overlaps with any obstacles
    validCoinPosition = !checkCollisionWithObstacles(
      coin.x - coinBufferMargin,
      coin.y - coinBufferMargin,
      coin.width + 2 * coinBufferMargin,
      coin.height + 2 * coinBufferMargin
    );

    attempts++;
  }

  if (attempts >= maxAttempts) {
    console.error(
      'Failed to place the coin in a valid position after many attempts.'
    );
  }
}

function checkCollisionWithObstacles(x, y, width, height) {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    if (
      x < obstacle.x + obstacle.width &&
      x + width > obstacle.x &&
      y < obstacle.y + obstacle.height &&
      y + height > obstacle.y
    ) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}

// Ensure the position is within the canvas
function isWithinCanvas(x, y, width, height) {
  return (
    x >= 0 && y >= 0 && x + width <= canvas.width && y + height <= canvas.height
  );
}

function startGame() {
  if (!popupClosed) {
    return; // Exit the function if the popup is still visible
  }
  playBackgroundMusic();
  gameRunning = true;
  timeLeft = 25; // Reset time left
  score = 0; // Reset score
  player.speed = initialPlayerSpeed; // Set player speed to initialPlayerSpeed
  startButton.style.display = 'none'; // Ensure the button is hidden when the game starts

  // Randomize player position safely away from obstacles
  let validPlayerPosition = false;
  const maxPlayerAttempts = 1000;
  let playerAttempts = 0;

  while (!validPlayerPosition && playerAttempts < maxPlayerAttempts) {
    player.x = Math.random() * (canvas.width - player.width);
    player.y = Math.random() * (canvas.height - player.height);

    if (
      !checkCollisionWithObstacles(
        player.x,
        player.y,
        player.width,
        player.height
      )
    ) {
      validPlayerPosition = true;
    }
    playerAttempts++;
  }

  if (playerAttempts >= maxPlayerAttempts) {
    console.error(
      'Failed to place the player in a valid position after many attempts.'
    );
  }

  // Randomize coin position safely away from obstacles
  randomizeCoinPosition();

  // Start the game timer
  gameTimer = setInterval(function () {
    timeLeft--;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Call game loop
  gameLoop();
}

function randomizeCoinPosition() {
  let validCoinPosition = false;
  const maxCoinAttempts = 1000;
  let coinAttempts = 0;

  while (!validCoinPosition && coinAttempts < maxCoinAttempts) {
    // Generate random position for the coin
    const randomX = Math.random() * (canvas.width - coin.width);
    const randomY = Math.random() * (canvas.height - coin.height);

    // Check if the coin's position overlaps with any obstacles
    const coinCollidesWithObstacles = obstacles.some((obstacle) => {
      return (
        randomX < obstacle.x + obstacle.width &&
        randomX + coin.width > obstacle.x &&
        randomY < obstacle.y + obstacle.height &&
        randomY + coin.height > obstacle.y
      );
    });

    if (!coinCollidesWithObstacles) {
      // If the coin doesn't collide with any obstacles, it's a valid position
      coin.x = randomX;
      coin.y = randomY;
      validCoinPosition = true;
    }

    coinAttempts++;
  }

  if (!validCoinPosition) {
    console.error(
      'Failed to place the coin in a valid position after many attempts.'
    );
  }
}
// Ensure to have your `checkCollisionWithObstacles` function defined as before to use it here.

function endGame() {
  stopBackgroundMusic();
  gameRunning = false;
  clearInterval(gameTimer); // Stop the game timer
  highScore = Math.max(highScore, score); // Update high score if current score is greater

  // Create and style the popup
  const popup = document.createElement('div');
  popup.className = 'popup';

  const heading = document.createElement('h2');
  heading.textContent = 'Time is Up!';
  heading.style.color = '#ff00ff'; // Match the specified style

  const scoreText = document.createElement('p');
  scoreText.textContent = `Rojee collected ${score} treats!`;

  const highScoreText = document.createElement('p');
  highScoreText.textContent = `High Score: ${highScore}`;

  // Update the button text and onclick event
  const playAgainButton = document.createElement('button');
  playAgainButton.textContent = 'Play Again'; // Set the button text
  playAgainButton.style.display = 'hidden';
  playAgainButton.onclick = function () {
    document.body.removeChild(popup);
    popupClosed = true; // Update the variable to indicate the popup is closed
    startGame(); // Restart the game
  };

  // Append elements to the popup
  popup.appendChild(heading);
  popup.appendChild(scoreText);
  popup.appendChild(highScoreText);
  popup.appendChild(playAgainButton);

  // Append the popup to the document body
  document.body.appendChild(popup);
}

function drawTimer() {
  ctx.font = '24px Georgia'; // Use a cozy font
  ctx.fillStyle = '#FFD700'; // A cozy gold color for the text
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 3;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Soft shadow for depth
  ctx.fillText('Time: ' + timeLeft, canvas.width - 150, 35); // Adjusted position and padding
  // Reset shadow for other elements to not get affected
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

// Player properties
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 45, // Adjust based on your image's size
  height: 45,
  speed: 1.25, // Adjust speed for control
  dx: 0,
  dy: 0,
};

// Coin properties
const coin = {
  x: Math.random() * (canvas.width - 35),
  y: Math.random() * (canvas.height - 35),
  width: 35,
  height: 35,
  isVisible: true,
};

// Score
let score = 0;

function drawCoin() {
  if (coin.isVisible) {
    // Simplified glow effect
    ctx.shadowBlur = 10; // Reduced blur radius for better performance
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'; // Gold-yellow glow to match a typical coin color

    // Draw the coin image with a simplified glow effect
    ctx.drawImage(coinImage, coin.x, coin.y, coin.width, coin.height);

    // Reset shadow properties to avoid affecting other drawings
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }
}

function drawScore() {
  ctx.font = '24px Georgia'; // Matching font for consistency
  ctx.fillStyle = '#FFA07A'; // Light salmon color for a gentle, fun vibe
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 3;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Consistent shadow styling
  ctx.fillText('Treats Secured: ' + score, canvas.width - 450, 35); // Provide more room for text
  // Reset shadow after drawing
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

/// Array to track which keys are currently pressed
const keysPressed = {};

// Inside handleKeydown and handleKeyup, adjust the player's dx and dy directly.
// Example modification for handleKeydown:
function handleKeydown(e) {
  keysPressed[e.key] = true;

  player.dx = 0; // Reset dx and dy to prevent unintended speed accumulation
  player.dy = 0;

  if (keysPressed['ArrowRight'] || keysPressed['d'])
    player.dx = initialPlayerSpeed;
  if (keysPressed['ArrowLeft'] || keysPressed['a'])
    player.dx = -initialPlayerSpeed;
  if (keysPressed['ArrowUp'] || keysPressed['w'])
    player.dy = -initialPlayerSpeed;
  if (keysPressed['ArrowDown'] || keysPressed['s'])
    player.dy = initialPlayerSpeed;
}

// Example adjustment for handleKeyup:
function handleKeyup(e) {
  keysPressed[e.key] = false;

  // If the key released corresponds to the current movement direction, stop the movement
  if ((e.key === 'ArrowRight' || e.key === 'd') && player.dx > 0) player.dx = 0;
  if ((e.key === 'ArrowLeft' || e.key === 'a') && player.dx < 0) player.dx = 0;
  if ((e.key === 'ArrowUp' || e.key === 'w') && player.dy < 0) player.dy = 0;
  if ((e.key === 'ArrowDown' || e.key === 's') && player.dy > 0) player.dy = 0;
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// Function to close the popup and start the game
function closePopup() {
  var popup = document.getElementById('popup');
  popup.style.display = 'none';
  popupClosed = true; // Update the variable to indicate the popup is closed
  startGame(); // Start the game
}

function update() {
  // Attempt horizontal movement
  let horizontalCollision = checkCollisionWithObstacles(
    player.x + player.dx,
    player.y,
    player.width,
    player.height
  );

  if (!horizontalCollision) {
    player.x += player.dx;
  }

  // Attempt vertical movement
  let verticalCollision = checkCollisionWithObstacles(
    player.x,
    player.y + player.dy,
    player.width,
    player.height
  );

  if (!verticalCollision) {
    player.y += player.dy;
  }

  enforceCanvasBounds();
}

function enforceCanvasBounds() {
  // Adjust the boundary checks to account for the size of the player
  const rightBound = canvas.width - player.width;
  const bottomBound = canvas.height - player.height;

  // Ensure player doesn't move off-screen
  player.x = Math.max(0, Math.min(rightBound, player.x));
  player.y = Math.max(0, Math.min(bottomBound, player.y));
}

function playBackgroundMusic() {
  backgroundMusic.currentTime = 0; // Reset music to the beginning
  backgroundMusic.play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
}

// Draw player with image
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Clear canvas
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollision() {
  if (
    player.x < coin.x + coin.width &&
    player.x + player.width > coin.x &&
    player.y < coin.y + coin.height &&
    player.y + player.height > coin.y &&
    coin.isVisible
  ) {
    playCoinSound();
    // Reset coin position within the canvas, ensuring it doesn't spawn off-screen
    const rightBound = canvas.width - coin.width;
    const bottomBound = canvas.height - coin.height;

    coin.x = Math.random() * rightBound;
    coin.y = Math.random() * bottomBound;
    score += 1; // Increase score by 1 for each coin collected
  }
}

// Updated game loop
function gameLoop() {
  if (gameRunning) {
    clear();
    update();
    checkCollision();
    drawPlayer();
    drawCoin();
    drawObstacles(); // Draw obstacles
    drawScore();
    drawTimer(); // Draw updated timer

    // Check for obstacle collision inside the game loop
    obstacles.forEach((obstacle) => {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        // Player collided with obstacle, stop player movement
        player.dx = 0;
        player.dy = 0;
        // You can add more actions here, like decreasing player health or displaying a message
      }
    });

    requestAnimationFrame(gameLoop);

    // Check if time is up
    if (timeLeft <= 0) {
      endGame();
    }
  }
}

// Start the game loop once the player image has loaded
playerImage.onload = function () {
  gameLoop();
};

// Call startGame to initially load the game
startGame();
