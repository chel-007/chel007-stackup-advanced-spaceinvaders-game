let levels = [
    {
        numberOfAliens: 30,
        alienHealth: 1,
        // Add more properties for level one as needed
    },
    {
        numberOfAliens: 32,
        alienHealth: 1,
        // Define properties for level two
    },
    {
        numberOfAliens: 1,
        alienHealth: 1,
        // Define properties for level two
    },
    {
        numberOfAliens: 40,
        alienHealth: 1,
        // Define properties for level two
    },
    {
        numberOfAliens: 1,
        alienHealth: 2,
        // Define properties for level two
    },
    {
        numberOfAliens: 45,
        alienHealth: 2,
        // Define properties for level two
    },
    {
        numberOfAliens: 50,
        alienHealth: 2,
        // Define properties for level two
    },
    {
        numberOfAliens: 40,
        alienHealth: 3,
        // Define properties for level two
    },
    {
        numberOfAliens: 45,
        alienHealth: 3,
        // Define properties for level two
    },
    {
        numberOfAliens: 50,
        alienHealth: 3,
        // Define properties for level two
    },
    {
        numberOfAliens: 1,
        alienHealth: 1,
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
        this.r = 10;
        //this.aliens = this.initialiseAliens()
        this.bullets = [];
        this.movingDown = true;
        this.speed = 0.2;
        this.timeSinceLastBullet = 0;
        this.gamePaused = false;
        this.gameStarted = false;
    }

    update(player) {
        if (!this.gameStarted) {
            this.upgradePlayer(player);
            
            this.aliens = this.initialiseAliens();
            this.gameStarted = true;
            console.log(canvas.width);
            console.log(canvas.height);
          }
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
   
        // if (!this.shouldMoveAliensDown()) {
        //     if (this.hasChangedDirection()) {
        //         this.moveAlienDown();
        //     }
        // }

        if(this.hasChangedDirection()){
            if(!this.shouldMoveAliensDown()){
                this.moveAlienDown();
            }
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
    }

    upgradePlayer(player) {
        const playerLevels = [
          {
            playerSpeed: 1,
            bulletSpeed: 10,
            maxBulletCount: 1,
          },
          {
            playerSpeed: 2,
            bulletSpeed: 10,
            maxBulletCount: 2,
          },
          {
            playerSpeed: 2,
            bulletSpeed: 15,
            maxBulletCount: 2,
          },
          {
            playerSpeed: 2,
            bulletSpeed: 18,
            maxBulletCount: 3,
          },
          {
            playerSpeed: 2,
            bulletSpeed: 20,
            maxBulletCount: 3,
          },
          {
            playerSpeed: 3,
            bulletSpeed: 23,
            maxBulletCount: 4,
          },
          {
            playerSpeed: 3,
            bulletSpeed: 30,
            maxBulletCount: 4,
          },
          {
            playerSpeed: 3,
            bulletSpeed: 26,
            maxBulletCount: 5,
          },
          {
            playerSpeed: 4,
            bulletSpeed: 30,
            maxBulletCount: 5,
          },
          {
            playerSpeed: 4,
            bulletSpeed: 35,
            maxBulletCount: 4,
          },
          // Add properties for subsequent levels
        ];
      
        if (this.rowsCount < playerLevels.length) {
          const { playerSpeed, bulletSpeed, maxBulletCount } = playerLevels[this.rowsCount];
          console.log(player)
          player.updateSpeed(playerSpeed);
          player.updateBulletSpeed(bulletSpeed);
          player.updateBulletCount(maxBulletCount);
      
          // Other logic related to level upgrade
        }
    }

    shouldMoveAliensDown() {
        // Check if the canvas width is less than a certain value
        return canvas.width < 500;
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
        player.resetForNewLevel();
        player.checkLevelForNFT();
    }

    // initialiseAliens() {
    //     const currentLevelProperties = levels[this.rowsCount];
    //     const { alienHealth } = currentLevelProperties;
    
    //     // Create just one alien for testing
    //     let aliens = [new Alien(width / 2, this.y, this.alienImage, alienHealth)];
    
    //     // Or create five aliens for testing
    //     // let aliens = [];
    //     // for (let i = 0; i < 5; i++) {
    //     //     aliens.push(new Alien((i + 1) * 100, this.y, this.alienImage, alienHealth));
    //     // }
    //     console.log(aliens)
    //     return aliens;
    // }
    

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

    // initialiseAliens() {
    //     const currentLevelProperties = levels[this.rowsCount];
    //     const { numberOfAliens, alienHealth } = currentLevelProperties;
    
    //     const aliensPerRow = 20; // Specify the desired number of aliens per row
    //     const rowsNeeded = Math.ceil(numberOfAliens / aliensPerRow);
    
    //     let aliens = [];
    //     let y = this.y;
    
    //     for (let i = 0; i < rowsNeeded; i++) {
    //         for (let j = 0; j < aliensPerRow && aliens.length < numberOfAliens; j++) {
    //             const x = 40 + j * 30;
    //             aliens.push(new Alien(x, y, this.alienImage, alienHealth));
    //         }
    //         y += 40;
    //     }
    
    //     console.log(aliens);
    //     return aliens;
    // }
    
    

    initialiseAliens() {
        const currentLevelProperties = levels[this.rowsCount];
        const { numberOfAliens, alienHealth } = currentLevelProperties;
    
        const maxAliensPerRow = 20; // Specify the maximum number of aliens per row
        const alienWidth = this.r * 2; // Specify the width of each alien
        const minSpacing = 5; // Specify the minimum spacing between aliens
    
        // Calculate the maximum number of aliens that can fit in a row without exceeding canvas width
        const calculatedAliensPerRow = Math.min(maxAliensPerRow, Math.floor((width - minSpacing) / (alienWidth + minSpacing)));
    
        const aliensPerRow = Math.max(1, calculatedAliensPerRow); // Ensure there is at least one alien per row
    
        const fullRows = Math.floor(numberOfAliens / aliensPerRow);
        const remainingAliens = numberOfAliens % aliensPerRow;
    
        let aliens = [];
        let y = this.y;
    
        // Render full rows
        for (let i = 0; i < fullRows; i++) {
            let startX = (canvas.width - aliensPerRow * alienWidth - (aliensPerRow - 1) * minSpacing) / 2; // Calculate the starting x-coordinate for centering
    
            for (let j = 0; j < aliensPerRow; j++) {
                const x = startX + j * (alienWidth + minSpacing);
                aliens.push(new Alien(x, y, this.alienImage, alienHealth));
            }
            y += 40;
        }
    
        // Center the remaining aliens
        if (remainingAliens > 0) {
            let startX = (canvas.width - remainingAliens * alienWidth - (remainingAliens - 1) * minSpacing) / 2; // Calculate the starting x-coordinate for centering
    
            for (let j = 0; j < remainingAliens; j++) {
                const x = startX + j * (alienWidth + minSpacing);
                aliens.push(new Alien(x, y, this.alienImage, alienHealth));
            }
        }
    
        console.log(aliens);
        return aliens;
    }
    
    
    

    draw() {
      for (let bullet of this.bullets) {
          fill('#f30000')
          rect(bullet.x, bullet.y,  4, 10);
      }
      
      for (let alien of this.aliens) {
          alien.draw();
      }
    }

    updateScore() {
        player.score += this.comboMultiplier; // Increase score based on combo multiplier
        console.log(player.score)
        player.coins = Math.floor(player.score / 2); // Update coins based on score
        console.log(player.coins)
    }
  
    checkCollision(x, y) {
        for (let i = this.aliens.length - 1; i >= 0; i--) {
            let currentAlien = this.aliens[i];
            if (dist(x, y, currentAlien.x + 11.5, currentAlien.y + 8) < 10) {
                // Reduce the alien's health by a certain amount on collision
                currentAlien.health--; // Decrease the health
    
                // If the alien's health is still positive, return true for collision
                if (currentAlien.health > 0) {
                    console.log(currentAlien.health);
                    return true; // Collision occurred, but alien not removed yet
                } else {
                    // If the alien's health is zero or negative, remove it from the array
                    console.log(currentAlien.health);
                    this.aliens.splice(i, 1);
                    return true; // Collision and removal occurred
                }
            }
        }
        return false; // No collision or no alien removed
    }
    

    //   checkCollision(x, y) {
    //     for (let i = this.aliens.length - 1; i >= 0; i--) {
    //         let currentAlien = this.aliens[i];
    //         if (dist(x, y, currentAlien.x + 11.5, currentAlien.y + 8) < 10) {
    //             this.aliens.splice(i, 1);
    //            console.log(this.aliens)
    //             return true;
    //         }
    //     }
    //     return false;
    //   }
      
  
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