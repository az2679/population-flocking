let lifetime;
let population;
let lifecycle;

let c1, c2;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.6);

  c1 = color(15, 43, 65);
  c2 = color(9, 13, 30);

  lifetime = 300;
  lifecycle = 0;
  population = new Population(0.01, 150);
}

function draw() {
  colorMode(RGB);
  // background(51, 200);
  background(230, 200);
  setGradient(0, 0, windowWidth, windowHeight * 0.6, c1, c2);

  if (lifecycle < lifetime) {
    population.live();
    lifecycle++;
  } else {
    lifecycle = 0;
    population.calcFitness();
    population.reproduction();
  }

  fill(255);
  noStroke();
  text('Generation #: ' + population.getGenerations(), 10, 18);
  text('Cycles left: ' + (lifetime - lifecycle), 10, 36);
  text('Current Population: ' + population.population.length, 10, 54);

  stroke(255, 255, 255, 100);
  noFill();
  // ellipse(population.population[0].position.x, population.population[0].position.y, population.flockingRadius * 2);
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
