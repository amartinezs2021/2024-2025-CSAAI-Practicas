// Variables iniciales
let modoSeleccionado = 'andrea';
let dificultadSeleccionada = 2;
let primeraCarta = null;
let bloquearTablero = false;
let movimientos = 0;
let aciertos = 0;
let totalPares = 0;

let tiempo = 0;
let intervaloTiempo = null;
let juegoEnCurso = false;

// Audios
const sonidoAcierto = document.getElementById("sonido-acierto");
const sonidoVictoria = document.getElementById("sonido-victoria");
const musicaFondo = document.getElementById("musica-fondo");

//Imagenes
const imagenes = {
  andrea: [
    'aiko1.jpg',
    'aiko2.jpg',
    'aiko3.jpg',
    'aiko4.jpg',
    'aiko5.jpg',
    'aiko6.jpg',
    'aiko7.jpg',
    'aiko8.jpg',
    'aiko9.jpg',
    'aiko10.jpg',
    'aiko11.jpg',
    'aiko12.jpg',
    'aiko13.jpg',
    'aiko14.jpg',
    'aiko15.jpg',
    'aiko16.jpg',
    'aiko17.jpg',
    'aiko18.jpg',
  ],
  lola: [
    'lola1.avif',
    'lola2.webp',
    'lola3.jpg',
    'lola4.webp',
    'lola5.jpg',
    'lola6.jpg',
    'lola7.jpg',
    'lola8.png',
    'lola9.jpg',
    'lola10.avif',
    'lola11.jpg',
    'lola12.webp',
    'lola13.jpg',
    'lola14.jpg',
    'lola15.avif',
    'lola16.jpg',
    'lola17.png',
    'lola18.png',
     ]
};

// Eventos para los botones de selección de modo (temática)
const botonesModo = document.querySelectorAll('#modo-andrea, #modo-lola');
botonesModo.forEach(boton => {
  boton.addEventListener("click", () => {
    modoSeleccionado = boton.id === 'modo-andrea' ? 'andrea' : 'lola';

    // Resalta el botón seleccionado y remueve la clase del resto
    botonesModo.forEach(b => b.classList.remove('boton-seleccionado'));
    boton.classList.add('boton-seleccionado');
  });
});

// Eventos para los botones de selección de dificultad
const botonesDificultad = document.querySelectorAll('.dificultad');
botonesDificultad.forEach(boton => {
  boton.addEventListener('click', () => {
    dificultadSeleccionada = parseInt(boton.getAttribute('data-grid'));

    // Resalta el botón seleccionado y remueve la clase del resto
    botonesDificultad.forEach(b => b.classList.remove('boton-seleccionado'));
    boton.classList.add('boton-seleccionado');
  });
});

// Eventos para los botones de control
document.getElementById("play").addEventListener("click", iniciarJuego);
document.getElementById("replay-juego").addEventListener("click", reiniciarJuego);
document.getElementById("replay-inicio").addEventListener("click", reiniciarJuego);

document.getElementById("volver-menu").addEventListener("click", () => {
  // Detener la música y el temporizador
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
  clearInterval(intervaloTiempo);
  intervaloTiempo = null;
  tiempo = 0;
  juegoEnCurso = false;
  actualizarTiempo();

  // Volver a la pantalla del menú inicial
  document.querySelector('.pantalla-final').style.display = 'none';
  document.querySelector('.inicio').style.display = 'block';
});

// Función para iniciar el juego
function iniciarJuego() {
  // Mostrar la pantalla del juego y ocultar las otras
  document.querySelector('.inicio').style.display = 'none';
  document.querySelector('.game').style.display = 'block';
  document.querySelector('.pantalla-final').style.display = 'none';

  // Reiniciar variables de estado del juego
  movimientos = 0;
  aciertos = 0;
  tiempo = 0;
  juegoEnCurso = true;
  primeraCarta = null;
  bloquearTablero = false;
  actualizarContadores();
  actualizarTiempo();

  // Iniciar o continuar temporizador solo si no está activo
  if (!intervaloTiempo) {
    intervaloTiempo = setInterval(() => {
      if (juegoEnCurso) {
        tiempo++;
        actualizarTiempo();
      }
    }, 1000);
  }

  // Calcular total de cartas y pares
  const totalCartas = dificultadSeleccionada * dificultadSeleccionada;
  totalPares = totalCartas / 2;
  const listaOriginal = imagenes[modoSeleccionado];

  // Validar cantidad de imágenes disponibles
  if (totalPares > listaOriginal.length) {
    alert(`No hay suficientes imágenes para un tablero de ${dificultadSeleccionada}x${dificultadSeleccionada}`);
    return;
  }

  // Seleccionar y duplicar las imágenes para formar pares
  const seleccionadas = listaOriginal.slice(0, totalPares);
  const barajado = mezclarArray([...seleccionadas, ...seleccionadas]);

  // Limpiar y configurar el tablero
  const tablero = document.querySelector(".tablero");
  tablero.innerHTML = '';
  tablero.style.gridTemplateColumns = `repeat(${dificultadSeleccionada}, auto)`;

  // Iniciar la música de fondo desde el principio
  musicaFondo.currentTime = 0;
  musicaFondo.play();

  // Crear las cartas y añadirlas al tablero
  barajado.forEach(src => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-front"></div>
      <div class="card-back"><img src="${src}" alt="imagen de carta" /></div>
    `;
    card.addEventListener('click', () => voltearCarta(card, src));
    tablero.appendChild(card);
  });
}

function reiniciarJuego() {
  iniciarJuego();
}

// Función para voltear una carta y controlar la lógica de parejas
function voltearCarta(card, src) {
  if (bloquearTablero || card.classList.contains('flipped')) return;
  card.classList.add('flipped');

  if (!primeraCarta) {
    primeraCarta = { card, src };
    return;
  }

  movimientos++;
  actualizarContadores();

  if (primeraCarta.src === src) {
    aciertos++;
    actualizarContadores();
    sonidoAcierto.play();
    primeraCarta = null;

    if (aciertos === totalPares) {
      juegoEnCurso = false; // Detener temporizador inmediatamente
      musicaFondo.pause();
      sonidoVictoria.play();
    
      // Esperar breve efecto visual
      setTimeout(() => {
        // Mostrar valores reales
        document.getElementById("final-movimientos").textContent = movimientos;
        document.getElementById("final-tiempo").textContent = tiempo;
    
        // Cambiar a pantalla final
        document.querySelector('.game').style.display = 'none';
        document.querySelector('.pantalla-final').style.display = 'block';
      }, 500);
    }
    
  } else {
    bloquearTablero = true;
    setTimeout(() => {
      card.classList.remove('flipped');
      if (primeraCarta && primeraCarta.card) {
        primeraCarta.card.classList.remove('flipped');
      }
      primeraCarta = null;
      bloquearTablero = false;
    }, 1000);
  }
}

// Función para mezclar aleatoriamente un arreglo
function mezclarArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Actualiza los contadores de movimientos y aciertos
function actualizarContadores() {
  document.querySelector(".movimientos").textContent = `${movimientos} movimientos`;
  document.getElementById("display2").textContent = `Aciertos: ${aciertos}`;
}

// Actualiza el temporizador
function actualizarTiempo() {
  const timerDisplay = document.querySelector(".timer");
  timerDisplay.textContent = `Tiempo: ${tiempo} sec`;
}

function reiniciarJuego() {
  // Detener temporizador existente
  clearInterval(intervaloTiempo);

  // Detener música y reiniciarla
  musicaFondo.pause();
  musicaFondo.currentTime = 0;

  // Reiniciar variables de tiempo
  tiempo = 0;
  juegoEnCurso = true;

  // Reiniciar el juego completamente
  iniciarJuego();
}




