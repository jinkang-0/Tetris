// hold and next display
var holdDisplay = document.querySelector('.hold-display');
var nextDisplay = document.querySelector('.next-display');
var holdCtx = holdDisplay.getContext('2d');
var nextCtx = nextDisplay.getContext('2d');

// main game display
var canvas = document.querySelector('.game');
var c = canvas.getContext('2d');

// scale factor
var scale;

window.addEventListener('resize', () => {
  setup();
});

// setup
function setup() {

  // setup canvases
  canvas.width = window.innerWidth / 5;
  canvas.height = window.innerHeight - 10;
  holdDisplay.width = holdDisplay.height = window.innerWidth / 7;
  nextDisplay.width = nextDisplay.height = window.innerWidth / 7;
  scale = canvas.width / 10;

  // prep placeholders
  blocks = [];
  clearing = [];
  current = randomPiece();
  next = randomPiece();
  // holding = randomPiece();

}

setup();

// draw every 60fps
function draw() {

  // clear displays
  c.clearRect(0, 0, canvas.width, canvas.height);

  // show current block and side displays
  current.show();
  next.nextShow();
  if (holding != null) holding.holdShow();

  // show every block and detect for when block lands on the top of the screen
  for (let block of blocks) {
    block.show();
    if (block.y <= 0) {
      setup();
      mediaToggle();
      return;
    }
  }

  // constant tick timer to push current block down
  tick++;
  if (tick >= descentDelay) {
    moveCurrent(0, scale);
    tick = 0;
  }

  // loop if game is not paused
  if (!paused) requestAnimationFrame(draw);
}

draw();
mediaToggle();



/* 
  for showing current holding piece
*/
function sideDisplay(display, color) {

  // determine dimensions
  let cx = holdDisplay.width / 2;
  let cy = holdDisplay.height /2;
  let hScale = holdDisplay.width / 5;

  if (display == 'next') {
    hScale = nextDisplay.width / 5;
    cx = nextDisplay.width / 2;
    cy = nextDisplay.height / 2;
    nextCtx.clearRect(0, 0, nextDisplay.width, nextDisplay.height);
  } else {
    holdCtx.clearRect(0, 0, holdDisplay.width, holdDisplay.height);
  }

  // tool function to draw a square in side displays
  function drawSquare(x, y) {
    if (display == 'next') {
      nextCtx.fillStyle = "black";
      nextCtx.fillRect(x-1, y-1, hScale+2, hScale+2);
      nextCtx.fillStyle = color;
      nextCtx.fillRect(x+2, y+2, hScale-4, hScale-4);
    } else if (display == 'hold') {
      holdCtx.fillStyle = "black";
      holdCtx.fillRect(x-1, y-1, hScale+2, hScale+2);
      holdCtx.fillStyle = color;
      holdCtx.fillRect(x+2, y+2, hScale-4, hScale-4);
    }
  }
  
  // draw a piece depending on the color
  switch(color) {
    case 'cyan': // block I
      drawSquare(cx-hScale*2, cy-hScale/2);
      drawSquare(cx-hScale, cy-hScale/2);
      drawSquare(cx, cy-hScale/2);
      drawSquare(cx+hScale, cy-hScale/2);
      break;
    case 'orange': // block O
      drawSquare(cx-hScale, cy-hScale);
      drawSquare(cx-hScale, cy);
      drawSquare(cx, cy-hScale);
      drawSquare(cx, cy);
      break;
    case 'blue': // block Z
      drawSquare(cx-hScale/2, cy-hScale);
      drawSquare(cx-hScale*3/2, cy-hScale);
      drawSquare(cx-hScale/2, cy);
      drawSquare(cx+hScale/2, cy);
      break;
    case 'red': // block S
      drawSquare(cx-hScale*3/2, cy);
      drawSquare(cx-hScale/2, cy);
      drawSquare(cx-hScale/2, cy-hScale);
      drawSquare(cx+hScale/2, cy-hScale);
      break;
    case 'purple': // block L
      drawSquare(cx-hScale*3/2, cy);
      drawSquare(cx-hScale/2, cy);
      drawSquare(cx+hScale/2, cy);
      drawSquare(cx+hScale/2, cy-hScale);
      break;
    case 'green': // block J
      drawSquare(cx-hScale*3/2, cy-hScale);
      drawSquare(cx-hScale*3/2, cy);
      drawSquare(cx-hScale/2, cy);
      drawSquare(cx+hScale/2, cy);
      break;
    case 'yellow': // block T
      drawSquare(cx-hScale*3/2, cy);
      drawSquare(cx-hScale/2, cy);
      drawSquare(cx-hScale/2, cy-hScale);
      drawSquare(cx+hScale/2, cy);
      break;
  }

}