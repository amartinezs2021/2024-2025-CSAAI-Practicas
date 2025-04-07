const gameContainer = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');
const player = document.createElement('div');
player.classList.add('player');
gameContainer.appendChild(player);

let playerPosition = 180;
let enemies = [];
let enemyBullets = [];
let playerBullets = [];
let score = 0;
let lives = 3;
let gameInterval;
let enemyFireInterval;
let gameRunning = false;
const totalEnemies = 10;
let enemiesRemaining = totalEnemies;

const shootSound = new Audio('sonido.mp3');

function updateHUD() {
  document.getElementById('score').innerText = `Puntuación: ${score}`;
  document.getElementById('lives').innerText = `Vidas: ${lives}`;
}

function createEnemies() {
  for (let i = 0; i < totalEnemies; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${i * 60 + 20}px`;
    enemy.style.top = '100px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
  }
}

function movePlayer(event) {
  if (!gameRunning) return;

  if (event.key === 'ArrowLeft') {
    playerPosition = Math.max(0, playerPosition - 10);
  } else if (event.key === 'ArrowRight') {
    playerPosition = Math.min(360, playerPosition + 10);
  } else if (event.code === 'Space') {
    shootBullet();
  }
  player.style.left = `${playerPosition}px`;
}

function shootBullet() {
  shootSound.currentTime = 0;
  shootSound.play();

  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerPosition + 12}px`;
  bullet.style.top = '350px';
  gameContainer.appendChild(bullet);
  playerBullets.push(bullet);
}

function isColliding(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();

  return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.right < r2.left || r1.left > r2.right);
}

function movePlayerBullets() {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const bullet = playerBullets[i];
    let top = parseInt(bullet.style.top);
    bullet.style.top = `${top - 10}px`;

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (isColliding(bullet, enemy)) {
        gameContainer.removeChild(enemy);
        gameContainer.removeChild(bullet);
        enemies.splice(j, 1);
        playerBullets.splice(i, 1);
        score += 10;
        enemiesRemaining--;
        updateHUD();
        checkVictory();
        break;
      }
    }

    if (top < 0 && bullet.parentNode) {
      gameContainer.removeChild(bullet);
      playerBullets.splice(i, 1);
    }
  }
}

function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    let top = parseInt(bullet.style.top);
    bullet.style.top = `${top + 5}px`;

    if (
      Math.abs(parseInt(bullet.style.left) - playerPosition - 15) < 20 &&
      top > 340
    ) {
      gameContainer.removeChild(bullet);
      enemyBullets.splice(i, 1);
      lives--;
      updateHUD();
      checkDefeat();
      continue;
    }

    if (top > 400 && bullet.parentNode) {
      gameContainer.removeChild(bullet);
      enemyBullets.splice(i, 1);
    }
  }
}

function enemyShoot() {
  if (enemies.length === 0) return;
  const shooter = enemies[Math.floor(Math.random() * enemies.length)];
  const bullet = document.createElement('div');
  bullet.classList.add('enemyBullet');
  bullet.style.left = `${parseInt(shooter.style.left) + 10}px`;
  bullet.style.top = `${parseInt(shooter.style.top) + 20}px`;
  gameContainer.appendChild(bullet);
  enemyBullets.push(bullet);
}

function checkVictory() {
  if (enemiesRemaining === 0) {
    endGame(`¡Victoria! Puntuación: ${score}`);
  }
}

function checkDefeat() {
  if (lives <= 0) {
    endGame(`Derrota. Puntuación: ${score}`);
  }
}

function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(enemyFireInterval);
  gameRunning = false;
  alert(message);
  window.location.reload();
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  playerPosition = 180;
  player.style.left = `${playerPosition}px`;
  player.style.bottom = '20px';
  score = 0;
  lives = 3;
  enemies = [];
  enemyBullets = [];
  playerBullets = [];
  enemiesRemaining = totalEnemies;
  updateHUD();

  createEnemies();

  gameInterval = setInterval(() => {
    movePlayerBullets();
    moveEnemyBullets();
  }, 100);

  enemyFireInterval = setInterval(() => {
    enemyShoot();
  }, 800);
}

document.addEventListener('keydown', movePlayer);
startButton.addEventListener('click', startGame);

