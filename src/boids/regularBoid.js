// The Game of Life, https://thecodingtrain.com/tracks/the-nature-of-code-2/85-the-game-of-life
// The Coding Train, Daniel Shiffman

class regularBoid extends Boid {
  constructor(position, flockingRadius) {
    super(position, flockingRadius);

    this.lifeForce = 5;
    this.lifeTimer = 0;
    this.deathTimer = 0;
    this.birthState = true;

    this.positionHistory = [];

    this.hue = random(360);
    this.sat = random(70, 100);
    this.light = random(40, 70);

    this.angle = 0;
  }

  birth() {
    if (this.lifeForce >= 10 && this.birthState) {
      this.birthState = false;
      return true;
    } else {
      return false;
    }
  }

  death() {
    return this.lifeForce <= 0;
  }

  flock(boids) {
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
      separationScale = 1.5;
      separationPerception = 100;
    } else if (total < 3) {
      cohesionScale = 1.1;
      cohesionPerception = 150;
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

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);

    this.lifeForce = constrain(this.lifeForce, 0, 10);
    if (this.lifeForce < 10) {
      this.birthState = true;
    }

    if (frameCount % 5 === 0) {
      this.positionHistory.push(this.position.copy());
      if (this.positionHistory.length > 3) {
        this.positionHistory.shift();
      }
    }
  }

  show() {
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

    const compound1 = this.hue;
    const compound2 = this.hue + 90;
    const compound3 = this.hue + 45;
    const compound4 = this.hue + 135;

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
      stroke(compound, this.sat, map(this.lifeForce, 0, 10, 20, this.light), mapAlpha);
      line(x, y, x1, y1);
    }
    pop();
    this.angle += 1;
  }
}
