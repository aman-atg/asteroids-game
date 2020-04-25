// ===== START NEW GAME ======
const newGame = () => {
  ship = newAirship();

  if (lsTest()) {
    var scoreStr = localStorage.getItem(HIGHSCORE_KEY);
    if (scoreStr == null) highScore = 0;
    else highScore = parseInt(scoreStr);
  } else {
    print("fdsk");
  }

  newLevel();
};
// ===== NEW LEVEL =====

const newLevel = () => {
  Text = "Level " + (level + 1);
  textOpc = 255;
  createAsteroidBelt();
  if (lives === 0) gameOver();
};

// ===== GAME OVER ======
const gameOver = () => {
  ship.dead = true;
  Text = "Game Over";
  textOpc = 255;
  score = 0;
  // stop();
};

// ======== MAKING NEW AIRSHIP =========
const newAirship = () => ({
  x: H_width,
  y: H_height,
  r: SHIP_SIZE / 2,
  a: (90 / 180) * PI,
  blinkNum: SHIP_INV_DUR / SHIP_BLINK_DUR,
  blinkTime: ceil(SHIP_BLINK_DUR * FPS),
  canShoot: true,
  dead: false,
  explodeTime: 0,
  lasers: [],
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
});

// ======== MOVE SHIP =========
const moveShip = () => {
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
};

// ====== EXPLODE THE SHIP =======
const explodeShip = () => {
  ship.explodeTime = ceil(SHIP_EXPLODE_DUR * FPS);
};

// ====== SHOOT LASERS =======
const shootLaser = () => {
  if (ship.canShoot && ship.lasers.length < LASER_MAX) {
    laser_S.play();

    ship.lasers.push({
      x: ship.x + (4 / 3) * ship.r * cos(ship.a),
      y: ship.y - (4 / 3) * ship.r * sin(ship.a),
      xv: (LASER_SPD * cos(ship.a)) / FPS,
      yv: -(LASER_SPD * sin(ship.a)) / FPS,
      dist: 0,
      explodeTime: 0,
    });
  }
  ship.canShoot = false;
};

// ====== MOVE LASERS =======
const moveLasers = laser => {
  const { x, y, xv, yv, dist } = laser;

  // remove lasers after travelling a certain distance
  if (dist > LASER_DIST * width) {
    removeLaser(laser);
    return;
  }

  laser.x += xv;
  laser.y += yv;

  // dist travelled
  laser.dist += sqrt(pow(xv, 2) + pow(yv, 2));

  // handle edge of screen
  if (x < 0) laser.x = width;
  else if (x > width) laser.x = 0;
  if (y < 0) laser.y = height;
  else if (y > height) laser.y = 0;
};

// ====== DESTRUCTION =======
const destruction = () => {
  roids.map(roid => {
    // asteriod props
    const { x, y, r } = roid;

    // lasers
    ship.lasers.map(laser => {
      if (laser.explodeTime == 0 && dist(laser.x, laser.y, x, y) < r) {
        destroyAsteroid(roid);
        laser.explodeTime = ceil(LASER_EXPLODE_DUR * FPS);
      }
    });
  });
};
const removeLaser = laser => {
  ship.lasers = ship.lasers.filter(l => l != laser);
};

// ====== DESTROY ASTEROIDS =======
const destroyAsteroid = roid => {
  var { x, y, r } = roid;
  const R = ROIDS_SIZE / 2;

  hit_S.play();
  // split the asteroid in two
  if (r === ceil(R)) {
    roids.push(newAsteroid(x, y, ceil(R / 2)));
    roids.push(newAsteroid(x, y, ceil(R / 2)));
    score += ROIDS_PTS_LRG;
  } else if (r === ceil(R / 2)) {
    roids.push(newAsteroid(x, y, ceil(R / 4)));
    roids.push(newAsteroid(x, y, ceil(R / 4)));
    score += ROIDS_PTS_MED;
  }
  score += ROIDS_PTS_SML;
  if (score > highScore) {
    highScore = score;
    if (lsTest()) localStorage.setItem(HIGHSCORE_KEY, highScore);
  }
  // destory it
  roids = roids.filter(r => r != roid);
  if (roids.length === 0) {
    level++;
    // if (lives === 1) {
    setTimeout(() => {
      newGame();
    }, 1000);
    // } else newGame();
  }
};

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
  // for simultaneously shooting while moving
  if (keyCode === 32) {
    shootLaser();
    ship.canShoot = false;
  }
}

// when keys are released
function keyReleased() {
  //when left and right keys are released, rotation should be 0
  if (keyCode === 37 || keyCode === 39) ship.rot = 0;
  //when up is released, thrust should be 0
  if (keyCode === 38) {
    ship.thrusting = false;
  }

  if (keyCode === 32) ship.canShoot = true;

  if (keyCode === ENTER) {
    print("ok");
    noSound = !noSound;
    controlSound(noSound);
  }
}

// ====== CHECKING LOCALHOST ======
function lsTest() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// ======= CREATE ASTROID-BELT =======
const createAsteroidBelt = () => {
  var x, y;
  for (var i = 0; i < ASTEROIDS_NUM + ceil(level * 1.33); i++) {
    do {
      x = floor(random() * width);
      y = floor(random() * height);
    } while (dist(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r); // asteroids should not overlap with our ship on inital setup

    roids.push(newAsteroid(x, y, ceil(ROIDS_SIZE / 2)));
  }
};

controlSound = noSound => {
  if (noSound) {
    masterVolume(0);
  } else {
    masterVolume(1);
  }
};

// ====== CREATE ONE ASTROID =====
const newAsteroid = (x, y, r) => {
  var spdInc = 1 + 0.1 * level;
  var roid = {
    x,
    y,
    xv: (random(ROIDS_SPD) / FPS) * spdInc * (random() < 0.5 ? 1 : -1),
    yv: (random(ROIDS_SPD) / FPS) * spdInc * (random() < 0.5 ? 1 : -1),
    r,
    a: random(PI * 2),
    vert: random(ROIDS_VERT) + 1 + ROIDS_VERT / 2,
    offs: [],
  };
  // create vertex offsets array
  for (var i = 0; i < roid.vert; i++) {
    roid.offs.push(random(ROIDS_JAG * 2) + 1 - ROIDS_JAG);
  }
  return roid;
};

// ======= MOVE ASTEROIDS =========
const moveAsteroids = roid => {
  var { xv, yv, x, y, r } = roid;

  roid.x += xv;
  roid.y += yv;
  // handle edge of screen
  // x-dir
  if (x < 0 - r) {
    roid.x = width + r;
  } else if (x > width + r) {
    roid.x = 0 - r;
  }
  // y-dir
  if (y < 0 - r) {
    roid.y = height + r;
  } else if (y > height + r) {
    roid.y = 0 - r;
  }
};

// ======= HANDLE ASTEROIDS =========
const handleAsteroids = e => {
  drawAsteroids(e);
};

// ================== >> DRAW FUNCTIONS << ==================


// ===== DRAW TEXT ======
const drawText = e => {
  var textColor = color(255, 255, 255);

  push();
  noStroke();
  fill(textColor);
  if (Text === "Game Over") textSize(TEXT_SIZE * 1.5);
  else textSize(TEXT_SIZE);
  //high score
  push();
  textAlign(CENTER, CENTER);
  textSize(TEXT_SIZE * 0.75);

  if (highScore === undefined) highScore = 0;
  text("BEST " + highScore, H_width, SHIP_SIZE);

  pop();

  // score
  textAlign(RIGHT, CENTER);
  if (lives !== 0) text(score, width - SHIP_SIZE / 2, SHIP_SIZE);
  // game instructions
  if (textOpc >= 0) {
    textAlign(CENTER, CENTER);
    textColor.setAlpha(textOpc);
    textOpc -= 255 / TEXT_FADE_TIME / FPS;
    fill(textColor);
    text(Text, H_width, height * 0.73);
  } else if (ship.dead) {
    lives = 3;
    level = 0;
    roids = [];
    newGame();
  }
  pop();

  var lifeColor;
  for (var i = 0; i < lives; i++) {
    lifeColor = e && i === lives - 1 ? "red" : "white";
    drawAirship(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, HALF_PI, lifeColor);
  }
};


// ====== DRAW AIRSHIP ======
const drawAirship = (x, y, a, color = "white") => {
  const { r } = ship;
  stroke(color);
  triangle(
    //nose of the ship
    x + (4 / 3) * r * cos(a),
    y - (4 / 3) * r * sin(a),
    // rear left
    x - r * ((2 / 3) * cos(a) + sin(a)),
    y + r * ((2 / 3) * sin(a) - cos(a)),
    // rear right
    x - r * ((2 / 3) * cos(a) - sin(a)),
    y + r * ((2 / 3) * sin(a) + cos(a))
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

// ====== DRAW LASER =======
const drawLasers = () => {
  push();
  fill("salmon");

  ship.lasers.map(laser => {
    const { x, y } = laser;

    if (laser.explodeTime > 0) {
      laser.explodeTime--;
      laserExplosion(laser);
      if (laser.explodeTime == 0) removeLaser(laser);
    } else {
      circle(x, y, SHIP_SIZE / 15);
      // if (!pause)
      moveLasers(laser);
    }

    destruction();
  });
  pop();
};

// ====== LASER-EXPLOSION =======

const laserExplosion = laser => {
  const { x, y } = laser;
  const { r } = ship;
  push();
  noStroke();
  fill("orangered");
  circle(x, y, r * 1.75);
  fill("salmon");
  circle(x, y, r * 1.15);
  fill("pink");
  circle(x, y, r * 0.75);

  pop();
};

// ====== DRAW EXPLOSION =======

const drawExplosion = () => {
  const { x, y, r } = ship;
  push();
  noStroke();

  fill("darkred");
  circle(x, y, r * 3.9);
  fill("red");
  circle(x, y, r * 3.6);
  fill("orange");
  circle(x, y, r * 2.2);
  fill("yellow");
  circle(x, y, r * 1.6);
  fill("white");
  circle(x, y, r * 0.7);

  pop();
};

// ====== DRAW ASTEROIDS =======
const drawAsteroids = exploding => {
  push();
  strokeWeight(SHIP_SIZE / 20);
  stroke("slategrey");

  roids.map(roid => {
    // getting all variables from roid
    const { x, y, r, a, vert, offs } = roid;

    // draw polygon
    beginShape();
    vertex(x + r * offs[0] * cos(a), y + r * sin(a));
    for (var j = 1; j < vert; j++) {
      vertex(
        x + r * offs[j] * cos(a + (j * PI * 2) / vert),
        y + r * offs[j] * sin(a + (j * PI * 2) / vert)
      );
    }
    endShape(CLOSE);

    //
    if (
      dist(x, y, ship.x, ship.y) < ship.r + r &&
      !exploding &&
      ship.blinkNum == 0 &&
      !ship.dead
    ) {
      explodeShip();
      destroyAsteroid(roid);
      exploding = true;
    }

    // move 'em
    // if (!pause)
    moveAsteroids(roid);
  });
  pop();
};
