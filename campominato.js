let DIM = 10; // Dimensione della griglia (10x10)
let DIM_CELLA = 40; // Dimensione di ogni cella
let griglia = [];
let bandiera = [];
let bombeRimaste;
let vittoria = false;
let gameOver = false;
let currentAction = "discover"; // Azione corrente: "discover" (scopri) o "flag" (piazza bandiera)

function setup() {
  createCanvas(windowWidth, windowHeight);
  riavviaGioco();
}

function draw() {
  background(220);

  // Disegna la griglia
  let offsetX = (width - DIM * DIM_CELLA) / 2;
  let offsetY = (height - DIM * DIM_CELLA) / 2;
  translate(offsetX, offsetY);

  for (let x = 0; x < DIM; x++) {
    for (let y = 0; y < DIM; y++) {
      let cellaX = x * DIM_CELLA;
      let cellaY = y * DIM_CELLA;

      if (griglia[x][y] === -1) {
        fill(0);
      } else if (griglia[x][y] > 0) {
        fill(200);
      } else {
        fill(255);
      }

      rect(cellaX, cellaY, DIM_CELLA, DIM_CELLA);

      if (bandiera[x][y]) {
        fill(255, 0, 0);
        triangle(cellaX + DIM_CELLA * 0.5, cellaY + DIM_CELLA * 0.2,
                 cellaX + DIM_CELLA * 0.2, cellaY + DIM_CELLA * 0.8,
                 cellaX + DIM_CELLA * 0.8, cellaY + DIM_CELLA * 0.8);
      }

      if (griglia[x][y] > 0) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(griglia[x][y], cellaX + DIM_CELLA / 2, cellaY + DIM_CELLA / 2);
      }
    }
  }

  if (gameOver || vittoria) {
    mostraPopup();
  }
}

function riavviaGioco() {
  griglia = [];
  bandiera = [];
  vittoria = false;
  gameOver = false;
  bombeRimaste = DIM;

  for (let x = 0; x < DIM; x++) {
    griglia[x] = [];
    bandiera[x] = [];
    for (let y = 0; y < DIM; y++) {
      griglia[x][y] = 0;
      bandiera[x][y] = false;
    }
  }

  piazzaBombe();
  calcolaNumeri();
}

function piazzaBombe() {
  let bombePiazzate = 0;

  while (bombePiazzate < DIM) {
    let x = floor(random(DIM));
    let y = floor(random(DIM));

    if (griglia[x][y] === 0) {
      griglia[x][y] = -1; // -1 rappresenta una bomba
      bombePiazzate++;
    }
  }
}

function calcolaNumeri() {
  for (let x = 0; x < DIM; x++) {
    for (let y = 0; y < DIM; y++) {
      if (griglia[x][y] === -1) {
        continue;
      }

      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let nx = x + i;
          let ny = y + j;
          if (nx >= 0 && ny >= 0 && nx < DIM && ny < DIM && griglia[nx][ny] === -1) {
            count++;
          }
        }
      }
      griglia[x][y] = count;
    }
  }
}

function scopriCella(x, y) {
  if (griglia[x][y] === -1) {
    gameOver = true;
  } else if (griglia[x][y] > 0) {
    // Scopri solo la cella corrente
    griglia[x][y] = griglia[x][y];
  } else {
    // Scopri tutte le celle adiacenti finché non incontri celle con numeri
    floodFill(x, y);
  }

  // Controlla se hai vinto
  if (controllaVittoria()) {
    vittoria = true;
  }
}

function floodFill(x, y) {
  if (x < 0 || y < 0 || x >= DIM || y >= DIM || griglia[x][y] !== 0) {
    return;
  }

  griglia[x][y] = -2; // Segna come scoperta

  floodFill(x + 1, y);
  floodFill(x - 1, y);
  floodFill(x, y + 1);
  floodFill(x, y - 1);
}

function controllaVittoria() {
  for (let x = 0; x < DIM; x++) {
    for (let y = 0; y < DIM; y++) {
      if (griglia[x][y] >= 0 && !bandiera[x][y]) {
        return false;
      }
    }
  }
  return true;
}

function mostraPopup() {
  var popupWidth = windowWidth * 0.8; // 80% della larghezza dello schermo
  var popupHeight = windowHeight * 0.4; // 40% dell'altezza dello schermo
  var popupX = (windowWidth - popupWidth) / 2;
  var popupY = (windowHeight - popupHeight) / 2;

  // Disegna il rettangolo nero
  fill(0);
  rect(popupX, popupY, popupWidth, popupHeight, 20); // Angoli arrotondati

  // Testo centrale ("Hai perso!" o "Hai vinto!")
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(windowWidth * 0.05); // 5% della larghezza dello schermo per il testo
  var messaggio = gameOver ? "Hai perso!" : "Hai vinto!";
  text(messaggio, popupX + popupWidth / 2, popupY + popupHeight / 3);

  // Dimensioni e posizione del pulsante "Rigioca"
  var buttonWidth = popupWidth * 0.4; // 40% della larghezza del popup
  var buttonHeight = popupHeight * 0.2; // 20% dell'altezza del popup
  var buttonX = popupX + (popupWidth - buttonWidth) / 2;
  var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02; // Margine inferiore di 2% dell'altezza dello schermo

  fill(178, 34, 34);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10); // Angoli arrotondati

  // Testo del pulsante "Rigioca"
  fill(255);
  textSize(windowWidth * 0.04); // 4% della larghezza dello schermo per il testo del pulsante
  text("Rigioca", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);

  if (gameOver || vittoria) {
    var popupWidth = windowWidth * 0.8;
    var popupHeight = windowHeight * 0.4;
    var popupX = (windowWidth - popupWidth) / 2;
    var popupY = (windowHeight - popupHeight) / 2;

    var buttonWidth = popupWidth * 0.4;
    var buttonHeight = popupHeight * 0.2;
    var buttonX = popupX + (popupWidth - buttonWidth) / 2;
    var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02;

    if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      riavviaGioco();
    }
  } else if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (currentAction == "discover") {
      scopriCella(x, y);
    } else if (currentAction == "flag") {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Ridimensiona la tela se la finestra viene ridimensionata
}
