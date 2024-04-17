const flock = [];
const parasites = [];
const healers = [];

let alignmentSlider, cohesionSlider, separationSlider;
let alignmentP, cohesionP, separationP;

let flockingRadius = 150;
let parasiteRadius = 300;
let infectRadius = 150;
let healerRadius = 300;
let healRadius = 150;

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

  parasites.push(new parasiteBoid(random(width), random(height), parasiteRadius, infectRadius));
  healers.push(new healerBoid(random(width), random(height), healerRadius, healRadius));
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
    parasite.repulse(healers[0]);
    parasite.infect(flock);
    parasite.seek(flock);
    parasite.flock(flock);
    parasite.edges();
    parasite.update();
    parasite.show();
  }

  for (let healer of healers) {
    healer.repulse(parasites[0]);
    healer.heal(flock);
    healer.seek(flock);
    healer.flock(flock);
    healer.edges();
    healer.update();
    healer.show();
  }

  // console.log(flock.length);

  stroke(255);
  noFill();
  ellipse(flock[0].position.x, flock[0].position.y, flockingRadius);

  noStroke();
  fill(255, 0, 0, 6);
  ellipse(parasites[0].position.x, parasites[0].position.y, parasiteRadius);
  stroke(255, 0, 0, 50);
  noFill();
  ellipse(parasites[0].position.x, parasites[0].position.y, infectRadius);

  noStroke();
  fill(0, 255, 0, 5);
  ellipse(healers[0].position.x, healers[0].position.y, healerRadius);
  stroke(0, 255, 0, 30);
  noFill();
  ellipse(healers[0].position.x, healers[0].position.y, healRadius);
}
