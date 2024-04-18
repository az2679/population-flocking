// The Game of Life, https://thecodingtrain.com/tracks/the-nature-of-code-2/85-the-game-of-life
// The Coding Train, Daniel Shiffman

class regularBoid extends Boid {
  constructor(x, y, flockingRadius) {
    super(x, y, flockingRadius);

    this.lifeForce = 5;
    this.lifeTimer = 0;
    this.deathTimer = 0;
    this.birthState = true;
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
      if (this.deathTimer >= 60) {
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

    alignment.mult(alignmentSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

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
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    fill(map(this.lifeForce, 0, 10, 0, 255));

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size * 0.5, -this.size, this.size * 0.5, this.size * 0.25, 0);
    pop();
  }
}
