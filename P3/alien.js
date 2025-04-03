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

