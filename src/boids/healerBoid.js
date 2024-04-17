class healerBoid extends Boid {
  constructor(x, y, flockingRadius, affectRadius) {
    super(x, y, flockingRadius);

    this.affectRadius = affectRadius;
    this.healedBoids = new Map();
  }

  heal(boids) {
    let perceptionRadius = this.affectRadius;
    let proximityDuration = 30;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (!this.healedBoids.has(other)) {
          this.healedBoids.set(other, 0);
        }
        let timer = this.healedBoids.get(other);

        if (timer >= proximityDuration) {
          other.lifeForce += 1;
          this.healedBoids.set(other, 0);
        } else {
          this.healedBoids.set(other, timer);
        }
      } else {
        if (this.healedBoids.has(other)) {
          this.healedBoids.delete(other);
        }
      }
    }
  }

  seek(boids) {
    let perceptionRadius = this.flockingRadius;
    let steering = createVector();
    let weakestBoid;
    let lowestLifeForce = 10;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (other.lifeForce < lowestLifeForce) {
          lowestLifeForce = other.lifeForce;
          weakestBoid = other;
        }
      }
    }

    if (lowestLifeForce > 0) {
      let desired = p5.Vector.sub(weakestBoid.position, this.position);
      desired.setMag(this.maxSpeed);
      steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    fill(0, 255, 0, 150);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size * 0.5, -this.size, this.size * 0.5, this.size * 0.25, 0);
    pop();
  }
}
