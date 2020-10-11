// to prevent previous arrow function affecting new current
var ready = true;

// listen to when keys are pressed
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (!paused) moveCurrent(-scale, 0);
      toggleKey('arrow-left', true);
      break;
    case "ArrowUp":
      if (!paused) current.turn();
      toggleKey('arrow-up', true);
      break;
    case "ArrowRight":
      if (!paused) moveCurrent(scale, 0);
      toggleKey('arrow-right', true);
      break;
    case "ArrowDown":
      if (!paused && ready) moveCurrent(0, scale);
      toggleKey('arrow-down', true);
      break;
    case " ":
      toggleKey('spacebar', true);
      break;
    case "x":
      toggleKey('x-key', true);
      break;
    case "c":
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
      toggleKey('spacebar', false);
      break;
    case "x":
      toggleKey('x-key', false);
      break;
    case "c":
      toggleKey('c-key', false);
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
function moveCurrent(x, y) {

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
  if (min + x < 0 || max + x >= canvas.width) return;

  // check collision before moving
  for (let piece of current.pieces) {

    let px = piece.x + x;
    let py = piece.y + y;

    // check collision with other blocks
    for (let block of blocks) {
      if (piece.x == block.x && piece.y < block.y && py >= block.y) {
        newCurrent();
        return;
      } else if (piece.y == block.y && (px >= block.x - scale/2 && px <= block.x + scale/2)) {
        return;
      }
    }

    // check collision with ground floor
    if (py >= canvas.height) {
      newCurrent();
      return;
    }

  }

  // move current
  for (let piece of current.pieces) {
    piece.move(x, y);
  }

}