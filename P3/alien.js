// Variables del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const victorySound = document.getElementById('victorySound');

// Tamaño del canvas
canvas.width = 800;
canvas.height = 600;

// Variables del juego
let gameRunning = false;
let score = 0;
let lives = 3;
let lastTime = 0;
let enemySpawnTimer = 0;
let enemyShootTimer = 0;

// Imágenes
const playerImg = new Image();
playerImg.src = 'nave.png';

const enemyImg = new Image();
enemyImg.src = 'imagen.png';

// Objetos del juego
const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 7,
    isMovingLeft: false,
    isMovingRight: false
};

let bullets = [];
let enemies = [];
let enemyBullets = [];

// Iniciar juego
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
});

function initGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    bullets = [];
    enemies = [];
    enemyBullets = [];
    
    updateScore();
    updateLives();

        // Iniciar bucle del juego
        requestAnimationFrame(gameLoop);
    }

function gameLoop(timestamp) {
    if (!gameRunning) return;
        
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
        
// Limpiar canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);
        
 // Actualizar y dibujar elementos
updatePlayer(deltaTime);
updateBullets(deltaTime); 
updateEnemies(deltaTime);
updateEnemyBullets(deltaTime);
        
           // Generación de enemigos
    enemySpawnTimer += deltaTime;
    if (enemySpawnTimer > 1000) { // Cada segundo
        spawnEnemy();
        enemySpawnTimer = 0;
    }
}  

//Disparos enemigos
enemyShootTimer += deltaTime;
if (enemyShootTimer > 1500 && enemies.length > 0) {
    enemyShoot();
    enemyShootTimer = 0;
}

//Detencion de colisiones
checkCollisions();

//Comprobar victoria
if (enemies.length === 0 && enemyBullest.length === 0) {
    victory();
    return;
}
requestAnimationFrame(gameLoop);

function updatePlayer(deltaTime) {
    // Movimiento del jugador
    if (player.isMovingLeft) {
        player.x = Math.max(player.width / 2, player.x - player.speed);
    }
    if (player.isMovingRight) {
        player.x = Math.min(canvas.width - player.width / 2, player.x + player.speed);
    }
     // Dibujar jugador
     ctx.drawImage(
        playerImg,
        player.x - player.width / 2,
        player.y - player.height / 2,
        player.width,
        player.height
    );
}

function updateBullets(deltaTime) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        
        // Dibujar bala
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(bullets[i].x - 2, bullets[i].y - 10, 4, 20);
        
        // Eliminar balas fuera de pantalla
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

function updateEnemies(deltaTime) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed * 0.5; // Movimiento lento hacia abajo
        enemies[i].x += Math.sin(enemies[i].y * 0.05) * 2; // Movimiento sinusoidal
        
        // Dibujar enemigo
        ctx.drawImage(
            enemyImg,
            enemies[i].x - enemies[i].width / 2,
            enemies[i].y - enemies[i].height / 2,
            enemies[i].width,
            enemies[i].height
        );
        
        // Eliminar enemigos fuera de pantalla
        if (enemies[i].y > canvas.height + enemies[i].height) {
            enemies.splice(i, 1);
        }
    }
}

function updateEnemyBullets(deltaTime) {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        
        // Dibujar bala enemiga
        ctx.fillStyle = '#ff5555';
        ctx.fillRect(enemyBullets[i].x - 3, enemyBullets[i].y - 3, 6, 6);
        
        // Eliminar balas fuera de pantalla
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        }
    }
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        width: 40,
        height: 40,
        speed: 1 + Math.random() * 2
    });
}

function enemyShoot() {
    if (enemies.length === 0) return;
    
    const shootingEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    enemyBullets.push({
        x: shootingEnemy.x,
        y: shootingEnemy.y + shootingEnemy.height / 2,
        speed: 5
    });
}

function checkCollisions() {
    // Colisiones balas jugador - enemigos
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                // Eliminar bala y enemigo
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                
                // Aumentar puntuación
                score += 10;
                updateScore();
                break;
            }
        }
    } 
    
// Colisiones balas enemigas - jugador
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (checkCollision(enemyBullets[i], player)) {
            enemyBullets.splice(i, 1);
            lives--;
            updateLives();
            
            if (lives <= 0) {
                gameOver();
            }
            break;
        }
    }

  // Colisiones enemigos - jugador
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (checkCollision(enemies[i], player)) {
        enemies.splice(i, 1);
        lives--;
        updateLives();
        
        if (lives <= 0) {
            gameOver();
        }
        break;
    }
}
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width / 2 &&
           obj1.x > obj2.x - obj2.width / 2 &&
           obj1.y < obj2.y + obj2.height / 2 &&
           obj1.y > obj2.y - obj2.height / 2;
}

function updateScore() {
    scoreDisplay.textContent = `Puntos: ${score}`;
}

function updateLives() {
    livesDisplay.textContent = `Vidas: ${lives}`;
}

function gameOver() {
    gameRunning = false;
    alert(`¡Game Over! Puntuación final: ${score}`);
    location.reload();
}

function victory() {
    gameRunning = false;
    victorySound.play();

    const victoryMessage = document.createElement('div');
    victoryMessage.id = 'victoryMessage';
    victoryMessage.innerHTML = '¡VICTORIA!<br>Puntuación final: ' + score;
    document.body.appendChild(victoryMessage);
    victoryMessage.style.display = 'block';
    
    setTimeout(() => {
        location.reload();
    }, 5000);
}

// Controles
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            player.isMovingLeft = true;
            break;
        case 'ArrowRight':
            player.isMovingRight = true;
            break;
        case ' ':
            // Disparar
            bullets.push({
                x: player.x,
                y: player.y - player.height / 2,
                speed: 10
            });
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            player.isMovingLeft = false;
            break;
        case 'ArrowRight':
            player.isMovingRight = false;
            break;
    }
});