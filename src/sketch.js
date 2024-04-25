const flock = [];
const parasites = [];
const healers = [];

let alignmentSlider, cohesionSlider, separationSlider;
let alignmentP, cohesionP, separationP;

let flockingRadius = 75;
let parasiteRadius = 150;
let infectRadius = 75;
let healerRadius = 150;
let healRadius = 75;

function setup() {
  createCanvas(windowWidth, windowHeight / 2);

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

  stroke(255, 255, 255, 100);
  noFill();
  ellipse(flock[0].position.x, flock[0].position.y, flockingRadius * 2);

  noStroke();
  fill(255, 0, 0, 15);
  ellipse(parasites[0].position.x, parasites[0].position.y, parasiteRadius * 2);
  stroke(255, 0, 0, 50);
  noFill();
  ellipse(parasites[0].position.x, parasites[0].position.y, infectRadius * 2);

  noStroke();
  fill(0, 255, 0, 5);
  ellipse(healers[0].position.x, healers[0].position.y, healerRadius * 2);
  stroke(0, 255, 0, 30);
  noFill();
  ellipse(healers[0].position.x, healers[0].position.y, healRadius * 2);
}
