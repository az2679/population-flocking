// Seeking A Target, https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/5-autonomous-agents/2-seeking-a-target
// Attraction and Repulsion Forces, https://thecodingtrain.com/challenges/56-attraction-and-repulsion-forces
// The Coding Train, Daniel Shiffman

class parasiteBoid extends Boid {
  constructor(x, y, flockingRadius, affectRadius) {
    super(x, y, flockingRadius);

    this.affectRadius = affectRadius;
    this.infectedBoids = new Map();
  }

  infect(boids) {
    let perceptionRadius = this.affectRadius;
    let proximityDuration = 30;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (!this.infectedBoids.has(other)) {
          this.infectedBoids.set(other, 0);
        }
        let timer = this.infectedBoids.get(other);

        if (timer >= proximityDuration) {
          other.lifeForce -= 1;
          this.infectedBoids.set(other, 0);
        } else {
          this.infectedBoids.set(other, timer);
        }
      } else {
        if (this.infectedBoids.has(other)) {
          this.infectedBoids.delete(other);
        }
      }
    }
  }

  seek(boids) {
    let perceptionRadius = this.flockingRadius;
    let steering = createVector();
    let healthiestBoid;
    let highestLifeForce = -Infinity;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (other.lifeForce > highestLifeForce) {
          highestLifeForce = other.lifeForce;
          healthiestBoid = other;
        }
      }
    }

    if (healthiestBoid && highestLifeForce > 0) {
      let desired = p5.Vector.sub(healthiestBoid.position, this.position);
      desired.setMag(this.maxSpeed);
      steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  show() {
    strokeWeight(1.5);
    stroke(255, 0, 0, 150);
    fill(255, 0, 0, 150);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size * 0.5, -this.size, this.size * 0.5, this.size * 0.25, 0);
    pop();
  }
}
