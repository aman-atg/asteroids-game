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
var noSound = false;

let explode_S, laser_S, music_high_S, music_low_S, thrust_S;

function preload() {
  explode_S = loadSound("./../../public/sounds/Explosion+1.mp3");
  hit_S = loadSound("./../../public/sounds/hit.m4a");
  laser_S = loadSound("./../../public/sounds/laser.m4a");
  music_high_S = loadSound("./../../public/sounds/music-high.m4a");
  music_low_S = loadSound("./../../public/sounds/music-low.m4a");
  thrust_S = loadSound("./../../public/sounds/thrust.m4a");
  laser_S.playMode("sustain");
  laser_S.setVolume(0.5);
  explode_S.setVolume(0.5);
}

function setup() {
  createCanvas(windowWidth, windowHeight - 25);
  // music_low_S.loop(); //wroking fine
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
    if (blinking) {
      drawThruster();
      if (!thrust_S.isPlaying()) thrust_S.loop();
    }

    ship.thrust.x += (SHIP_THRUST * cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * sin(ship.a)) / FPS;
  } else {
    thrust_S.stop();

    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }
  if (!exploding) {
    if (blinking && !ship.dead) drawAirship(ship.x, ship.y, ship.a);
    // if (!pause)
    moveShip();
  } else {
    explode_S.play();
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
