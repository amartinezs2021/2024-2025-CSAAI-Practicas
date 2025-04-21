let modoSeleccionado = 'andrea';
let dificultadSeleccionada = 2;

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
        
        'lola1.jpg',
        'lola2.jpg',
        'lola3.jpg',
        'lola4.jpg',
        'lola5.jpg',
        'lola6.jpg',
        'lola7.jpg',
        'lola8.jpg',
        'lola9.jpg',
        'lola10.jpg',
        'lola11.jpg',
        'lola12.jpg',
        'lola13.jpg',
        'lola14.jpg',
        'lola15.jpg',
        'lola16.jpg',
        'lola17.jpg',
        'lola18.jpg',
    ]
};

let primeraCarta = null;
let bloquearTablero = false;
let movimientos = 0;
let aciertos = 0;
let totalPares = 0;

document.getElementById("modo-andrea").addEventListener("click", () => {
    modoSeleccionado = 'andrea';
});

document.querySelectorAll('dificultad').forEach(boton => {
    boton.addEvenetListener('click', () => {
        dificultadSeleccionada = parseInt(boton.getAttribute('data-grid'))
    });
});

document.getElementById("play").addEventListener("click", iniciarJuego);
document.getElementById("replay").addEventListener("click", iniciarJuego);

function iniciarJuego() {
    movimientos = 0;
    aciertos = 0;
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
            <div class="card-back"><img src="${src}" alt="" /></div>
        `;
        card.addEventListener('click', () => voltearCarta(card, src));
        tablero.appendChild(card);
    });
}