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