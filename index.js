// SHIP
var ship;

// set up aestroids
var roids = [];

function setup() {
  createCanvas(650, 450);
  H_width = width / 2;
  H_height = height / 2;
  ship = newAirship();
  createAsteroidBelt();
}

function draw() {
  var exploding = ship.explodeTime > 0;
  background(0);
  noFill();
  strokeWeight(1.5);
  stroke(255);

  if (ship.thrusting) {
    drawThruster();

    ship.thrust.x += (SHIP_THRUST * cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * sin(ship.a)) / FPS;
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }
  if (!exploding) drawAirship();
  else {
    drawExplosion();
  }

  // handle edges of the screen
  if (ship.x < 0 - ship.r) ship.x = width + ship.r;
  else if (ship.x > width + ship.r) ship.x = 0 - ship.r;
  if (ship.y < 0 - ship.r) ship.y = height + ship.r;
  else if (ship.y > height + ship.r) ship.y = 0 - ship.r;

  // rotate the ship
  ship.a += ship.rot;

  // move the ship
  const { x, y } = ship.thrust;
  ship.x += x;
  ship.y += y;

  handleAsteroids();

  if (keyIsPressed) checkKeys();
}
