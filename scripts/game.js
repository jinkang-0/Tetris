// piece containers
var holding;
var current;
var next;
var blocks = [];

// background management variables
var descentDelay = 60;
var tick = 0;
var linesCleared = 0;
var paused = false;
var clearing = [];
var score = 0;
var topScore = 0;

// returns a random tetris piece
function randomPiece(num) {
  
  // chooses a random number for picking pieces
  let rand = Math.floor( Math.random() * 7 );
  
  // find posiiton to find spawning piece
  let rows = Math.floor(canvas.height / scale);
  let x = round(scale*4, 1000);
  let y = round(canvas.height - (rows*scale) + 2, 1000);
  // y -= scale;
  if (num != null) rand = num;

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

  ready = false;

  // check for line completion
  let lines = [];
  for (let piece of current.pieces) {
    let count = 0;
    for (let block of blocks) {
      if (block.y == piece.y) {
        count++;
      }
    }
    if (count >= 10 && !lines.includes(piece.y)) {
      lines.push(piece.y);
    }
  }

  if (lines.length > 0) {

    // remove lines
    for (let y of lines) {
      for (let block of blocks) {
        if (block.y >= y - scale/2 && block.y <= y + scale/2) {
          clearing.push(block);
        }
      }
      score += 100;
      linesCleared++;
      topScore = Math.max(score, topScore);
    }

    // change descent delay depending on lines cleared
    if (linesCleared > 100) {
      descentDelay = 10;
    } else if (linesCleared > 50) {
      descentDelay = 20;
    } else if (linesCleared > 30) {
      descentDelay = 30;
    } else if (linesCleared > 20) {
      descentDelay = 40;
    } else if (linesCleared > 10) {
      descentDelay = 50;
    }

    // halt
    paused = true;
    setTimeout( () => {
      
      // after a set time, clear lines and move blocks above down
      for (let clear of clearing) {
        removeFromArray(blocks, clear);
        for (let block of blocks) {
          if (block.x == clear.x && block.y < clear.y) {
            block.move(0, scale);
          }
        }
      }

      clearing = [];

      // resume
      paused = false;
      draw();
    }, 250);

  }

  // transfer next to current, and make new block for next
  current = next;
  next = randomPiece();

  // reset player variables
  holdCount = 0;

}

// tool to round numbers
function round(num, nth) {
  return Math.round(num * nth) / nth;
}

// tool to remove an element
function removeFromArray(arr, elem) {
  for (let i = arr.length; i >= 0; i--) {
    if (arr[i] === elem) {
      arr.splice(i, 1);
    }
  }
}