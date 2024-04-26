let lifetime;
let population;
let lifecycle;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.6);

  lifetime = 100;
  lifecycle = 0;
  population = new Population(0.01, 150);
}

function draw() {
  background(51);

  if (lifecycle < lifetime) {
    population.live();
    lifecycle++;
  } else {
    lifecycle = 0;
    population.calcFitness();
    // population.selection();
    population.reproduction();
  }

  fill(255);
  noStroke();
  text('Generation #: ' + population.getGenerations(), 10, 18);
  text('Cycles left: ' + (lifetime - lifecycle), 10, 36);
  text('Current Population: ' + population.population.length, 10, 54);

  stroke(255, 255, 255, 100);
  noFill();
  ellipse(population.population[0].position.x, population.population[0].position.y, population.flockingRadius * 2);
}
