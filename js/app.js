const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

const boardState = Array(tiles.length);
boardState.fill(null);

//Elements
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
const restart = document.getElementById("restart")
const incrementX = document.getElementById("button-incrementX")
const incrementO = document.getElementById("button-incrementO")
const decrementX = document.getElementById("button-decrementX")
const decrementO = document.getElementById("button-decrementO")
incrementX.addEventListener("click", function (event) {
  increment(event, "X");
});
decrementX.addEventListener("click", function (event) {
  decrement(event, "X");
});
incrementO.addEventListener("click", increment);
decrementO.addEventListener("click", decrement);
playAgain.addEventListener("click", startNewGame);
restart.addEventListener("click", startNewGame);
// Score buttons
let scoreX = 0;
let scoreO = 0;
function increment(event, bandera = "") {
  if (bandera == "X") {
    scoreX = scoreX + 1;
    document.getElementById("score-X").innerHTML = `Score: ${scoreX}`;
  } else {
    scoreO = scoreO + 1;
    document.getElementById("score-O").innerHTML = `Score: ${scoreO}`;
  }
}

function decrement(event, bandera = "") {
  if (bandera == "X") {
    scoreX = scoreX - 1;
    document.getElementById("score-X").innerHTML = `Score: ${scoreX}`;
  } else {
    scoreO = scoreO - 1;
    document.getElementById("score-O").innerHTML = `Score: ${scoreO}`;
  }
}
//Sounds
const gameOverSound = new Audio("sounds/game_over.wav");
const clickSound = new Audio("sounds/click.wav");

tiles.forEach((tile) => tile.addEventListener("click", tileClick));
function setHoverText() {
  //remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();
/**
 * Voice recognition
 */

const btnStart = document.getElementById('start-talk');
const btnStop = document.getElementById('stop-talk');
const texto = document.getElementById('texto');

const recognition = new webkitSpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
  // alert('comenzado a escuchar');
  const results = event.results;
  // console.log(results);
  const frase = results[results.length - 1][0].transcript;
  texto.value = frase;
}

recognition.onend = (event) => {
  // alert('Banana')
  let voz = texto.value
  // alert(voz.toLowerCase())
  switch (voz.toLowerCase()) {
    case 'a1':
      // alert("A1")
      tileVoiceSelect(tileID = "tile1", tileNumber = 1);
      break;
    case 'b1':
      // alert("B1");
      tileVoiceSelect(tileID = "tile2", tileNumber = 2);
      break;
    case 'a2':
      // alert("A2");
      tileVoiceSelect(tileID = "tile4", tileNumber = 4);
      break;
    case 'b2':
      // alert("B2");
      tileVoiceSelect(tileID = "tile5", tileNumber = 5);
      break;
    case 'a3':
      // alert("A3");
      tileVoiceSelect(tileID = "tile7", tileNumber = 7);
      break;
    case 'b3':
      // alert("B3");
      tileVoiceSelect(tileID = "tile8", tileNumber = 8);
      break;
    case 'c1':
      // alert("C1");
      tileVoiceSelect(tileID = "tile3", tileNumber = 3);
      break;
    case 'c2':
      // alert("C2");
      tileVoiceSelect(tileID = "tile6", tileNumber = 6);
      break;
    case 'c3':
      // alert("C3");
      tileVoiceSelect(tileID = "tile9", tileNumber = 9);
    default:
      break;
  }
}
btnStart.addEventListener('click', () => {
  recognition.start();
});


btnStop.addEventListener('click', () => {
  recognition.abort();
  // alert('ha dejado de escuchar');
});


function tileVoiceSelect(tileID = "", tileNumber = 1) {

  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  if (document.getElementById(tileID).innerHTML != "") {
    return;
  }

  if (turn === PLAYER_X) {
    document.getElementById(tileID).innerHTML = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
  } else {
    document.getElementById(tileID).innerHTML = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
  }

  clickSound.play();
  setHoverText();
  checkWinner();
}
// voice end
function tileClick(event, tile = event.target, tileNumber = tile.dataset.index) {

  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  if (tile.innerText != "") {
    return;
  }

  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
  } else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
  }

  clickSound.play();
  setHoverText();
  checkWinner();
}

function checkWinner() {
  //Check for a winner
  for (const winningCombination of winningCombinations) {
    //Object Destructuring
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  //Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
    if (winnerText === "X") {
      // alert("XD");
      increment(event, "X");
    }
    if (winnerText === "O") {
      // alert("Pantalones");
      // alert(winnerText);
      increment();
    }
  }
  

  // increment(bandera = "X");
  // increment(bandera = "X");
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  gameOverSound.play();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = PLAYER_X;
  setHoverText();
}

const winningCombinations = [
  //rows
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  //columns
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  //diagonals
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];