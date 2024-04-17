const flock = [];

let alignmentSlider, cohesionSlider, separationSlider;
let alignmentP, cohesionP, separationP;

let flockingRadius = 150;

function setup() {
  createCanvas(windowWidth, windowHeight / 2);

  alignmentSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);
  alignmentP = createP(`alignment`);
  alignmentP.position(5, windowHeight / 2 + 10);
  cohesionP = createP(`cohesion`);
  cohesionP.position(140, windowHeight / 2 + 10);
  separationP = createP(`separation`);
  separationP.position(270, windowHeight / 2 + 10);

  for (let i = 0; i < 70; i++) {
    flock.push(new Boid(flockingRadius));
  }
  // console.log(flock[0]);
}

function draw() {
  background(51);

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  stroke(255);
  noFill();
  ellipse(flock[0].position.x, flock[0].position.y, flockingRadius);

  // console.log(flock[0].timer1, flock[0].timer2, flock[0].lifeForce);
  // console.log(flock[0].lifeForce);
}
