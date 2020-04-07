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
  beginShape();
  //nose of the ship
  vertex(ship.x + ship.r * cos(ship.a), ship.y - ship.r * sin(ship.a));
  // rear left
  vertex(
    ship.x - ship.r * (cos(ship.a) + sin(ship.a)),
    ship.y + ship.r * (sin(ship.a) - cos(ship.a))
  );
  // rear right

  vertex(
    ship.x - ship.r * (cos(ship.a) - sin(ship.a)),
    ship.y + ship.r * (sin(ship.a) + cos(ship.a))
  );

  endShape(CLOSE);
}
