//Genetic Algorithm: Fitness, Genotype vs Phenotype, https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/5-genotype-vs-phenotype
// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// The Coding Train / Daniel Shiffman

class smartBoid extends regularBoid {
  constructor(position, flockingRadius, dna, lifeForce, lifeTimer, deathTimer, birthState, positionHistory, angle) {
    super(position, flockingRadius, lifeForce, lifeTimer, deathTimer, birthState, positionHistory, angle);

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
    this.show(this.dna.genes);
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

  show(genes) {
    colorMode(HSL, 360, 100, 100, 100);
    const mapLifeForce = map(this.lifeForce, 0, 10, 30, 100);
    const mapAlpha = map(this.lifeForce, 0, 10, 80, 100);

    //trail
    for (let i = 0; i < this.positionHistory.length; i++) {
      strokeWeight(1.5);
      stroke(mapLifeForce);
      point(this.positionHistory[i].x, this.positionHistory[i].y);
    }

    noStroke();
    fill(180, 60, 70, mapAlpha);
    ellipse(this.position.x, this.position.y, this.size * 1.5);
    fill(mapLifeForce, mapAlpha);
    ellipse(this.position.x, this.position.y, this.size);

    const numDots = 8;
    const radius = this.size;
    const smallLine = this.size * 0.6;
    const largeLine = this.size * 0.8;

    const compound1 = genes[4];
    const compound2 = genes[4] + 90;
    const compound3 = genes[4] + 45;
    const compound4 = genes[4] + 135;

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    for (let i = 0; i < numDots; i++) {
      this.angle = map(i, 0, numDots, 0, TWO_PI);
      const scale = i % 2 === 0 ? largeLine : smallLine;

      let compound;
      if (i % 4 === 0) {
        compound = compound1;
      } else if (i % 4 === 1) {
        compound = compound2;
      } else if (i % 4 === 2) {
        compound = compound3;
      } else {
        compound = compound4;
      }

      if (compound > 360) {
        compound -= 360;
      }

      const x = 0 + radius * cos(this.angle);
      const y = 0 + radius * sin(this.angle);
      const x1 = 0 + (radius + scale) * cos(this.angle);
      const y1 = 0 + (radius + scale) * sin(this.angle);

      strokeWeight(1.7);
      stroke(compound, genes[5], map(this.lifeForce, 0, 10, 20, genes[6]), mapAlpha);
      line(x, y, x1, y1);
    }
    pop();
    this.angle += 1;
  }

  getFitness() {
    return this.fitness;
  }

  getDNA() {
    return this.dna;
  }
}
