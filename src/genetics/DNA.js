//Genetic Algorithm: Fitness, Genotype vs Phenotype, https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/5-genotype-vs-phenotype
// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// The Coding Train / Daniel Shiffman

class DNA {
  constructor(newgenes) {
    if (newgenes) {
      this.genes = newgenes;
    } else {
      this.genes = [
        random(1, 2), //separation force scalar
        random(50, 150), //separation perception radius
        random(1, 2), //cohesion force scalar
        random(50, 150), //cohesion perception radius
        random(0, 360), //hue
        random(70, 100), //saturation
        random(40, 70), //lightness
      ];
    }
  }

  crossover(partner) {
    let child = new Array(this.genes.length);
    for (let i = 0; i < this.genes.length; i++) {
      child[i] = (this.genes[i] + partner.genes[i]) / 2;
    }
    let newgenes = new DNA(child);
    return newgenes;
  }

  mutate(m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] *= random(2);
      }
    }
  }
}
