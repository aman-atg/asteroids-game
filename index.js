let ship1;
let H_width, H_height;
function setup() {
  createCanvas(1280, 650);
  H_width = width / 2;
  H_height = height / 2;
}
// a single point class
//!  funcs :- show
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  show() {
    return [this.x, this.y];
  }
}
// Ship class to create our ship
// ! funcs :-
class Ship {
  constructor(x1, x2, y1, y2, z1, z2) {
    this.x1 = H_width;
    this.x2 = height / 2;
  }
}

function draw() {
  background(0);
  ship1 = new Ship();
  noFill();
  strokeWeight(1);
  stroke(255);
  translate(width / 2, height / 2);
  rotate(PI / 3.0);
  triangle(
    width / 2,
    height / 2,
    width / 2 - 20,
    height / 2 + 30,
    width / 2 + 20,
    height / 2 + 30
  );
  // print(23);
}
