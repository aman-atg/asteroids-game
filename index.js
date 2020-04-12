// SHIP
var ship;
// set up aestroids
var roids = [];
var level = 0;
var Text;

function setup() {
  createCanvas(650, 450);
  H_width = width / 2;
  H_height = height / 2;
  newGame();
}

function draw() {
  var exploding = ship.explodeTime > 0;
  var blinking = ship.blinkNum % 2 == 0;
  background(0);
  noFill();
  strokeWeight(1.5);
  stroke(255);

  if (ship.thrusting) {
    if (blinking) drawThruster();

    ship.thrust.x += (SHIP_THRUST * cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * sin(ship.a)) / FPS;
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }
  if (!exploding) {
    if (blinking) drawAirship();
    moveShip();
  } else {
    drawExplosion();
  }
  if (ship.blinkNum > 0) {
    ship.blinkTime--;
    if (ship.blinkTime == 0) {
      ship.blinkTime = ceil(SHIP_BLINK_DUR * FPS);
      ship.blinkNum--;
    }
  }

  ship.explodeTime--;
  if (ship.explodeTime == 0) ship = newAirship();

  handleAsteroids(exploding);

  drawLasers();
  if (keyIsPressed && !exploding) checkKeys();
  drawText();
}
