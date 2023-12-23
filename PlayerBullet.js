class PlayerBullet extends Bullet {
    constructor(x, y, up, bulletSpeed) {
        super(x, y);
        this.up = up;
        this.speed = bulletSpeed;
    }

    update() {
        if(this.up){
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }
    }

    isOffScreen(){
        if(this.y < 0 || this.y > height){
            return true
        }else{
            return false
        }
    }
}