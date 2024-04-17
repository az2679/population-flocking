class Boid {
  constructor(x, y, flockingRadius) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.1;
    this.maxSpeed = 3; //5;

    this.rad = 10; //6;

    this.flockingRadius = flockingRadius;

    this.lifeForce = 5; //150;
    this.timer1 = 0;
    this.timer2 = 0;
    this.birthState = true;
  }

  // birth() {
  //   return this.lifeForce >= 10;
  // }
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

  finished() {
    return this.lifeForce <= 0;
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
      steering.div(total); //have average velocity
      steering.setMag(this.maxSpeed); //will always go to neighbors at max speed
      steering.sub(this.velocity); // steer towards avg vel by subtracting current vel
      steering.limit(this.maxForce); // limit velocity length, impacts change in velocity to align -- but since we have max speed, it's going to limit change direction
      //can look into steering force again for recap
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
      steering.div(total); // have avg location, want to steer in that direction. to get vector in avg direction, take avg location - current position.
      steering.sub(this.position); //now have vector pointing from me to avg pos
      steering.setMag(this.maxSpeed); //want to go at max speed. this is now desired vel
      steering.sub(this.velocity); //going to subtract current to steer towards desired vel
      steering.limit(this.maxForce); // limit strength of steering force
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
      this.timer1++;
      if (this.timer1 >= 30) {
        this.lifeForce += 1;
        this.timer1 = 0;
      }
    } else {
      this.timer1 = 0;
    }

    if (total < 3 || total > 9) {
      this.timer2++;
      if (this.timer2 >= 60) {
        this.lifeForce -= 1;
        this.timer2 = 0;
      }
    } else {
      this.timer2 = 0;
    }

    let alignment = this.align(boids, alignmentPerception);
    let cohesion = this.cohesion(boids, cohesionPerception);
    let separation = this.separation(boids, separationPerception);

    cohesion.mult(cohesionScale);
    separation.mult(separationScale);

    cohesion.mult(1.4);
    // alignment.mult(1.2);

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

    //fill(this.lifeForce * 50);
    fill(map(this.lifeForce, 0, 10, 0, 255));

    //point(this.position.x, this.position.y);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.rad, -this.rad * 0.5, -this.rad, this.rad * 0.5, this.rad * 0.25, 0);
    pop();
  }
}
