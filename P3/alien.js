const gameContainer = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const player = document.createElement('div');
player.classList.add('player');
gameContainer.appendChild(player);

let playerPosition = 280;
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
const explosionSound = new Audio('explosion.mp3');;

function updateHUD() {
  document.getElementById('score').innerText = `Puntuación: ${score}`;
  document.getElementById('lives').innerText = `Vidas: ${lives}`;
}

function createEnemies() {
  for (let i = 0; i < totalEnemies; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${i * 55 + 10}px`;
    enemy.style.top = '80px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
  }
}

function movePlayer(event) {
  if (!gameRunning) return;

  if (event.key === 'ArrowLeft') {
    playerPosition = Math.max(0, playerPosition - 10);
  } else if (event.key === 'ArrowRight') {
    playerPosition = Math.min(560, playerPosition + 10);
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
  bullet.style.left = `${playerPosition + 17}px`;
  bullet.style.top = '550px';
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
      if (
        Math.abs(parseInt(enemy.style.left) - parseInt(bullet.style.left)) < 30 &&
        Math.abs(parseInt(enemy.style.top) - top) < 30) {
        
        // Crear explosión
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = enemy.style.left;
        explosion.style.top = enemy.style.top;
        gameContainer.appendChild(explosion);
        
        // Reproducir sonido de explosión
        explosionSound.currentTime = 0;
        explosionSound.play();
        
        // Eliminar elementos después de 1.5 segundos
        setTimeout(() => {
          if (explosion.parentNode) {
            gameContainer.removeChild(explosion);
          }
        }, 1500);

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
      Math.abs(parseInt(bullet.style.left) - playerPosition - 20) < 30 &&
      Math.abs(top -560) < 30
    ) {
      gameContainer.removeChild(bullet);
      enemyBullets.splice(i, 1);
      lives--;
      updateHUD();
      checkDefeat();
      continue;
    }

    if (top > 600 && bullet.parentNode) {
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

function endGame() {
  clearInterval(gameInterval);
  clearInterval(enemyFireInterval);
  gameRunning = false;
  
  const gameOverMessage = document.getElementById('gameOverMessage');
  const messageTitle = document.getElementById('messageTitle');
  const messageText = document.getElementById('messageText');
  
  if (lives <= 0) {
      // Mensaje y fondo para derrota
      messageTitle.textContent = "¡Derrota!";
      messageTitle.style.color = "#ff3333";
      messageText.textContent = `Swansea está enfadado contigo. Puntuación: ${score}`;
      document.body.style.background = "url('Descent_into_Madness.gif') no-repeat center center fixed";
  } else {
      // Mensaje y fondo para victoria
      messageTitle.textContent = "¡Victoria!";
      messageTitle.style.color = "#4CAF50";
      messageText.textContent = `¡Has ayudado a Pony Express! Puntuación: ${score}`;
      document.body.style.background = "url('ganar.webp') no-repeat center center fixed";
  }
  
  document.body.style.backgroundSize = "cover";
  gameOverMessage.style.display = "block";
  document.getElementById('hud').style.display = "none";
  gameContainer.style.display = "none";
}

function startGame() {
  // Limpiar elementos existentes del juego
  while (gameContainer.firstChild) {
      gameContainer.removeChild(gameContainer.firstChild);
  }

  // Reiniciar variables del juego
  playerBullets = [];
  enemyBullets = [];
  enemies = [];
  enemiesRemaining = totalEnemies;
  score = 0;
  lives = 3;
  gameRunning = true;
  playerPosition = 280;

  // Restablecer fondo inicial
  document.body.style.background = "url('fondoInicio.gif') no-repeat center center fixed";
  document.body.style.backgroundSize = "cover";

  // Ocultar mensaje de fin de juego si está visible
  document.getElementById('gameOverMessage').style.display = "none";

  // Mostrar elementos del juego
  document.getElementById('hud').style.display = "block";
  gameContainer.style.display = "block";

  // Crear y posicionar al jugador
  player.style.left = `${playerPosition}px`;
  gameContainer.appendChild(player);

  // Actualizar HUD
  updateHUD();

  // Crear enemigos
  createEnemies();

  // Limpiar intervalos anteriores si existen
  if (gameInterval) clearInterval(gameInterval);
  if (enemyFireInterval) clearInterval(enemyFireInterval);

  // Establecer intervalos del juego
  gameInterval = setInterval(() => {
      if (gameRunning) {
          movePlayerBullets();
          moveEnemyBullets();
      }
  }, 100);

  enemyFireInterval = setInterval(() => {
      if (gameRunning && enemies.length > 0) {
          enemyShoot();
      }
  }, 1500); // Frecuencia de disparo enemigo (1.5 segundos)
}

document.addEventListener('keydown', movePlayer);
startButton.addEventListener('click', startGame);

document.getElementById('restartButton').addEventListener('click', function() {
  startGame();
});

const isMobile = window.matchMedia("(max-width: 1000px)").matches;

if (isMobile) {
    // Agregar botones táctiles para mover y disparar
    const controls = document.createElement('div');
    controls.id = 'mobileControls';
    controls.innerHTML = `
        <button id="leftButton">←</button>
        <button id="fireButton">💣</button>
        <button id="rightButton">→</button>
    `;
    document.body.appendChild(controls);

    // Manejar eventos táctiles
    document.getElementById('leftButton').addEventListener('touchstart', () => movePlayer({ key: 'ArrowLeft' }));
    document.getElementById('rightButton').addEventListener('touchstart', () => movePlayer({ key: 'ArrowRight' }));
    document.getElementById('fireButton').addEventListener('touchstart', shootBullet);
} else {
    // Ocultar controles móviles en escritorio
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.style.display = 'none';
    }
}
