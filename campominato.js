var DIM = 24;
var NUM_BOMBE = 88;
var griglia = [];
var scoperto = [];
var bandiera = [];
var gameOver = false;
var vittoria = false;
var gameFinished = false;
var bombeRimaste;
var DIM_CELLA;
var currentAction = "discover";

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  inizializzaGriglia();
  contaBombeVicine();
  bombeRimaste = NUM_BOMBE;

  // Aggiungi event listener per i pulsanti
  document.getElementById('discoverButton').addEventListener('click', () => {
    currentAction = "discover";
    document.getElementById('discoverButton').classList.add('active');
    document.getElementById('flagButton').classList.remove('active');
  });
  document.getElementById('flagButton').addEventListener('click', () => {
    currentAction = "flag";
    document.getElementById('flagButton').classList.add('active');
    document.getElementById('discoverButton').classList.remove('active');
  });

  // Imposta il pulsante "Scopri" come predefinito attivo
  document.getElementById('discoverButton').classList.add('active');
}

function draw() {
  background(255); // Sfondo bianco
  fill(0); // Testo nero
  textAlign(LEFT, TOP);
  textSize(20);
  text("Bombe rimaste: " + bombeRimaste, 10, 10);
  mostraGriglia();
  controllaVittoria();
  if (gameOver || vittoria) {
    opacizzaGriglia();
    mostraPopup();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  DIM_CELLA = min(windowWidth, windowHeight) / DIM;
}

function opacizzaGriglia() {
  fill(0, 150);
  rect(0, 0, width, height);
}

function mostraPopup() {
  var popupWidth = DIM_CELLA * 8;
  var popupHeight = DIM_CELLA * 5;
  var popupX = width / 2 - popupWidth / 2;
  var popupY = height / 2 - popupHeight / 2;
  fill(0);
  rect(popupX, popupY, popupWidth, popupHeight);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(25);
  var messaggio = gameOver ? "Hai perso!" : "Hai vinto!";
  text(messaggio, width / 2, height / 2 - 30);
  var buttonX = width / 2 - 50;
  var buttonY = height / 2 + 20;
  var buttonWidth = 100;
  var buttonHeight = 40;
  fill(178, 34, 34);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill(255);
  textSize(20);
  text("Rigioca", width / 2, height / 2 + 30);
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);

  if (gameOver || vittoria) {
    var buttonX = width / 2 - 50;
    var buttonY = height / 2 + 20;
    var buttonWidth = 100;
    var buttonHeight = 40;
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      riavviaGioco();
    }
  } else if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (currentAction == "discover") {
      scopriCella(x, y);
    } else if (currentAction == "flag") {
      if (!scoperto[x][y]) {  // Impedisci di mettere bandiere sulle celle già scoperte
        if (!bandiera[x][y] && bombeRimaste > 0) {
          bandiera[x][y] = true;
          bombeRimaste--;
        } else if (bandiera[x][y]) {
          bandiera[x][y] = false;
          bombeRimaste++;
        }
      }
    }
  }
}

function riavviaGioco() {
  gameFinished = false;
  gameOver = false;
  vittoria = false;
  bombeRimaste = NUM_BOMBE;
  inizializzaGriglia();
  contaBombeVicine();
}

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

function contaBombeVicine() {
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] == -1) {
        continue;
      }
      var conta = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x < DIM && y + j >= 0 && y + j < DIM && griglia[x + i][y + j] == -1) {
            conta++;
          }
        }
      }
      griglia[x][y] = conta;
    }
  }
}

function mostraGriglia() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      var cellX = offsetX + x * DIM_CELLA;
      var cellY = offsetY + y * DIM_CELLA;
      stroke(0); // Linea di contorno nera
      if (scoperto[x][y] || (gameOver && griglia[x][y] == -1)) {
        fill(200); // Celle scoperte
      } else {
        fill(150); // Celle non scoperte
      }
      rect(cellX, cellY, DIM_CELLA, DIM_CELLA);
      if (scoperto[x][y]) {
        if (griglia[x][y] != 0) {
          disegnaNumero(x, y, griglia[x][y], cellX, cellY);
        }
      } else if (bandiera[x][y]) {
        fill(255, 0, 0);
        triangle(cellX + DIM_CELLA / 2, cellY + 5, cellX + DIM_CELLA - 5, cellY + DIM_CELLA / 2, cellX + 5, cellY + DIM_CELLA - 5);
      }
    }
  }
}

function disegnaNumero(x, y, num, cellX, cellY) {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(DIM_CELLA * 0.5);
  text(num, cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2);
}

function controllaVittoria() {
  vittoria = true;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] != -1 && !scoperto[x][y]) {
        vittoria = false;
        return;
      }
    }
  }
}
