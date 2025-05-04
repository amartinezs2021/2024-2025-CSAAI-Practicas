const canvas = document.getElementById('networtCanvas');
const ctx = canvas.getContent('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100;

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

class Nodo {

    constructor(id, x, y, delay) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.delay = delay;
      this.conexiones = [];
    }
    
    conectar(nodo, peso) {
      this.conexiones.push({ nodo, peso });
    }
  
    isconnected(idn) {
  
      let isconnected = false;
    
      this.conexiones.forEach(({ nodo: conexion, peso }) => {      
        if (idn == conexion.id) {
          isconnected = true;
        }      
      });
  
      return isconnected;
    }
  