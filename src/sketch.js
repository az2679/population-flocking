const flock = [];
const parasites = [];

let alignmentSlider, cohesionSlider, separationSlider;
let alignmentP, cohesionP, separationP;

let flockingRadius = 150;
let parasiteRadius = 500;
let infectionRadius = 150;

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
    flock.push(new regularBoid(random(width), random(height), flockingRadius));
  }

  parasites.push(new parasiteBoid(random(width), random(height), parasiteRadius));
  console.log(flock[0]);
}

function draw() {
  background(51);

  let deadBoids = [];
  let birthedBoids = [];

  for (let boid of flock) {
    if (boid.death()) {
      deadBoids.push(boid);
    }
    if (boid.birth()) {
      birthedBoids.push(new regularBoid(boid.position.x, boid.position.y, flockingRadius));
    }

    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  for (let boid of deadBoids) {
    let index = flock.indexOf(boid);
    if (index !== -1) {
      flock.splice(index, 1);
    }
  }
  flock.push(...birthedBoids);

  for (let parasite of parasites) {
    parasite.infect(flock);
    parasite.seek(flock);

    parasite.edges();
    parasite.flock(flock);
    parasite.update();
    parasite.show();
  }

  // console.log(flock.length);

  stroke(255);
  noFill();
  ellipse(flock[0].position.x, flock[0].position.y, flockingRadius);

  noStroke();
  fill(255, 0, 0, 5);
  ellipse(parasites[0].position.x, parasites[0].position.y, parasiteRadius);
  stroke(255, 0, 0, 40);
  noFill();
  ellipse(parasites[0].position.x, parasites[0].position.y, infectionRadius);

  flock[0].lifeForce = 10;

  // console.log(parasites[0].infectedBoids.length);
}
