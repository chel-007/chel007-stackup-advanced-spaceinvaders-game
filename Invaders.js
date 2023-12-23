let levels = [
    {
        numberOfAliens: 40,
        alienHealth: 1,
        // Add more properties for level one as needed
    },
    {
        numberOfAliens: 60,
        alienHealth: 2,
        // Define properties for level two
    }
    // Define properties for subsequent levels...
];


class Invaders {
    constructor(alienImage) {
        this.alienImage = alienImage;
        this.rowsCount = 0;
        this.direction = 0;
        this.y = 40;
        this.aliens = this.initialiseAliens()
        this.bullets = [];
        this.movingDown = true;
        this.speed = 0.2;
        this.timeSinceLastBullet = 0;
        this.gamePaused = false;
        this.gameStarted = false;
    }

    update(player) {
        for (let alien of this.aliens) {
            if (this.direction == 0) {
                alien.x+= this.speed;
            } else if (this.direction == 1) {
                alien.x-= this.speed;
            }
            if (alien.hasHitPlayer(player)){
                player.loseLife();
            }
        }
   
        if (this.hasChangedDirection()) {
            this.moveAlienDown();
        }
        if (this.aliens.length == 0) {
            this.nextLevel();
        }
      
       if (this.timeSinceLastBullet >= 40) {
          let bottomAliens = this.getBottomAliens();
          if (bottomAliens.length) {
              this.makeABottomAlienShoot(bottomAliens);
          }  
        }
      	this.timeSinceLastBullet++;
      
      this.updateBullets(player);
      if (!this.gameStarted) {
        this.upgradePlayer(player);
        this.gameStarted = true;
      }
    }

    // startGame() {
    //     this.upgradePlayer(player);
    // }

    upgradePlayer(player) {
        const playerLevels = [
          {
            playerSpeed: 1,
            bulletSpeed: 6,
            maxBulletCount: 2,
          },
          {
            playerSpeed: 2,
            bulletSpeed: 12,
            maxBulletCount: 4,
          },
          // Add properties for subsequent levels
        ];

        console.log(player)
      
        if (this.rowsCount < playerLevels.length) {
          const { playerSpeed, bulletSpeed, maxBulletCount } = playerLevels[this.rowsCount];
          
          console.log("I also got here")
          console.log(playerSpeed);

          player.updateSpeed(playerSpeed);
          player.updateBulletSpeed(bulletSpeed);
          player.updateBulletCount(maxBulletCount);
      
          // Other logic related to level upgrade
        }
    }
  
    hasChangedDirection() {
        for (let alien of this.aliens) {
            if (alien.x >= width - 40) {
                this.direction = 1;
                return true;
            } else if (alien.x <= 20) {
                this.direction = 0;
                return true;
            }
        }
        return false;
    }

    moveAlienDown() {
        for (let alien of this.aliens) {
            if(this.movingDown){
                alien.y += 10;
                if(alien.y >= height -30){
                    this.movingDown = false;
                }
            } else {
                alien.y -= 10;
                if(alien.y <= 0){
                    this.movingDown = true;
                }
            }
        }
    }
  
   getBottomAliens() {
        let allXPositions = this.getAllXPositions();
        let aliensAtTheBottom = [];
        for (let alienAtX of allXPositions) {
            let bestYPosition = 0;
            let lowestAlien;
            for (let alien of this.aliens) {
                if (alien.x == alienAtX) {
                    if (alien.y > bestYPosition) {
                        bestYPosition = alien.y;
                        lowestAlien = alien;
                    }
                }
            }
            aliensAtTheBottom.push(lowestAlien);
        }
        return aliensAtTheBottom;
    }

    getAllXPositions() {
        let allXPositions = new Set();
        for (let alien of this.aliens) {
            allXPositions.add(alien.x);
        }
        return allXPositions
    }

    nextLevel() {
        this.rowsCount++
        this.aliens = this.initialiseAliens();
        this.upgradePlayer(player);
        player.gamePaused = true;

    }

    initialiseAliens() {
        const currentLevelProperties = levels[this.rowsCount];
        const { alienHealth } = currentLevelProperties;
    
        // Create just one alien for testing
        let aliens = [new Alien(width / 2, this.y, this.alienImage, alienHealth)];
    
        // Or create five aliens for testing
        // let aliens = [];
        // for (let i = 0; i < 5; i++) {
        //     aliens.push(new Alien((i + 1) * 100, this.y, this.alienImage, alienHealth));
        // }
    
        return aliens;
    }
    

    // initialiseAliens() {
    //     const currentLevelProperties = levels[this.rowsCount];

    //     const { numberOfAliens, alienHealth } = currentLevelProperties;
    //     let aliens = [];
    //     let y = this.y;
    //     let aliensPerRow = Math.floor(width / 30); // Calculate the number of aliens per row based on canvas width

    //     for (let i = 0; i < numberOfAliens / aliensPerRow; i++) {
    //         for (let x = 40; x < width - 40; x += 30) {
    //             aliens.push(new Alien(x, y, this.alienImage, alienHealth));
    //         }
    //         y += 40;
    //     }
    //     console.log(aliens)
    //     return aliens;
    // }

    draw() {
      for (let bullet of this.bullets) {
          fill('#f30000')
          rect(bullet.x, bullet.y,  4, 10);
      }
      
      for (let alien of this.aliens) {
          alien.draw();
      }
    }
  
    checkCollision(x, y) {
      for (let i = this.aliens.length - 1; i >= 0; i--) {
          let currentAlien = this.aliens[i];
          if (dist(x, y, currentAlien.x + 11.5, currentAlien.y + 8) < 10) {
              this.aliens.splice(i, 1);
              return true;
          }
      }
      return false;
    }
  
    makeABottomAlienShoot(bottomAliens) {
      let shootingAlien = random(bottomAliens);
      let bullet = new AlienBullet(shootingAlien.x + 10, shootingAlien.y + 10);
      this.bullets.push(bullet);
      this.timeSinceLastBullet = 0;
    }
  
     updateBullets(player) {
        for (let i = this.bullets.length - 1; i >= 0; i-- ) {
            this.bullets[i].y  += 2;
            if(this.bullets[i].hasHitPlayer(player)){
                player.loseLife();
            }
        }
    }
}