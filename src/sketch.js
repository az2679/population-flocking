let lifetime;
let population;
let lifecycle;

let c1, c2;
let populationSizes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  c1 = color(15, 43, 65);
  c2 = color(9, 13, 30);

  lifetime = 300;
  lifecycle = 0;
  population = new Population(0.01, 150);
}

function draw() {
  colorMode(RGB);
  background(230, 200);
  setGradient(0, 0, windowWidth, windowHeight * 0.6, c1, c2);

  if (lifecycle < lifetime) {
    population.live();
    // populationSizes.push(population.population.length);
    lifecycle++;
  } else {
    lifecycle = 0;
    population.calcFitness();
    population.reproduction();
  }

  fill(0);
  noStroke();
  text('Generation #: ' + population.getGenerations(), 10, 18 + height * 0.6);
  text('Cycles left: ' + (lifetime - lifecycle), 10, 36 + height * 0.6);
  text('Current Population: ' + population.population.length, 10, 54 + height * 0.6);

  // stroke(255, 255, 255, 100);
  // noFill();
  // ellipse(population.population[0].position.x, population.population[0].position.y, population.flockingRadius * 2);

  // drawGraph();
}

function drawGraph() {
  let maxX = populationSizes.length - 1;
  let maxY = max(populationSizes);

  stroke(50);
  line(200, height - 40, width - 100, height - 40);
  line(200, height - 40, 200, height * 0.6 + 40);

  noStroke();
  textSize(12);
  text('Time', width / 2, height - 25);
  text('Population Size', 100, height * 0.8);

  beginShape();
  noFill();
  stroke(0);
  for (let i = 0; i < populationSizes.length; i++) {
    let x = map(i, 0, maxX, 200, width - 150);
    let y = map(populationSizes[i], 0, maxY, height - 100, height * 0.7);
    vertex(x, y);

    if (i % lifetime === 0) {
      let generation = i / lifetime;
      noStroke();
      fill(0);
      ellipse(x, y, 6, 6);
      text('Gen ' + generation + ': ' + populationSizes[i], x + 10, y - 10);
    }
    stroke(0);
    noFill();
  }
  endShape();
}

// p5 linear gradient example, https://p5js.org/examples/color-linear-gradient.html
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
