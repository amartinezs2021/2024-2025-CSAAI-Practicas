const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;

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
    return this.conexiones.some(({ nodo }) => nodo.id === idn);
  }

  node_distance(nx, ny) {
    const a = nx - this.x;
    const b = ny - this.y;
    return Math.floor(Math.sqrt(a * a + b * b));
  }

  far_node(nodos) {
    let distn = 0, cnode = this.id, distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux > distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }

  close_node(nodos) {
    let far_node = this.far_node(nodos);
    let cnode = far_node.id;
    let distn = far_node.distance;
    let distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux <= distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }
}

function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  const xs = Math.floor(canvas.width / numNodos);
  const ys = Math.floor(canvas.height / 2);
  const xr = canvas.width - nodeRadius;
  const yr = canvas.height - nodeRadius;
  let xp = nodeRadius;
  let yp = nodeRadius;
  let xsa = xs;
  let ysa = ys;

  for (let i = 0; i < numNodos; i++) {
    yp = Math.random() < 0.5 ? nodeRadius : ys;
    ysa = yp === nodeRadius ? ys : yr;
    const x = randomNumber(xp, xsa);
    const y = randomNumber(yp, ysa);
    xp = xsa;
    xsa += xs;
    if (xsa > xr && xsa <= canvas.width) xsa = xr;
    if (xsa > xr && xsa < canvas.width) {
      xp = nodeRadius;
      xsa = xs;
    }
    const delay = generarRetardo();
    nodos.push(new Nodo(i, x, y, delay));
  }

  for (let nodo of nodos) {
    const clonedArray = [...nodos];
    for (let j = 0; j < numConexiones; j++) {
      let close_node = nodo.close_node(clonedArray);
      if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
        nodo.conectar(clonedArray[close_node.pos], close_node.distance);
      }
      clonedArray.splice(close_node.pos, 1);
    }
  }

  return nodos;
}

function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawNet(nnodes, change, ruta) {
  if (!change) {
    // Dibuja la red completa
    nnodes.forEach(nodo => {
      nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
        ctx.beginPath();
        ctx.moveTo(nodo.x, nodo.y);
        ctx.lineTo(conexion.x, conexion.y);
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        const pw = "N" + nodo.id + " pw " + peso;
        const midX = Math.floor((nodo.x + conexion.x) / 2);
        const midY = Math.floor((nodo.y + conexion.y) / 2);
        ctx.fillText(pw, midX, midY);
      });
    });

    nnodes.forEach(nodo => {
      ctx.beginPath();
      ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#1489b8";
      ctx.fill();
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      const desc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
      ctx.fillText(desc, nodo.x, nodo.y + 5);
    });
  } else {
    // Dibuja solo la ruta
    for (let i = 0; i < ruta.length - 1; i++) {
      const nodo = ruta[i];
      const next = ruta[i + 1];
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 3;
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    ruta.forEach((nodo, index) => {
      ctx.beginPath();
      ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
      if (index === 0) ctx.fillStyle = "blue";
      else if (index === ruta.length - 1) ctx.fillStyle = "red";
      else ctx.fillStyle = "green";
      ctx.fill();
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      const desc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
      ctx.fillText(desc, nodo.x, nodo.y + 5);
    });

    drawLegend();
  }
}

function drawLegend() {
  const startX = canvas.width - 160;
  const startY = canvas.height - 100;
  ctx.fillStyle = "white";
  ctx.fillRect(startX - 10, startY - 20, 150, 80);
  const legendItems = [
    { color: "blue", label: "Origen" },
    { color: "red", label: "Destino" },
    { color: "green", label: "Ruta" }
  ];
  legendItems.forEach((item, i) => {
    ctx.beginPath();
    ctx.fillStyle = item.color;
    ctx.arc(startX, startY + i * 25, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(item.label, startX + 20, startY + 4 + i * 25);
  });
}

const display = {
  numeronodos: document.getElementById("nodos"),
  cronometro: document.getElementById("crono"),
  estado: document.getElementById("estado")
};

btnCNet.onclick = () => {
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet(redAleatoria, false, redAleatoria);
  display.estado.style.color = "green";
  display.estado.innerHTML = "Red generada";
  display.numeronodos.innerHTML = numNodos + " nodos";
};

btnMinPath.onclick = () => {
  if (display.estado.innerHTML !== "Red generada") {
    display.estado.innerHTML = "La red no está generada. Por favor generar primero la red.";
    display.estado.style.color = "red";
  } else {
    nodoOrigen = redAleatoria[0];
    nodoDestino = redAleatoria[numNodos - 1];
    rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
    console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);

    if (rutaMinimaConRetardos.length === 1) {
      display.estado.innerHTML = "La red generada no tiene ningún camino hasta el nodo destino.";
      display.estado.style.color = "red";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNet(redAleatoria, true, rutaMinimaConRetardos);
      display.cronometro.innerHTML = "";
    } else {
      const tiempo = rutaMinimaConRetardos.reduce((acc, nodo) => acc + nodo.delay, 0);
      display.cronometro.innerHTML = "Tiempo total: " + parseInt(tiempo) + " sec";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNet(redAleatoria, true, rutaMinimaConRetardos);
    }
  }
};
