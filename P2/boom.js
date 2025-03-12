console.log("Ejecutando JS...");

const secretkey = []; //Array vacio para almacenar la clave

function getRandomInt(max) { //Genera un numero entero aleatorio

  return Math.floor(Math.random() * max); 
}

for (let i = 0; i<4; i++){ //se ejecuta 4 veces, ya que queremos una clave de 4 numeros 

  let rnum = getRandomInt(10); //En cada iteraccion se genera un numero entre el 0 y el 9 (el 10 no se incluye)
  secretkey.push(rnum.toString());//Se convierte en una cadena de texto antes de añadirlo al array

}

for (let j = 0; j < secretkey.length; j++) { //Se imprime en la consola el numero generado
  console.log(j + ' Secret Key '  + secretkey[j])
}

//elementos de la interfaz del juego
const elemento ={
    clave1: document.getElementById("clave1"),
    clave2: document.getElementById("clave2"),
    clave3: document.getElementById("clave3"),
    clave4: document.getElementById("clave4"),
    start: document.getElementById("start"),
    stop: document.getElementById("stop"),
    display: document.getElementById("display"),
}

clave1.innerHTML = ":(";
clave2.innerHTML = ":(";
clave3.innerHTML = ":(";
clave4.innerHTML = ":(";

clave1.style.color = "red";
clave2.style.color = "red";
clave3.style.color = "red";
clave4.style.color = "red";

const ESTADO = {
  INIT: 0,
  ADIVINADO: 1,
  CORRECTO: 2,
}

let estado = ESTADO.INIT;

function juego(ev) {
  if (estado == ESTADO.INIT){
    estado = ESTADO.ADIVINANDO;
    console.log("Ha comenzado el juego");
    display.innerHTML = crono.start();
  }else{
    if(estado == ESTADO.ADIVINANDO){
      if(secretkey[0] == ev.target.value){

        elemento.clave1.innerHTML = secretkey[0];
        clave1.style.color = "green";
        secretkey[0]= "adivinado"
      }
      else if (secretkey[1] == ev.target.value){

        elemento.clave2.innerHTML = secretkey[1];
        clave1.style.color = "green";
        secretkey[1]= "adivinado"
      }
      else if (secretkey[2] == ev.target.value){
       
        elemento.clave3.innerHTML = secretkey[1];
        clave1.style.color = "green";
        secretkey[2]= "adivinado"
      } 
      else if (secretkey[3] == ev.target.value){
       
        elemento.clave4.innerHTML = secretkey[1];
        clave1.style.color = "green";
        secretkey[3]= "adivinado"
      }

      if("adivinado" == secretkey[0] &&
        "adivinado" == secretkey[1] &&
        "adivinado" == secretkey[2] &&
        "adivinado" == secretkey[3]) {
          console.log("¡Aiko esta muy orgullosa de lo que has conseguido!");
          crono.stop();
        }

    }
  }
}

digitos = document.getElementsByClassName("digito")

for ( let boton of digitos) {
  boton.onclick = (ev) => {
    juego(ev);
  }
}