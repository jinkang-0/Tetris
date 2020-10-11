class Piece {

  constructor() {
    this.pieces = [];
  }

  show() {
    for (let piece of this.pieces) {
      piece.show();
    }
  }

  nextShow() {
    sideDisplay('next', this.pieces[0].color);
  }

  holdShow() {
    sideDisplay('hold', this.pieces[0].color);
  }

  rotate(inverse) {
    // find pivot block
    let pivot = this.pieces[0];
    let movements = [];
    
    // loop for every other block
    for (let i = 1; i < this.pieces.length; i++) {
      let orbiter = this.pieces[i];
      let x = scale; 
      let y = scale;
      
      // if rotating block is above or below
      if (orbiter.x == pivot.x) {
      
        // set movement accordingly
        if (orbiter.y < pivot.y - scale - 1)       { x = y *= 2; }
        else if (orbiter.y > pivot.y + scale + 1)  { x = y *= -2; } 
        else if (orbiter.y > pivot.y)              { x = y *= -1; }
      
      // if rotating block is to the side
      } else if (orbiter.y == pivot.y) {

        // set movement accordingly
        if (orbiter.x < pivot.x - scale - 1)       { x = y *= 2; }
        else if (orbiter.x < pivot.x)              { y *= -1; }
        else if (orbiter.x > pivot.x + scale + 1)  { x = y *= -2; }
        else if (orbiter.x > pivot.x)              { x *= -1; }

      // if rotating block is diagonally adjacent on the right
      } else if (orbiter.x > pivot.x) {

        if (orbiter.y < pivot.y) { 
          x = 0;
          y *= 2;
        } else if (orbiter.y > pivot.y) {
          x *= -2;
          y = 0;
        }
        
      // if rotating block is diagonally adjacent on the left
      } else if (orbiter.x < pivot.x) {

        if (orbiter.y < pivot.y) {
          x *= 2;
          y = 0;
        } else if (orbiter.y > pivot.y) {
          x = 0;
          y *= -2;
        }

      }

      // act depending on inverse rotation or not
      if (inverse) {
        // collision checks
        let px = orbiter.x - y;
        let py = orbiter.y + x;

        // restraints
        if (px < 0 || px >= canvas.width || py > canvas.height) return;

        // collision check with other blocks
        for (let block of blocks) {
          if (px >= block.x - scale/2 && px <= block.x + scale/2
            && py >= block.y - scale/2 && py <= block.y + scale/2) {
            return;
          }
        }

        // if no collisions, add it to pending list of rotating blocks
        movements.push([-y, x]);
      } else {
        // collision checks
        let px = orbiter.x + x;
        let py = orbiter.y + y;

        // check restraints
        if (px < 0 || px >= canvas.width || py > canvas.height) return;
        
        // check collision with other blocks
        for (let block of blocks) {
          if (px >= block.x - scale/2 && px <= block.x + scale/2
            && py >= block.y - scale/2 && py <= block.y + scale/2) {
            return;
          }
        }

        // if no collisions, add to pending list
        movements.push([x, y]);
      }

    }

    // if no collisions are detected, turn this piece
    for (let i = 0; i < movements.length; i++) {
      this.pieces[i+1].move( movements[i][0], movements[i][1] );
    }

    return true;

  }

  findDeepest() {
    let depth = -Infinity;
    for (let piece of this.pieces) {
      depth = Math.max(depth, piece.y);
    }
    return depth;
  }

}

class PieceI extends Piece {

  constructor(x, y) {
    super();

    // pieces
    this.pieces.push( new Square(x, y, 'cyan') );
    this.pieces.push( new Square(x-scale, y, 'cyan') );
    this.pieces.push( new Square(x+scale, y, 'cyan') );
    this.pieces.push( new Square(x+scale*2, y, 'cyan') );

    // rounding for accuracy (yes, js is weird)
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    this.rotate();
  }

}

class PieceO extends Piece {

  constructor(x, y) {
    super();

    // pieces
    this.pieces.push( new Square(x, y, 'orange') );
    this.pieces.push( new Square(x, y-scale, 'orange') );
    this.pieces.push( new Square(x+scale, y, 'orange') );
    this.pieces.push( new Square(x+scale, y-scale, 'orange') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    return;
  }

}

class PieceT extends Piece {

  constructor(x, y) {
    super();

    // pieces
    this.pieces.push( new Square(x, y, 'yellow') );
    this.pieces.push( new Square(x-scale, y, 'yellow') );
    this.pieces.push( new Square(x+scale, y, 'yellow') );
    this.pieces.push( new Square(x, y-scale, 'yellow') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    this.rotate();
  }

}

class PieceZ extends Piece {

  constructor(x, y) {
    super();
    this.rotation = 0;
    
    // pieces
    this.pieces.push( new Square(x, y-scale, 'blue') );
    this.pieces.push( new Square(x, y, 'blue') );
    this.pieces.push( new Square(x+scale, y, 'blue') );
    this.pieces.push( new Square(x-scale, y-scale, 'blue') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    if (this.rotation == 0) {
      
      new Promise( (resolve, reject) => {
        if ( this.rotate(true) ) {
          resolve();
        } else {
          reject();
        }
      })
      .then( () => { this.rotation++ })
      .catch( () => { return; });

    } else if (this.rotation == 1) {

      new Promise( (resolve, reject) => {
        if (this.rotate()) {
          resolve();
        } else {
          reject();
        }
      })
      .then( () => { this.rotation = 0; })
      .catch( () => { return; });

    }
  }

}

class PieceS extends Piece {

  constructor(x, y) {
    super();
    this.rotation = 0;

    // pieces
    this.pieces.push( new Square(x, y-scale, 'red') );
    this.pieces.push( new Square(x-scale, y, 'red') );
    this.pieces.push( new Square(x, y, 'red') );
    this.pieces.push( new Square(x+scale, y-scale, 'red') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    if (this.rotation == 0) {
      
      new Promise( (resolve, reject) => {
        if (this.rotate()) {
          resolve();
        } else {
          reject();
        }
      })
      .then( () => { this.rotation++; })
      .catch( () => { return; });

    } else if (this.rotation == 1) {
      
      new Promise( (resolve, reject) => {
        if ( this.rotate(true) ) {
          resolve();
        } else {
          reject();
        }
      })
      .then( () => { this.rotation = 0; })
      .catch( () => { return; });

    }
  }

}

class PieceJ extends Piece {

  constructor(x, y) {
    super();

    // pieces
    this.pieces.push( new Square(x, y, 'green') );
    this.pieces.push( new Square(x-scale, y-scale, 'green') );
    this.pieces.push( new Square(x-scale, y, 'green') );
    this.pieces.push( new Square(x+scale, y, 'green') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    this.rotate();
  }

}

class PieceL extends Piece {
  
  constructor(x, y) {
    super();

    // pieces
    this.pieces.push( new Square(x, y, 'purple') );
    this.pieces.push( new Square(x-scale, y, 'purple') );
    this.pieces.push( new Square(x+scale, y, 'purple') );
    this.pieces.push( new Square(x+scale, y-scale, 'purple') );

    // rounding for accuracy
    for (let piece of this.pieces) {
      piece.x = round(piece.x, 1000);
      piece.y = round(piece.y, 1000);
    }

  }

  turn() {
    this.rotate();
  }

}

//
// basic square
//

class Square {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  show() {
    c.fillStyle = "black";
    c.fillRect(this.x-1, this.y-1, scale+2, scale+2);
    c.fillStyle = this.color;
    c.fillRect(this.x+2, this.y+2, scale-4, scale-4);
  }

  move(x, y) {
    let rx = this.x + x;
    let ry = this.y + y;
    this.x = round(rx, 1000);
    this.y = round(ry, 1000);
  }
}