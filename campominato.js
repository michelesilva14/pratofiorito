var DIM = 24;
var NUM_BOMBE = 88;
var DIM_CELLA = 30;
var griglia = [];
var scoperto = [];
var bandiera = [];
var gameOver = false;
var vittoria = false;
var gameFinished = false;
var bombeRimaste = NUM_BOMBE;
var flagPlacementMode = false;


function updateBombsCounter() {
  var bombsLeftSpan = select('#bombsLeft');
  bombsLeftSpan.html(bombeRimaste); // Aggiorna il numero di bombe rimaste nel DOM
}

function setup() {
  var canvasWidth = DIM * DIM_CELLA + 2;
  var canvasHeight = DIM * DIM_CELLA + 2;
  var gameCanvas = createCanvas(canvasWidth, canvasHeight);
  gameCanvas.parent('gameCanvas');
  inizializzaGriglia();
  contaBombeVicine();
  
  // Aggiunta evento click al tasto per posizionare le bandiere
  var placeFlagButton = select('#placeBombButton');
  placeFlagButton.mousePressed(toggleFlagPlacementMode);
  
  // Aggiorna il contatore delle bombe
  updateBombsCounter();
}

// Funzione per attivare/disattivare la modalità di posizionamento bandiere
function toggleFlagPlacementMode() {
  flagPlacementMode = !flagPlacementMode; // Inverti lo stato della modalità
  
  // Aggiorna l'aspetto del pulsante per riflettere lo stato attuale della modalità
  var placeFlagButton = select('#placeBombButton');
  if (flagPlacementMode) {
    placeFlagButton.style('background-color', 'green');
    // Eventualmente, altre azioni da eseguire quando la modalità è attivata
  } else {
    placeFlagButton.style('background-color', 'red');
    // Eventualmente, altre azioni da eseguire quando la modalità è disattivata
  }
}

// Funzione per posizionare una bandiera quando si fa clic su una cella
function placeFlag(x, y) {
  if (!scoperto[x][y] && !bandiera[x][y] && bombeRimaste > 0) {
    bandiera[x][y] = true;
    bombeRimaste--;
    updateBombsCounter(); // Aggiorna il contatore delle bombe
  }
}

// Funzione per rimuovere una bandiera quando si fa clic su una cella già bandierata
function removeFlag(x, y) {
  if (!scoperto[x][y] && bandiera[x][y]) {
    bandiera[x][y] = false;
    bombeRimaste++;
    updateBombsCounter(); // Aggiorna il contatore delle bombe
  }
}

// Funzione per visualizzare la griglia di gioco
function mostraGriglia() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      var cellX = offsetX + x * DIM_CELLA;
      var cellY = offsetY + y * DIM_CELLA;
      if (scoperto[x][y] || gameOver && griglia[x][y] == -1) {
        fill(200);
      } else {
        fill(100);
      }
      rect(cellX, cellY, DIM_CELLA, DIM_CELLA);
      if (scoperto[x][y] && griglia[x][y] > 0) {
        disegnaNumero(x, y, griglia[x][y], cellX, cellY);
      }
      if (bandiera[x][y]) {
        fill(255, 0, 0);
        triangle(cellX + 5, cellY + 5, cellX + DIM_CELLA / 2, cellY + 25, cellX + 25, cellY + 5);
      }
      if (gameOver && griglia[x][y] == -1) {
        fill(0);
        ellipse(cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2, DIM_CELLA / 2, DIM_CELLA / 2);
      }
    }
  }
}

// Funzione per scoprimento delle celle
function scopriCella(x, y) {
  if (!scoperto[x][y] && !bandiera[x][y]) {
    scoperto[x][y] = true;
    if (griglia[x][y] == -1) {
      gameOver = true;
    } else if (griglia[x][y] == 0) {
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < DIM && y + j >= 0 && y + j < DIM) {
            scopriCella(x + i, y + j);
          }
        }
      }
    }
  }
}

// Funzione per controllare se il giocatore ha vinto il gioco
function controllaVittoria() {
  var scoperte = 0;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (scoperto[x][y] || (bandiera[x][y] && griglia[x][y] == -1)) {
        scoperte++;
      }
    }
  }
  if (scoperte == DIM * DIM) {
    vittoria = true;
  }
}

// Funzione per disegnare numeri sulle celle
function disegnaNumero(x, y, numero, cellX, cellY) {
  switch (numero) {
    case 1: fill(0, 0, 255); break;
    case 2: fill(0, 255, 0); break;
    case 3: fill(255, 0, 0); break;
    case 4: fill(255, 255, 0); break;
    case 5: fill(128, 0, 128); break;
    case 6: fill(255, 165, 0); break;
    case 7: fill(165, 42, 42); break;
    case 8: fill(0); break;
  }
  textAlign(CENTER, CENTER);
  textSize(15);
  text(numero.toString(), cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2);
}

// Funzione per riavviare il gioco
function riavviaGioco() {
  gameFinished = false;
  gameOver = false;
  vittoria = false;
  bombeRimaste = NUM_BOMBE;
  inizializzaGriglia();
  contaBombeVicine();
}

// Funzione per inizializzare la griglia di gioco
function inizializzaGriglia() {
  griglia = new Array(DIM);
  scoperto = new Array(DIM);
  bandiera = new Array(DIM);
  for (var i = 0; i < DIM; i++) {
    griglia[i] = new Array(DIM);
    scoperto[i] = new Array(DIM);
    bandiera[i] = new Array(DIM);
    for (var j = 0; j < DIM; j++) {
      griglia[i][j] = 0;
      scoperto[i][j] = false;
      bandiera[i][j] = false;
    }
  }
  var moduli = [
    [[1, 1], [4, 1], [4, 2], [5, 1]],
    [[2, 1], [3, 1], [3, 2], [6, 1]],
    [[1, 2], [4, 2], [4, 1], [5, 2]],
    [[2, 2], [3, 1], [3, 2], [6, 2]]
  ];
  for (var i = 0; i < DIM; i += 6) {
    for (var j = 0; j < DIM; j += 2) {
      var moduloScelto = int(random(moduli.length));
      for (var k = 0; k < moduli[moduloScelto].length; k++) {
        var x = i + moduli[moduloScelto][k][0] - 1;
        var y = j + moduli[moduloScelto][k][1] - 1;
        if (x < DIM && y < DIM) {
          griglia[x][y] = -1;
        }
      }
    }
  }
}

// Funzione per contare le bombe vicine a ciascuna cella
function contaBombeVicine() {
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] == -1) {
        continue;
      }
      var conta = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < DIM && y + j >= 0 && y + j < DIM && griglia[x + i][y + j] == -1) {
            conta++;
          }
        }
      }
      griglia[x][y] = conta;
    }
  }
}
