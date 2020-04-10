const SHIP_SIZE = 30;
const TURN_SPEED = 360;
const SHIP_THRUST = 5;
const FRICTION = 0.7;

function setup() {
  createCanvas(650, 450);
  H_width = width / 2;
  H_height = height / 2;
  ship = {
    x: H_width,
    y: H_height,
    r: SHIP_SIZE / 2,
    a: (90 / 180) * PI,
    rot: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
  };
}

function checkKeys() {
  if (keyIsDown(LEFT_ARROW)) {
    ship.rot = ((TURN_SPEED / 180) * PI) / fps;
  } else if (keyIsDown(RIGHT_ARROW)) {
    ship.rot = ((-TURN_SPEED / 180) * PI) / fps;
  }

  // thrust
  else if (keyIsDown(UP_ARROW)) {
    ship.thrusting = true;
  } else if (keyIsDown(DOWN_ARROW)) {
  }
}

// when our keys are released
function keyReleased() {
  print(keyCode);
  //when left and right keys are released, rotation should be 0
  if (keyCode === 37 || keyCode === 39) ship.rot = 0;
  //when up and down keys are released, thrust should be 0
  if (keyCode === 38 || keyCode === 40) ship.thrusting = false;
}

var ship;

const fps = 100; //not needed maybe

function draw() {
  background(0);
  noFill();
  strokeWeight(1.5);
  stroke(255);

  if (ship.thrusting) {
    // draw the thruster
    push();
    fill("red");
    stroke("yellow");
    strokeWeight(SHIP_SIZE / 10);
    triangle(
      //rear left
      ship.x - ship.r * ((2 / 3) * cos(ship.a) + 0.5 * sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * sin(ship.a) - 0.5 * cos(ship.a)),
      // REAR CENTER  behind the ship
      ship.x - ((ship.r * 5) / 3) * cos(ship.a),
      ship.y + ((ship.r * 5) / 3) * sin(ship.a),
      // rear right
      ship.x - ship.r * ((2 / 3) * cos(ship.a) - 0.5 * sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * sin(ship.a) + 0.5 * cos(ship.a))
    );

    pop(); //remove all styling

    ship.thrust.x += (SHIP_THRUST * cos(ship.a)) / fps;
    ship.thrust.y -= (SHIP_THRUST * sin(ship.a)) / fps;
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / fps;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / fps;
  }

  //drawing ship
  triangle(
    //nose of the ship
    ship.x + (4 / 3) * ship.r * cos(ship.a),
    ship.y - (4 / 3) * ship.r * sin(ship.a),
    // rear left
    ship.x - ship.r * ((2 / 3) * cos(ship.a) + sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * sin(ship.a) - cos(ship.a)),
    // rear right
    ship.x - ship.r * ((2 / 3) * cos(ship.a) - sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * sin(ship.a) + cos(ship.a))
  );

  if (ship.x < 0 - ship.r) ship.x = width + ship.r;
  else if (ship.x > width + ship.r) ship.x = 0 - ship.r;
  if (ship.y < 0 - ship.r) ship.y = height + ship.r;
  else if (ship.y > height + ship.r) ship.y = 0 - ship.r;

  // rotate the ship
  ship.a += ship.rot;

  //move the ship
  const { x, y } = ship.thrust;
  ship.x += x;
  ship.y += y;

  //if keyIsPressed then call a func. to do smthing about it
  if (keyIsPressed) checkKeys();
}
