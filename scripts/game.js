// piece containers
var holding;
var current;
var next;
var blocks = [];

// background management variables
var descentDelay = 60;
var tick = 0;
var paused = false;

// returns a random tetris piece
function randomPiece() {
  
  // chooses a random number for picking pieces
  let rand = Math.floor( Math.random() * 7 );
  
  // find posiiton to find spawning piece
  let rows = Math.floor(canvas.height / scale);
  let x = round(scale*4, 1000);
  let y = round(canvas.height - (rows*scale) + 2, 1000);
  // rand = 1;

  // depending on the random number, spawn a new piece
  switch (rand) {
    case 0:
      return new PieceS(x, y);
    case 1:
      return new PieceZ(x, y);
    case 2:
      return new PieceL(x, y);
    case 3:
      return new PieceJ(x, y);
    case 4:
      return new PieceT(x, y);
    case 5:
      return new PieceO(x, y);
    case 6:
      return new PieceI(x, y);
    case 7:
      return new PieceL(x, y);
  }

}

// pauses/unpauses the game
function mediaToggle() {

  // set pause variable and update pause screen
  paused = (paused) ? false : true;
  document.querySelector('.pause-screen').classList.toggle('hidden');

  // update DOM element and draw or clear canvas accordingly
  if (paused) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('media').classList.replace('fa-pause', 'fa-play');
  } else {
    document.getElementById('media').classList.replace('fa-play', 'fa-pause');
    draw();
  }

}

// spawns new piece as current
function newCurrent() {

  // transfer current to list of blocks 
  for (let piece of current.pieces) {
    blocks.push(piece);
  }
  
  // transfer next to current, and make new block for next
  current = next;
  next = randomPiece();

  // set ready to false to prevent down arrow activity until down arrow is not held
  ready = false;

}

// tool to round numbers
function round(num, nth) {
  return Math.round(num * nth) / nth;
}