class Player {
    constructor(image) {
      this.image = image;
      this.x = width / 2;
      this.y = height -30;
      this.bullets = [];
      this.lives = 3;
      this.r = 10;
      this.speed = 0;
      this.bulletSpeed = 0;
      this.maxBulletCount = 0;
      this.isMovingLeft = false;
      this.isMovingRight = false;
      this.isMovingUp = false;
      this.isMovingDown = false;
      this.shootCooldown = 0;
      this.lastShotTime = 0;
    }

    respawn() {
        if (this.lives > 0) {
            this.lives--;
            this.x = width / 2;
            this.y = height - 30;
        }
    }

    updateSpeed(newSpeed) {
      this.speed = newSpeed;
    }
  
    updateBulletSpeed(newBulletSpeed) {
      this.bulletSpeed = newBulletSpeed;
    }
  
    updateBulletCount(newMaxBulletCount) {
      this.maxBulletCount = newMaxBulletCount;
    }

    // handleInput() {
    //   if (keyIsDown(LEFT_ARROW)) {
    //     this.x -= this.speed; // Move left based on speed
    //   }
    //   if (keyIsDown(RIGHT_ARROW)) {
    //     this.x += this.speed; // Move right based on speed
    //   }
    //   if (keyIsDown(UP_ARROW)) {
    //     this.y -= this.speed; // Move up based on speed
    //   }
    //   if (keyIsDown(DOWN_ARROW)) {
    //     this.y += this.speed; // Move down based on speed
    //   }
    // }
  
    update() {
      if (this.gamePaused) return;
      if (this.isMovingRight && this.x < width -40) {
          this.x += this.speed;
      } else if (this.isMovingLeft && this.x > 0) {
          this.x -= this.speed;
      }
      
      if(this.isMovingUp && this.y > 0){
          this.y -= this.speed;
      } else if(this.isMovingDown && this.y < height - 30){
          this.y += this.speed;
      }
      this.updateBullets();
      //console.log(this.bulletSpeed)
  }

    updateBullets(){
      if (this.shootCooldown > 0) {
        this.shootCooldown--;
      }
  
    //   let timeSinceLastShot = millis() - this.lastShotTime;
    //   console.log(this.lastShotTime)
    //   if (timeSinceLastShot > 2000) {
    //     this.shootCooldown = 0;
    // }

      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].update();
        this.bullets[i].speed = this.bulletSpeed;
        //console.log(this.bulletSpeed)
        // Check collision with invaders
        for (let j = invaders.length - 1; j >= 0; j--) {
            if (this.bullets[i].hits(invaders[j])) {
                this.bullets.splice(i, 1);
                invaders.splice(j, 1);
                break;
            }
        }
        if (this.hasHitAlien(this.bullets[i])) {
          this.bullets.splice(i, 1);
          this.score += 10;
          break;
      }
    }
  
  }

  hasHitAlien(bullet) {
    return invaders.checkCollision(bullet.x, bullet.y);
}

  moveLeft() {
      this.isMovingRight = false;
      this.isMovingLeft = true;
  }
  
  moveRight() {
      this.isMovingLeft = false;
      this.isMovingRight = true;
  }
  
  moveUp(){
      this.isMovingUp = true;
      this.isMovingDown = false;
  }
  
  moveDown(){
      this.isMovingUp = false;
      this.isMovingDown = true;
  }
  
  shoot() {
    if (this.shootCooldown <= 0) {
      this.bullets.push(new PlayerBullet(this.x + this.r, this.y, true, this.bulletSpeed));
        this.shootCooldown = 30;
        this.lastShotTime = millis();
        //console.log(this.lastShotTime) // Record the time of the last shot
    }
}
  
    checkCollision(entity) {
      // Check collision with other entities (e.g., aliens, debris)
      let collided = (
        this.x < entity.x + entity.width &&
        this.x + this.width > entity.x &&
        this.y < entity.y + entity.height &&
        this.y + this.height > entity.y
      );
      return collided;
    }
  
    hitBy(entity) {
      if (this.checkCollision(entity)) {
        this.lives--;
        // Additional logic for effects on player being hit
      }
    }

    pauseGame() {
      this.gamePaused = true;
  }

    draw() {
      // Draw player on the canvas using this.image
      image(this.image, this.x, this.y, this.r * 2, this.r * 2);
      this.drawBullets();
      this.drawGas();
    }

    drawBullets() {
      for (let bullet of this.bullets) {
          bullet.draw();
      }
      }

    drawGas(){
        let blocks = 8;
        let blockW = this.r/2;
        let blockH = this.r/3;
        
        for (let i = 0; i < blocks; i++) {
            let currentW = blockW - i + 2;
            let px = this.x + blockW * 2 - currentW / 2;
            if(this.isMovingLeft === true){
                px +=2 * i + 1;
            } else if(this.isMovingRight === true){
                px -= 2 * i + 1;
            }
        
            fill(245, random(150,220), 66);
            rect(px + random(-2, 2), this.y + this.r*2  + i * blockH + 4 + random(-2, 2), currentW, blockH);
      }
    }
  
    // Other player-related methods
  
    display() {
        fill(255);
        rect(this.x, this.y, this.width, this.height);
        // Additional display logic for the player
    }

    loseLife(){
        if(this.lives > 0){
            this.respawn();
        }
    }

}
  