//Flocking Simulation, https://thecodingtrain.com/challenges/124-flocking-simulation
//The Coding Train, Daniel Shiffman

class Boid {
  constructor(position, flockingRadius) {
    this.position = position.copy();
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.1;
    this.maxSpeed = 3;
    this.size = 5;

    this.flockingRadius = flockingRadius;
  }

  repulse(target) {
    let force = p5.Vector.sub(target.position, this.position);
    let d = force.mag();
    d = constrain(d, 1, this.affectRadius);
    let G = 50;
    let strength = G / (d * d);
    force.setMag(strength);
    if (d < this.affectRadius) {
      force.mult(-10);
    }
    this.acceleration.add(force);
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height * 0.6 - this.size * 2) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height * 0.6 - this.size * 2;
    }
  }

  align(boids, perception) {
    let perceptionRadius = perception;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids, perception) {
    let perceptionRadius = perception;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids, perception) {
    let perceptionRadius = perception;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let separationPerception = 50;
    let cohesionPerception = 50;
    let alignmentPerception = 70;

    let alignment = this.align(boids, alignmentPerception);
    let cohesion = this.cohesion(boids, cohesionPerception);
    let separation = this.separation(boids, separationPerception);

    cohesion.mult(1.4);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    noFill();

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size * 0.5, -this.size, this.size * 0.5, this.size * 0.25, 0);
    pop();
  }
}
