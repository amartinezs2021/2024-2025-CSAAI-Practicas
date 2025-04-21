let modoSeleccionado = 'andrea';
let dificultadSeleccionada = 2;
let primeraCarta = null;
let bloquearTablero = false;
let movimientos = 0;
let aciertos = 0;
let totalPares = 0;

const imagenes = {
  andrea: [
    'images/andrea/pajaro1.jpg',
    'images/andrea/pajaro2.jpg',
    'images/andrea/pajaro3.jpg',
    'images/andrea/pajaro4.jpg',
    'images/andrea/pajaro5.jpg',
    'images/andrea/pajaro6.jpg',
    'images/andrea/pajaro7.jpg',
    'images/andrea/pajaro8.jpg',
    'images/andrea/pajaro9.jpg',
    'images/andrea/pajaro10.jpg',
    'images/andrea/pajaro11.jpg',
    'images/andrea/pajaro12.jpg',
    'images/andrea/pajaro13.jpg',
    'images/andrea/pajaro14.jpg',
    'images/andrea/pajaro15.jpg',
    'images/andrea/pajaro16.jpg',
    'images/andrea/pajaro17.jpg',
    'images/andrea/pajaro18.jpg',
  ],
  lola: [
    'images/lola/mito1.jpg',
    'images/lola/mito2.jpg',
    'images/lola/mito3.jpg',
    'images/lola/mito4.jpg',
    'images/lola/mito5.jpg',
    'images/lola/mito6.jpg',
    'images/lola/mito7.jpg',
    'images/lola/mito8.jpg',
    'images/lola/mito9.jpg',
    'images/lola/mito10.jpg',
    'images/lola/mito11.jpg',
    'images/lola/mito12.jpg',
    'images/lola/mito13.jpg',
    'images/lola/mito14.jpg',
    'images/lola/mito15.jpg',
    'images/lola/mito16.jpg',
    'images/lola/mito17.jpg',
    'images/lola/mito18.jpg',
  ]
};

// EVENTOS DE MODO Y DIFICULTAD
document.getElementById("modo-andrea").addEventListener("click", () => {
  modoSeleccionado = 'andrea';
});

document.getElementById("modo-lola").addEventListener("click", () => {
  modoSeleccionado = 'lola';
});

document.querySelectorAll('.dificultad').forEach(boton => {
  boton.addEventListener('click', () => {
    dificultadSeleccionada = parseInt(boton.getAttribute('data-grid'));
  });
});

document.getElementById("play").addEventListener("click", iniciarJuego);
document.getElementById("replay").addEventListener("click", reiniciarJuego);

// FUNCIONES PRINCIPALES

function iniciarJuego() {
  // Mostrar juego y ocultar inicio
  document.querySelector('.inicio').style.display = 'none';
  document.querySelector('.game').style.display = 'block';

  // Reiniciar variables
  movimientos = 0;
  aciertos = 0;
  primeraCarta = null;
  bloquearTablero = false;
  actualizarContadores();

  const totalCartas = dificultadSeleccionada * dificultadSeleccionada;
  totalPares = totalCartas / 2;

  const listaOriginal = imagenes[modoSeleccionado];

  if (totalPares > listaOriginal.length) {
    alert(`No hay suficientes imágenes para un tablero de ${dificultadSeleccionada}x${dificultadSeleccionada}`);
    return;
  }

  const seleccionadas = listaOriginal.slice(0, totalPares);
  const barajado = mezclarArray([...seleccionadas, ...seleccionadas]);

  const tablero = document.querySelector(".tablero");
  tablero.innerHTML = '';
  tablero.style.gridTemplateColumns = `repeat(${dificultadSeleccionada}, auto)`;

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

// FUNCIONALIDAD DE CARTAS

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
    primeraCarta = null;

    if (aciertos === totalPares) {
      setTimeout(() => {
        alert("🎉 ¡Felicidades! Has encontrado todas las parejas.");
      }, 300);
    }
  } else {
    bloquearTablero = true;
    setTimeout(() => {
      card.classList.remove('flipped');
      primeraCarta.card.classList.remove('flipped');
      primeraCarta = null;
      bloquearTablero = false;
    }, 1000);
  }
}

function mezclarArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

function actualizarContadores() {
  document.querySelector(".movimientos").textContent = `${movimientos} movimientos`;
  document.getElementById("display2").textContent = `Aciertos: ${aciertos}`;
}