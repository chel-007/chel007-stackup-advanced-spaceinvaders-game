class Alienators {
    constructor(x, y, image) {
      this.x = x;
      this.y = y;
      this.r = 10;
      this.image = image;
      this.spawnTime = millis(); // Record the time the alien was spawned
      this.bullets = []; // Initialize bullets array
      this.lastBulletTime = 0; // Initialize lastBulletTime
      this.bulletInterval = 2000;
      // Other properties and methods for the alien spaceship
    }
  
    update() {
        const currentTime = millis();
        if (currentTime - this.lastBulletTime > this.bulletInterval) {
          this.shootBullets(invaders.rowsCount);
          this.lastBulletTime = currentTime;
        }
    
        // Update bullets
        this.bullets.forEach(alienatorbullet => {
          alienatorbullet.update();
        });
        
        // Collision detection with invaders
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.hasHitAlien(this.bullets[i])) {
              this.bullets.splice(i, 1);
              break;
          }
        }
        if (player.lives == 0 || player.gamePaused){
            this.clearBullets();
            return;
        }  
      }

      clearBullets() {
        this.bullets = [];
      }

      shootBullets(level) {
        // Shoot bullets based on the current level
        const maxBullets = [1, 2, 2, 2, 3, 3, 3, 4, 4, 4]; // Example: different levels have different max bullet counts
        const bulletCount = maxBullets[level]; // Get the max bullet count for the current level
        const offset = 10;
    
        for (let i = 0; i < bulletCount; i++) {
          const bulletX = this.x + this.r + (i * offset - (bulletCount - 1) * (offset / 2));
          const bullet = new AlienatorBullet(bulletX, this.y); // Create a new bullet
          this.bullets.push(bullet);
        }
      }
    
  
    display() {
        // Draw the spaceship using an image
        image(this.image, this.x, this.y, this.r * 2, this.r * 2);
    
        // Display bullets
        this.bullets.forEach(alienatorbullet => {
          alienatorbullet.draw();
        });
      }

    hasHitAlien(bullet) {
        return invaders.checkCollision(bullet.x, bullet.y);
    }
  
}