// Definición de modos e imágenes
const modos = {
    andrea: [
      'aiko1.jpg', 'aiko2.jpg', 'aiko3.jpg', 'aiko4.jpg', 'aiko5.jpg', 'aiko6.jpg',
      'aiko7.jpg', 'aiko8.jpg', 'aiko9.jpg', 'aiko10.jpg', 'aiko11.jpg', 'aiko12.jpg',
      'aiko13.jpg', 'aiko14.jpg', 'aiko15.jpg', 'aiko16.jpg', 'aiko17.jpg', 'aiko18.jpg'
    ],
    lola: [
      'lola1.avif', 'lola2.webp', 'lola3.jpg', 'lola4.webp', 'lola5.jpg', 'lola6.jpg',
      'lola7.jpg', 'lola8.png', 'lola9.jpg', 'lola10.avif', 'lola11.jpg', 'lola12.webp',
      'lola13.jpg', 'lola14.jpg', 'lola15.avif', 'lola16.jpg', 'lola17.png', 'lola18.png'
    ]
  };
  
  // Definición de dificultades
  const dificultades = {
    '2x2': 2,
    '4x4': 4,
    '6x6': 6
  };
  
  let modoSeleccionado = 'andrea'; // Modo por defecto
  let dificultadSeleccionada = '4x4'; // Dificultad por defecto
  
  // Función para iniciar el juego
  function iniciarJuego() {
    const totalCartas = dificultades[dificultadSeleccionada] * dificultades[dificultadSeleccionada];
    const totalPares = totalCartas / 2;
    const listaOriginal = modos[modoSeleccionado];
  
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
        <div class="card-back"><img src="${src}" alt="" /></div>
      `;
      card.addEventListener('click', () => voltearCarta(card, src));
      tablero.appendChild(card);
    });
  }
  
  // Función para mezclar el array de imágenes
  function mezclarArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  
  //ión para voltear las cartas
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
          alert("¡Felicidades! Has ganado 🎉");
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
  
  // Función para actualizar los contadores de movimientos y aciertos
  function actualizarContadores() {
    document.querySelector(".movimientos").textContent = `${movimientos} movimientos`;
    document.getElementById("display2").textContent = `Aciertos: ${aciertos}`;
  }
  
  // Event listeners para los botones de modo y dificultad
  document.getElementById("modo-andrea").addEventListener("click", () => {
    modoSeleccionado = 'andrea';
  });
  document.getElementById("modo-lola").addEventListener("click", () => {
    modoSeleccionado = 'lola';
  });
  document.querySelectorAll('.dificultad').forEach(boton => {
    boton.addEventListener('click', () => {
      dificultadSeleccionada = boton.getAttribute('data-grid');
    });
  });
  document.getElementById("play").addEventListener("click", iniciarJuego);
  document.getElementById("replay").addEventListener("click", iniciarJuego);
  
  // Variables globales
  let primeraCarta = null;
  let bloquearTablero = false;
  let movimientos = 0;
  let aciertos = 0;
  let totalPares = 0;
  