// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// 9.8 Improved Selection Pool, https://editor.p5js.org/codingtrain/sketches/eBrC90hCl
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

  reproduction() {
    let maxFitness = 0;
    let totalFitness = 0;

    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
      totalFitness += this.population[i].fitness;
    }

    for (let i = 0; i < this.population.length; i++) {
      this.population[i].prob = this.population[i].fitness / totalFitness;
    }

    for (let i = 0; i < this.population.length; i++) {
      // let partnerA = this.acceptReject(maxFitness);
      // let partnerB = this.acceptReject(maxFitness);

      let partnerA = this.pickOne();
      let partnerB = this.pickOne();

      let child = partnerA.crossover(partnerB);

      child.mutate(this.mutationRate);
      this.population[i].genes = child;
    }
    this.generations++;
  }

  pickOne() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
      r = r - this.population[index].prob;
      index++;
    }
    index--;
    return this.population[index].getDNA();
  }

  // acceptReject(maxFitness) {
  //   let besafe = 0;
  //   while (true) {
  //     let index = floor(random(this.population.length));
  //     let partner = this.population[index];
  //     let r = random(maxFitness);
  //     if (r < partner.fitness) {
  //       return partner.getDNA();
  //     }
  //     besafe++;

  //     if (besafe > 10000) {
  //       return null;
  //     }
  //   }
  // }

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
