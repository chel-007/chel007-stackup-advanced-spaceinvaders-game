class AlienatorBullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = 5; // Bullet speed
      this.damage = 1; // Bullet damage
    }
  
    update() {
      this.y -= this.speed; // Move the bullet upwards (adjust based on direction)
    }
  
    draw() {
        fill(255);
        rect(this.x, this.y, 3, 10);
    }

}