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

// Reproducir sonido de disparo
const shootSound = new Audio('sonido.mp3');

// Crear enemigos
function createEnemies() {
  for (let i = 0; i < totalEnemies; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${i * 40 + 20}px`;
    enemy.style.top = '20px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
  }
}

// Mover jugador
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

// Disparo del jugador
function shootBullet() {
  shootSound.currentTime = 0;
  shootSound.play();

  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerPosition + 15}px`;
  bullet.style.top = '360px';
  gameContainer.appendChild(bullet);
  playerBullets.push(bullet);
}

// Movimiento de balas del jugador
function movePlayerBullets() {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const bullet = playerBullets[i];
    let top = parseInt(bullet.style.top);
    bullet.style.top = `${top - 10}px`;

    // Colisión con enemigo
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (
        Math.abs(parseInt(enemy.style.left) - parseInt(bullet.style.left)) < 20 &&
        Math.abs(parseInt(enemy.style.top) - top) < 20
      ) {
        gameContainer.removeChild(enemy);
        gameContainer.removeChild(bullet);
        enemies.splice(j, 1);
        playerBullets.splice(i, 1);
        score += 10;
        enemiesRemaining--;
        checkVictory();
        break;
      }
    }

    // Eliminar bala fuera del campo
    if (top < 0 && bullet.parentNode) {
      gameContainer.removeChild(bullet);
      playerBullets.splice(i, 1);
    }
  }
}

// Movimiento de balas enemigas
function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    let top = parseInt(bullet.style.top);
    bullet.style.top = `${top + 5}px`;

    // Colisión con el jugador
    if (
      Math.abs(parseInt(bullet.style.left) - playerPosition - 15) < 20 &&
      Math.abs(top - 360) < 20
    ) {
      gameContainer.removeChild(bullet);
      enemyBullets.splice(i, 1);
      lives--;
      checkDefeat();
      continue;
    }

    // Eliminar bala fuera del campo
    if (top > 400 && bullet.parentNode) {
      gameContainer.removeChild(bullet);
      enemyBullets.splice(i, 1);
    }
  }
}

// Disparos aleatorios de enemigos
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

// Comprobar victoria
function checkVictory() {
  if (enemiesRemaining === 0) {
    endGame(`¡Victoria! Puntuación: ${score}`);
  }
}

// Comprobar derrota
function checkDefeat() {
  if (lives <= 0) {
    endGame(`Derrota. Puntuación: ${score}`);
  }
}

// Terminar juego
function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(enemyFireInterval);
  gameRunning = false;
  alert(message);
  window.location.reload();
}

// Iniciar juego
function startGame() {
  startButton.style.display = 'none';
  gameRunning = true;
  playerPosition = 180;
  player.style.left = `${playerPosition}px`;
  score = 0;
  lives = 3;
  enemies = [];
  enemyBullets = [];
  playerBullets = [];
  enemiesRemaining = totalEnemies;

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
