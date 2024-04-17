class parasiteBoid extends Boid {
  constructor(x, y, flockingRadius) {
    super(x, y, flockingRadius);

    this.infectedBoids = new Map();
    //this.infectionTimer = 0;
  }

  infect(boids) {
    let perceptionRadius = 150;
    let infectionDuration = 60;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (!this.infectedBoids.has(other)) {
          //checking if infected already
          this.infectedBoids.set(other, 0); //if not, add to map and set timer to 0
        }
        let timer = this.infectedBoids.get(other); //for that infected boid, inc timer
        timer++;

        if (timer >= infectionDuration) {
          other.lifeForce -= 1; //if boid is near parasite for 1 second/60 frames, dec lifeforce by 1
          this.infectedBoids.set(other, 0); //reset timer
        } else {
          this.infectedBoids.set(other, timer); //otherwise, update its timer
        }
      } else {
        //if boid is not within radius anymore
        if (this.infectedBoids.has(other)) {
          //and its still an entry in the infected map
          this.infectedBoids.delete(other); //remove it from infected
        }
      }
    }
  }

  seek(boids) {
    let perceptionRadius = this.flockingRadius;
    let steering = createVector();
    let healthiestBoid;
    let highestLifeForce = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        if (other.lifeForce > highestLifeForce) {
          highestLifeForce = other.lifeForce;
          healthiestBoid = other;
        }
      }
    }

    if (highestLifeForce > 0) {
      let desired = p5.Vector.sub(healthiestBoid.position, this.position);
      desired.setMag(this.maxSpeed);
      steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  show() {
    strokeWeight(1.5);
    stroke(255);
    fill(255, 0, 0);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-this.size, -this.size * 0.5, -this.size, this.size * 0.5, this.size * 0.25, 0);
    pop();
  }
}
