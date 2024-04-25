// Smart Rockets, https://thecodingtrain.com/more/achive/nature-of-code/9-genetic-algorithms/9.5-fitness-genotype-vs-phenotype.html
// The Coding Train / Daniel Shiffman

class DNA {
  constructor(newgenes) {
    if (newgenes) {
      this.genes = newgenes;
    } else {
      this.genes = [];
      for (let i = 0; i < 4; i++) {
        this.genes[0] = random(1, 2);
        this.genes[1] = random(50, 150);
        this.genes[2] = random(1, 2);
        this.genes[3] = random(50, 150);
      }
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
    for (let i = 0; i < this.genes.length; i += 2) {
      if (random(1) < m) {
        this.genes[i] = random(1, 5);
        this.genes[i + 1] = random(50, 200);
      }
    }
  }
}
