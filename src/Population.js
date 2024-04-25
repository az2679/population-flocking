// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// The Coding Train, Daniel Shiffman

class Population {
  constructor(m, num) {
    this.mutationRate = m;
    this.population = new Array(num);
    this.matingPool = [];
    this.generations = 0;
    this.flockingRadius = 75;

    for (let i = 0; i < this.population.length; i++) {
      this.population[i] = new smartBoid(
        createVector(random(width), random(height)),
        this.flockingRadius,
        new DNA(),
        this.population.length
      );
    }
  }

  live() {
    let deadBoids = [];
    let birthedBoids = [];

    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].death()) {
        deadBoids.push(this.population[i]);
      }
      if (this.population[i].birth()) {
        birthedBoids.push(
          new smartBoid(
            createVector(this.population[i].position.x, this.population[i].position.y),
            this.flockingRadius,
            new DNA(),
            this.population.length
          )
        );
      }
      this.population[i].run(this.population);
      this.population[i].edges();
      // this.population[i].flock(this.population);
      this.population[i].update();
      this.population[i].show();
    }

    for (let boid of deadBoids) {
      let index = this.population.indexOf(boid);
      if (index !== -1) {
        this.population.splice(index, 1);
      }
    }
    this.population.push(...birthedBoids);
  }

  calcFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness();
    }
  }

  selection() {
    this.matingPool = [];

    let maxFitness = this.getMaxFitness();

    // Calculate fitness for each member of the population (scaled to value between 0 and 1)
    // Based on fitness, each member will get added to the mating pool a certain number of times
    // A higher fitness = more entries to mating pool = more likely to be picked as a parent
    // A lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (let i = 0; i < this.population.length; i++) {
      let fitnessNormal = map(this.population[i].getFitness(), 0, maxFitness, 0, 1);
      let n = int(fitnessNormal * 100);
      for (let j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }

  reproduction() {
    // let positions = this.population.map((boid) => createVector(boid.position.x, boid.position.y));

    for (let i = 0; i < this.population.length; i++) {
      let m = int(random(this.matingPool.length));
      let d = int(random(this.matingPool.length));

      let mom = this.matingPool[m];
      let dad = this.matingPool[d];

      let momgenes = mom.getDNA();
      let dadgenes = dad.getDNA();

      let child = momgenes.crossover(dadgenes);
      child.mutate(this.mutationRate);

      // this.population[i] = new smartBoid(positions[i], this.flockingRadius, child, this.population.length);
      // this.population[i] = new smartBoid(
      //   createVector(random(width), random(height)),
      //   this.flockingRadius,
      //   child,
      //   this.population.length
      // );
      this.population[i].genes = child;
    }
    this.generations++;
  }

  getGenerations() {
    return this.generations;
  }

  getMaxFitness() {
    let record = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].getFitness() > record) {
        record = this.population[i].getFitness();
      }
    }
    return record;
  }
}
