// player controller variables
var ready = true;
var holdCount = 0;

// listen to when keys are pressed
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (!paused) moveCurrent(-scale, 0);
      toggleKey('arrow-left', true);
      break;
    case "ArrowUp":
      if (!paused) current.turn(false);
      toggleKey('arrow-up', true);
      break;
    case "ArrowRight":
      if (!paused) moveCurrent(scale, 0);
      toggleKey('arrow-right', true);
      break;
    case "ArrowDown":
      if (!paused && ready) moveCurrent(0, scale, 1);
      toggleKey('arrow-down', true);
      break;
    case " ":
      if (!paused && ready) hardDrop();
      toggleKey('spacebar', true);
      break;
    case "z":
      if (!paused) current.turn(true);
      toggleKey('z-key', true);
      break;
    case "c":
      if (!paused) hold();
      toggleKey('c-key', true);
      break;
  }
});

// detect for when keys aren't pressed
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case "ArrowLeft":
      toggleKey('arrow-left', false);
      break;
    case "ArrowUp":
      toggleKey('arrow-up', false);
      break;
    case "ArrowRight":
      toggleKey('arrow-right', false);
      break;
    case "ArrowDown":
      ready = true;
      toggleKey('arrow-down', false);
      break;
    case " ":
      ready = true;
      toggleKey('spacebar', false);
      break;
    case "z":
      toggleKey('z-key', false);
      break;
    case "c":
      toggleKey('c-key', false);
      break;
    case "Escape":
      mediaToggle();
      break;
  }
});

// set key display to be lit up or not
function toggleKey(id, setActive) {
  let key = document.getElementById(id);
  if (setActive) {
    key.classList.add('active');
  } else {
    key.classList.remove('active');
  }
}

// moves the current, controllable piece
function moveCurrent(x, y, scoreFactor) {

  // find leftmost, rightmost, and deepest piece for checking constraints
  let min = Infinity;
  let max = -Infinity;
  let deepest = -Infinity;
  for (let piece of current.pieces) {
    min = Math.min(min, piece.x);
    max = Math.max(max, piece.x);
    deepest = Math.max(deepest, piece.y);
  }
  
  // check constraints
  if (min + x < 0 || max + x >= canvas.width) return true;

  // check collision before moving
  for (let piece of current.pieces) {

    let px = piece.x + x;
    let py = piece.y + y;

    // check collision with other blocks
    for (let block of blocks) {
      if (piece.x == block.x && py <= block.y + scale/2 && py >= block.y - scale/2) {
        newCurrent();
        return true;
      } else if (piece.y == block.y && px >= block.x - scale/2 && px <= block.x + scale/2) {
        return true;
      } //else if (piece.y >= block.y - scale/2 && piece.y <= block.y + scale/2
      //   && piece.x >= block.x - scale/2 && piece.x <= block.x + scale/2) {
      //   newCurrent();
      //   return true;
      // }
    }

    // check collision with ground floor
    if (py >= canvas.height) {
      newCurrent();
      return true;
    }

  }

  // add score
  if (y > 0 && scoreFactor != null) {
    score += 10 * scoreFactor;
    topScore = Math.max(score, topScore);
  }

  // move current
  for (let piece of current.pieces) {
    piece.move(x, y);
  }

}

// hold function
function hold() {

  if (holdCount > 0) return;

  // create a copy
  let copy;
  switch (current.pieces[0].color) {
    case 'red': // block S
      copy = randomPiece(0);
      break;
    case 'blue': // block Z
      copy = randomPiece(1);
      break;
    case 'purple': // block L
      copy = randomPiece(2);
      break;
    case 'green': // block J
      copy = randomPiece(3);
      break;
    case 'yellow': // block T
     copy = randomPiece(4);
      break;
    case 'orange': // block O
      copy = randomPiece(5);
      break;
    case 'cyan': // block I
      copy = randomPiece(6);
      break;
  }

  if (holding) {
    current = holding;
  } else {
    current = next;
    next = randomPiece();
  }

  holding = copy;
  holdCount++;

}

// moves current block to bottom
function hardDrop() {

  // drop
  let slammed = false;
  while (!slammed) {
    slammed = moveCurrent(0, scale, 2);
  }

  // update variables
  ready = false;

}