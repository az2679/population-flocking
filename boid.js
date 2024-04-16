class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;

    this.rad = 6;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 50;
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
      steering.div(total); //have average velocity
      steering.setMag(this.maxSpeed); //will always go to neighbors at max speed
      steering.sub(this.velocity); // steer towards avg vel by subtracting current vel
      steering.limit(this.maxForce); // limit velocity length, impacts change in velocity to align -- but since we have max speed, it's going to limit change direction
      //can look into steering force again for recap
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
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
      steering.div(total); // have avg location, want to steer in that direction. to get vector in avg direction, take avg location - current position.
      steering.sub(this.position); //now have vector pointing from me to avg pos
      steering.setMag(this.maxSpeed); //want to go at max speed. this is now desired vel
      steering.sub(this.velocity); //going to subtract current to steer towards desired vel
      steering.limit(this.maxForce); // limit strength of steering force
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        //if not me and within perception radius
        let diff = p5.Vector.sub(this.position, other.position); //get vector pointing away from local flockmate
        diff.div(d); //want it to be inv proportional, the farther the way it is, the lower the magnitude
        steering.add(diff); //adding all vectors pointing away from thing near me
        total++;
      }
    }

    if (total > 0) {
      steering.div(total); //average it - forces pointing away from thing near me
      steering.setMag(this.maxSpeed); //set to max speed
      steering.sub(this.velocity); //steer towards that vel
      steering.limit(this.maxForce); // limit strength of steering force
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    //force accumulation, sum
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    // fill(0);

    //point(this.position.x, this.position.y);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.rad, -this.rad * 0.5, -this.rad, this.rad * 0.5, this.rad * 0.25, 0);
    pop();
  }
}
