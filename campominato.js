var DIM = 24;
var NUM_BOMBE = 88;
var DIM_CELLA = 30;
var griglia = [];
var scoperto = [];
var bandiera = [];
var gameOver = false;
var vittoria = false;
var gameFinished = false;
var bombeRimaste;
var bombPlacementMode = false; // Aggiunta variabile per gestire la modalità di posizionamento bombe

function setup() {
  canvasWidth = DIM * DIM_CELLA + 2; // Aggiunta compensazione per il bordo
  canvasHeight = DIM * DIM_CELLA + 2; // Aggiunta compensazione per il bordo
  var gameCanvas = createCanvas(canvasWidth, canvasHeight);
  gameCanvas.parent('gameCanvas');
  inizializzaGriglia();
  contaBombeVicine();
  bombeRimaste = NUM_BOMBE;

  var placeBombButton = select('#placeBombButton');
  placeBombButton.mousePressed(toggleBombPlacementMode);
}

function draw() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Bombe rimaste: " + bombeRimaste, width / 2, 20);
  mostraGriglia();
  controllaVittoria();
  if (gameOver || vittoria) {
    opacizzaGriglia();
    mostraPopup();
  }
}

function toggleBombPlacementMode() {
  bombPlacementMode = !bombPlacementMode;
  if (bombPlacementMode) {
    select('#placeBombButton').html('Esci dalla modalità');
  } else {
    select('#placeBombButton').html('Posiziona Bomba');
  }
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);
  
  if (!bombPlacementMode) { // Se non si è in modalità posizionamento bombe
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
      if (mouseButton == LEFT) {
        scopriCella(x, y);
      } else if (mouseButton == RIGHT) {
        if (!bandiera[x][y] && bombeRimaste > 0) {
          bandiera[x][y] = true;
          bombeRimaste--;
        }
      }
    }
  } else { // Se si è in modalità posizionamento bombe
    if (x >= 0 && x < DIM && y >= 0 && y < DIM && !scoperto[x][y]) {
      if (griglia[x][y] !== -1) {
        griglia[x][y] = -1;
        NUM_BOMBE--;
        if (NUM_BOMBE === 0) {
          toggleBombPlacementMode();
        }
      }
    }
  }
}
