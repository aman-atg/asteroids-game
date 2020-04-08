const SHIP_SIZE = 30;

function setup() {
  createCanvas(1280, 650);
  H_width = width / 2;
  H_height = height / 2;
  ship = {
    x: H_width,
    y: H_height,
    r: SHIP_SIZE / 2,
    a: (90 / 180) * PI,
  };
}

var ship;

const fps = 30; //not needed maybe

function draw() {
  background(0);
  noFill();
  strokeWeight(1);
  stroke(255);
  //drawing ship
  triangle(
    ship.x + ship.r * cos(ship.a),
    ship.y - ship.r * sin(ship.a),
    ship.x - ship.r * (cos(ship.a) + sin(ship.a)),
    ship.y + ship.r * (sin(ship.a) - cos(ship.a)),
    ship.x - ship.r * (cos(ship.a) - sin(ship.a)),
    ship.y + ship.r * (sin(ship.a) + cos(ship.a))
  );
  ship.a += 1 / fps;
}
