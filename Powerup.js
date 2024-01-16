class Powerup {
    constructor(name, image, cost, mutable) {
        this.name = name;
        this.image = image;
        this.cost = cost;
        this.mutable = mutable;
        this.activated = false;
        this.cooldown = 0;
        this.isActiveAlienator = false;
        this.aliens = [];
        this.lastAlienTime = 0;
        this.newTimer = null;
        this.callUpdate = false;
        
    
        // Other properties and methods related to powerups
    }

    buy(player) {
        if (!this.mutable) {
            // Handle buying non-mutable powerups
            console.log("Cannot buy a non-mutable powerup, it's an NFT");
        } else if (player.coins >= this.cost) {
            // Handle buying mutable powerups if the player has enough coins
            player.coins -= this.cost;
            // Other logic related to purchasing
            console.log(`Bought ${this.name} for ${this.cost} coins`);
        } else {
            // Handle insufficient coins for buying powerups
            console.log("Not enough coins to buy this powerup");
        }
    }

    activate() {
        if (!this.activated && !this.mutable) {
            // If it's an immutable powerup and not activated, activate it
            this.activated = true;
            // Other logic related to activation
            this.initializeInNextLevel(player);
        } else if (!this.activated && this.mutable) {
            // If it's a mutable powerup and not activated, activate it
            this.activated = true;
            // Other logic related to activation
            this.initializeInNextLevel(player);
        } else {
            // Handle already activated powerups or invalid activations
            console.log("Powerup already activated or invalid activation");
        }
    }

    activateAlienblaster(player, playerLevels, rowsCount) {
        const currentLevel = rowsCount; // Adjust to match the array index
        
        if (currentLevel < playerLevels.length) {
            const { bulletSpeed, maxBulletCount } = playerLevels[currentLevel];
            console.log(bulletSpeed)
            console.log(maxBulletCount)
            console.log(currentLevel)
            
            player.updateBulletSpeed(bulletSpeed + 5); // Multiply by a constant to increase
            player.updateBulletCount(maxBulletCount * 2); // Multiply by a constant to increase
            
            setTimeout(() => {
                player.updateBulletSpeed(bulletSpeed); // Return to original after timeout
                player.updateBulletCount(maxBulletCount); // Return to original after timeout
            }, 10000);
        }
    }

    activateAlienshock(invaders) {
        let removedInvaders = 0;
        const totalDuration = 10000; // 10 seconds
        const removalInterval = 1000; // 1-second interval
        let gameEnded = false;
      
        const removeInvader = () => {
          if (gameEnded) {
            return; // Exit function if the game has ended
          }
      
          if (removedInvaders < invaders.aliens.length) {
            if (Math.random() < 0.5) {
              invaders.aliens.splice(removedInvaders, 1);
              player.updateCombo();
              player.updateScore();
            }
            removedInvaders++;
            setTimeout(removeInvader, removalInterval);
          }
        };
      
        const startRemoval = () => {
          const startTime = Date.now();
          const runFunction = () => {
            const elapsedTime = Date.now() - startTime;
            if (!gameEnded && elapsedTime < totalDuration) {
              removeInvader();
              setTimeout(runFunction, removalInterval);
            }
          };
          runFunction();
        };
      
        setTimeout(startRemoval, 0); // Start the removal process immediately
      
        // Function to set gameEnded to true when the game ends (e.g., player dies)
        if (player.lives == 0) {
            gameEnded = true;
        }
      }

      
      activateAlienator() {
        console.log("Alienator activated");
        this.callUpdate = false;
        this.isActiveAlienator = true;
        this.lastAlienTime = Date.now();
        console.log('i became true first');
        player.deactivatePowerup('Alienator')
        this.spawnAlienators(5);
      
        // Clear any existing timeout
        clearTimeout(this.newTimer);
      
        // Set a timeout for 10 seconds
        this.newTimer = setTimeout(() => {
          this.isActiveAlienator = false;
          console.log("Alienator deactivated");
          // Remove all aliens
          this.aliens = [];
          console.log(this.aliens);
        }, 10000);
      }
      

      spawnAlienators(count) {
        const spacing = (width / count); // Adjust as needed
        const startY = height - 70; // Adjust the initial y position as needed
        console.log(height)
        for (let i = 0; i < count; i++) {
          const x = i * spacing;
          const alien = new Alienators(x, startY, alienatorsImage);
          this.aliens.push(alien);
        }
        if(this.callUpdate == false){
        this.updateAlienator();
        this.callUpdate = true;
        }
      }

      updateAlienator() {
        if (!this.isActiveAlienator || player.gamePaused) {
          clearTimeout(this.newTimer);
          this.isActiveAlienator = false; // Set isActiveAlienator to false when the powerup is not active
          this.aliens = []; // Remove all aliens
          console.log(this.isActiveAlienator);
          return; // Exit early if the powerup is not active or the game is paused
        }
      
        // Update and display each alien spaceship
        this.aliens.forEach(alienators => {
          alienators.update();
          alienators.display();
        });
      
        // Remove aliens that go off-screen
        this.aliens = this.aliens.filter(alien => alien.y <= height);
      
        if (player.lives == 0) {
          clearTimeout(this.newTimer);
          this.aliens.forEach(alienators => {
            alienators.clearBullets();
          });
          this.isActiveAlienator = false;
          this.aliens = [];
          console.log(this.aliens);
          return;
        }
      
        // Continue the update loop
        requestAnimationFrame(() => this.updateAlienator());
      }
}