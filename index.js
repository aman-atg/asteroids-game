// SHIP
var ship;
// set up aestroids
var roids = [];
var level = 0;
var lives = GAME_LIVES;
var Text;
var score = 0;
var highScore;
// var pause = false;

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

  if (ship.thrusting && !ship.dead) {
    if (blinking) drawThruster();

    ship.thrust.x += (SHIP_THRUST * cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * sin(ship.a)) / FPS;
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }
  if (!exploding) {
    if (blinking && !ship.dead) drawAirship(ship.x, ship.y, ship.a);
    // if (!pause)
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
  if (ship.explodeTime == 0 && !ship.dead) {
    lives--;
    if (lives === 0) gameOver();
    else ship = newAirship();
  }

  handleAsteroids(exploding);

  drawLasers();

  if (keyIsPressed && !exploding && !ship.dead) checkKeys();

  drawText(exploding);
}
