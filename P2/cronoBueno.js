//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset")
}

console.log("Ejecutando JS...");

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    // Generar una nueva clave
    console.log("Nueva clave")
    secretkey.length = 0; // Vaciar el array de la clave actual
    for (let i = 0; i < 4; i++) {
        let rnum = getRandomInt(10);
        secretkey.push(rnum.toString());
        console.log(i + ' Secret Key '  + secretkey[i]);
    }

    crono.stop();
    crono.reset();

    // Reiniciar la interfaz
    elemento.clave1.innerHTML = "*";
    elemento.clave2.innerHTML = "*";
    elemento.clave3.innerHTML = "*";
    elemento.clave4.innerHTML = "*";
    elemento.clave1.style.color = "red";
    elemento.clave2.style.color = "red";
    elemento.clave3.style.color = "red";
    elemento.clave4.style.color = "red";
  
    // Volver al estado inicial
    estado = ESTADO.INIT;
};