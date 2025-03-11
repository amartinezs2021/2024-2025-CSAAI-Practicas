//-- Manejador del evento clic sobre el párrafo test
//-- Cada vez que se hace clic en el párrafo se invoca a esta función
function manejador_parrafo()
{
  console.log("Clica si te atreves niño");
  if (test.style.backgroundColor == "red") 
    {
    test.style.backgroundColor = "white";
    } 
  else 
  {
    test.style.backgroundColor = "red";
  }
}
  

console.log("Ejecutando js...")

for (let i = 0; i < 10; i++) {
    while (i < 5) {
        alert("María está a 3 metros de ti y quiere conocerte!!!!!!!!!!!!");
        i++; // to avoid infinite loop
    }
}
//-- Leer el párrafo identificado como test
const test = document.getElementById('test')

//-- Configurar el manejador para el evento de
//-- pulsación de botón: que se ejecute la
//-- funcion manejador_parrafo()
test.onclick = manejador_parrafo;