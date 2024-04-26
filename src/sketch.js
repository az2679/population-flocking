let lifetime; // How long should each generation live
let population; // Population
let lifecycle; // Timer for cycle of generation
let recordtime; // Fastest time to target

function setup() {
  createCanvas(windowWidth, windowHeight * 0.6);

  lifetime = 100;
  lifecycle = 0;
  recordtime = lifetime;

  let mutationRate = 0.01;
  population = new Population(mutationRate, 150);
  console.log(population);
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
