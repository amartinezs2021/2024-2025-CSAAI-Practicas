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
  
    node_distance(nx, ny) {
  
      var a = nx - this.x;
      var b = ny - this.y;
              
      return Math.floor(Math.sqrt( a*a + b*b ));
      
    }
  
    far_node( nodos ) {
  
      let distn = 0;
      let cnode = this.id;
      let distaux = 0;
      let pos = 0;
      let npos = 0;
  
      for (let nodo of nodos) {
        distaux = this.node_distance(nodo.x, nodo.y);
    
        if (distaux != 0 && distaux > distn) {
          distn = distaux;
          cnode = nodo.id;
          npos = pos;
        }
  
        pos += 1;
      }
    
      return {pos: npos, id: cnode, distance: distn,};
  
    }
  
    close_node( nodos ) {
  
      let far_node = this.far_node( nodos );
      let cnode = far_node.id;
      let distn = far_node.distance;
      let distaux = 0;
      let pos = 0;
      let npos = 0;    
        
      for (let nodo of nodos) {
        distaux = this.node_distance(nodo.x, nodo.y);
        
        if (distaux != 0 && distaux <= distn) {
          distn = distaux;
          cnode = nodo.id;
          npos = pos;
        }
      
        pos += 1;
      }
        
      return {pos:npos, id: cnode, distance: distn,};
        
    }
  
  }