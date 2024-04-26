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

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

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
    strokeWeight(2);
    stroke(map(this.lifeForce, 0, 10, 150, 255));
    fill(map(this.lifeForce, 0, 10, 0, 255));

    ellipse(this.position.x, this.position.y, this.size * 0.2);

    const numDots = 8;
    const radius = this.size / 3;
    const smallLine = this.size * 0.2;
    const largeLine = this.size * 0.4;
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    for (let i = 0; i < numDots; i++) {
      this.angle = map(i, 0, numDots, 0, TWO_PI);
      const scale = i % 2 === 0 ? largeLine : smallLine;
      const x = 0 + radius * cos(this.angle);
      const y = 0 + radius * sin(this.angle);
      const x1 = 0 + (radius + scale) * cos(this.angle);
      const y1 = 0 + (radius + scale) * sin(this.angle);
      strokeWeight(0.5);
      stroke(this.r, this.g, this.b);
      line(x, y, x1, y1);
    }
    pop();
    this.angle += 1;

    for (let i = 0; i < this.positionHistory.length; i++) {
      strokeWeight(1.5);
      point(this.positionHistory[i].x, this.positionHistory[i].y);
    }
  }
}
