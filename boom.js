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

//eleme