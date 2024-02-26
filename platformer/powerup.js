// Power-up properties
const powerUp = {
  x: 0,
  y: 0,
  width: 35, // Size similar to the coin for consistency
  height: 35,
  isVisible: false,
  effectDuration: 8000, // 8 seconds in milliseconds
  speedBoost: 3.5, // The increased speed when the power-up is collected
}

// Power-up image
const powerUpImage = new Image()
powerUpImage.src = 'powerup.png' // Replace with the path to your power-up image


function randomizeCoinPosition() {
  let validCoinPosition = false
  let attempts = 0
  const maxAttempts = 1000
  const coinArea = {
    width: coin.width + 2 * coinBufferMargin,
    height: coin.height + 2 * coinBufferMargin,
  }

  while (!validCoinPosition && attempts < maxAttempts) {
    // Generate random position considering coin size plus buffer
    let coinX =
      Math.random() * (canvas.width - coinArea.width) + coinBufferMargin
    let coinY =
      Math.random() * (canvas.height - coinArea.height) + coinBufferMargin

    // Check for obstacle collision
    let collisionDetected = false
    for (let obstacle of obstacles) {
      if (
        coinX < obstacle.x + obstacle.width &&
        coinX + coinArea.width > obstacle.x &&
        coinY < obstacle.y + obstacle.height &&
        coinY + coinArea.height > obstacle.y
      ) {
        collisionDetected = true
        break // No need to check other obstacles if collision is detected
      }
    }

    // If no collision is detected, the position is valid
    if (!collisionDetected) {
      validCoinPosition = true
      coin.x = coinX
      coin.y = coinY
    }
    attempts++
  }

  if (attempts >= maxAttempts) {
    console.error(
      'Failed to place the coin in a valid position after many attempts.'
    )
  }
}