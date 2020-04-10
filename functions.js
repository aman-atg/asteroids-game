// ======== MAKING NEW AIRSHIP =========
const newAirship = () => ({
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
});

// =========== KEY-CONTROLS ============
function checkKeys() {
  // left and right
  if (keyIsDown(LEFT_ARROW)) {
    ship.rot = ((TURN_SPEED / 180) * PI) / FPS;
  } else if (keyIsDown(RIGHT_ARROW)) {
    ship.rot = ((-TURN_SPEED / 180) * PI) / FPS;
  }
  // thrust
  else if (keyIsDown(UP_ARROW)) {
    ship.thrusting = true;
  }
}

// when keys are released
function keyReleased() {
  //when left and right keys are released, rotation should be 0
  if (keyCode === 37 || keyCode === 39) ship.rot = 0;
  //when up is released, thrust should be 0
  if (keyCode === 38) ship.thrusting = false;
}

// ================== >> DRAWING FUNCTIONS << ==================    

// ====== DRAW AIRSHIP ======
const drawAirship = () => {
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
};

// ====== DRAW THRUSTER =======
const drawThruster = () => {
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
};
