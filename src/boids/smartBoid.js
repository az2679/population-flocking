//Genetic Algorithm: Fitness, Genotype vs Phenotype, https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/5-genotype-vs-phenotype
// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// The Coding Train / Daniel Shiffman

class smartBoid extends regularBoid {
  constructor(position, flockingRadius, dna, lifeForce, lifeTimer, deathTimer, birthState) {
    super(position, flockingRadius, lifeForce, lifeTimer, deathTimer, birthState);

    this.dna = dna;
    this.fitness = 0;
  }

  calcFitness() {
    this.fitness = this.lifeForce + 1;
    this.fitness = pow(this.fitness, 2);

    if (this.lifeForce === 0) {
      this.fitness *= 0.1;
    }
  }

  run(boids) {
    this.flock(boids, this.dna.genes);
  }

  flock(boids, genes) {
    let perceptionRadius = this.flockingRadius;
    let total = 0;
    let separationScale = 1;
    let separationPerception = 50;
    let cohesionScale = 1;
    let cohesionPerception = 50;
    let alignmentPerception = 70;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        total++;
      }
    }
    if (total > 9) {
      separationScale = genes[0];
      separationPerception = genes[1];
    } else if (total < 3) {
      cohesionScale = genes[2];
      cohesionPerception = genes[3];
    } else {
      cohesionScale = 1;
      cohesionPerception = 50;
      separationScale = 1;
      separationPerception = 50;
    }

    if (total >= 3 && total <= 9) {
      this.lifeTimer++;
      if (this.lifeTimer >= 30) {
        this.lifeForce += 1;
        this.lifeTimer = 0;
      }
    } else {
      this.lifeTimer = 0;
    }

    if (total < 3 || total > 9) {
      this.deathTimer++;
      if (this.deathTimer >= 15) {
        this.lifeForce -= 1;
        this.deathTimer = 0;
      }
    } else {
      this.deathTimer = 0;
    }

    let alignment = this.align(boids, alignmentPerception);
    let cohesion = this.cohesion(boids, cohesionPerception);
    let separation = this.separation(boids, separationPerception);

    cohesion.mult(cohesionScale);
    separation.mult(separationScale);

    cohesion.mult(1.4);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  getFitness() {
    return this.fitness;
  }

  getDNA() {
    return this.dna;
  }
}
