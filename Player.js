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
    bulletSpeed: 20,
    maxBulletCount: 3,
  },
  {
    playerSpeed: 3,
    bulletSpeed: 25,
    maxBulletCount: 4,
  },
  {
    playerSpeed: 3,
    bulletSpeed: 26,
    maxBulletCount: 5,
  },
  {
    playerSpeed: 3,
    bulletSpeed: 28,
    maxBulletCount: 5,
  },
  {
    playerSpeed: 4,
    bulletSpeed: 30,
    maxBulletCount: 4,
  },
  // Add properties for subsequent levels
];

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
      this.score = 0; // Initialize player's score
      this.coins = 100;
      this.comboMultiplier = 1; // Initialize combo multiplier
      this.lastComboTime = 0; // Time of the last combo
      this.gameStarted = false;
      this.loadPlayerData();
      this.powerupInventory = JSON.parse(localStorage.getItem('powerupInventory')) || [];
      this.nft = { '1': false, '2': false, '3': false, '4': false }; // Tracks which NFTs are owned
      this.showNft = this.showNft.bind(this);
      
    }
    powerup = new Powerup("Alienblaster", 'invader1.png', 50, true);
    powerup2 = new Powerup("Alienshock", 'invader1.png', 50, true);
    powerup3 = new Powerup("Alienator", 'invader1.png', 50, false);
    

    respawn() {
        if (this.lives > 0) {
            this.lives--;
            this.x = width / 2;
            this.y = height - 30;
        }
    }

    upgradeSpaceship() {
      this.image = loadImage('playerv2.png');
  }

    showNft(tokenId) {
      if (!this.nft[tokenId]) {
        this.nft[tokenId] = false;
        window.getData(tokenId);
      }
    }

    pauseGame(tokenId) {
      this.gamePaused = true;
      this.showNft(tokenId);
  }

  resetPowerupInventory() {
    this.powerupInventory = [];
    localStorage.setItem('powerupInventory', JSON.stringify(this.powerupInventory));
  }

  resetCoinsData() {
    this.coins = 10; // Set to the default value or any initial value you want
    this.savePlayerData();
  }

  resetGameState() {
    // Reset other game state variables as needed
    this.lives = 3;
    this.score = 0;
    // Add other variables to reset

    // Reset powerup inventory
    this.resetPowerupInventory();

    // Reset coins data
    this.resetCoinsData();
  }

  checkLevelForNFT() {
    if (invaders.rowsCount === 3 && !this.nft['1']) {
      this.gamePaused = true;
      this.pauseGame('1');
    } else if (invaders.rowsCount === 5 && !this.nft['2']) {
      this.gamePaused = true;
      this.pauseGame('2');
    }
    else if (invaders.rowsCount === 8 && !this.nft['3']){
      this.gamePaused = true;
      this.pauseGame('3');
    }
    else if (invaders.rowsCount === 10 && !this.nft['4']){
      this.gamePaused = true;
      this.pauseGame('4');
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
      //console.log(this.score)
      //console.log(this.powerupInventory)
      if (!this.gameStarted) {
        this.lastComboTime = millis();
        this.gameStarted = true;
      }
  }

    updateBullets(){
      if (this.shootCooldown > 0) {
        this.shootCooldown--;
      }

      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].update();
        this.bullets[i].speed = this.bulletSpeed;

        // Check collision with invaders
        if (this.hasHitAlien(this.bullets[i])) {
          this.bullets.splice(i, 1);

          this.updateCombo();
          this.updateScore();
          break;
      }
    }
  
  }

  savePlayerData() {
    const playerData = {
      coins: this.coins,
      // Other relevant player data to save
    };
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }

  loadPlayerData() {
    const savedData = localStorage.getItem('playerData');
    if (savedData) {
      const playerData = JSON.parse(savedData);
      this.coins = playerData.coins;
      // Load other relevant player data
    } else {
      // If no saved data exists, initialize the player with default values
      this.coins = 100;
      // Initialize other player data here if needed
    }
  }


  hasHitAlien(bullet) {
    return invaders.checkCollision(bullet.x, bullet.y);
}

ownsPowerup(powerupName) {
  // Check if the player owns a powerup based on its name
  const localInventory = this.powerupInventory.map(powerup => powerup.name);
  const storedInventory = JSON.parse(localStorage.getItem('powerupInventory')) || [];
  const mergedInventory = [...localInventory, ...storedInventory.map(powerup => powerup.name)];

  //console.log(mergedInventory.includes(powerupName))
  return mergedInventory.includes(powerupName);

}


isPowerupActivated(powerupName) {
  // Find the powerup in the inventory and check its 'activated' status
  const foundPowerup = this.powerupInventory.find(powerup => powerup.name === powerupName);
  //console.log(foundPowerup)
  //console.log(this.powerupInventory.find(powerup => powerup.name === powerupName))
  return foundPowerup ? foundPowerup.activated : false;
}

buyPowerup(powerup) {
  if (this.coins >= powerup.cost) {
      // Subtract the cost from player's coins
      this.coins -= powerup.cost;
      
      // Add the powerup to the inventory with activated status as false
      const newPowerup = { name: powerup.name, activated: false };
      this.powerupInventory.push(newPowerup);

      localStorage.setItem('powerupInventory', JSON.stringify(this.powerupInventory));
      this.savePlayerData();
      
      console.log(`Bought ${powerup.name} for ${powerup.cost} coins.`);
      return true; // Purchase successful
  } else {
      console.log(`Insufficient coins to buy ${powerup.name}.`);
      return false; // Purchase unsuccessful
  }
}

buyNFTPowerup(powerup) {
  if (this.coins >= powerup.cost) {
      // Deduct coins from the player
      this.coins -= powerup.cost;

      const newPowerup2 = { name: powerup.name, activated: false };
      this.powerupInventory.push(newPowerup2);
      localStorage.setItem('powerupInventory', JSON.stringify(this.powerupInventory));
      this.savePlayerData();
    
      if (window.getData('0')){
        return true;
      }

      else {
        console.log(`Error Minting NFT`)
      }

       // Purchase successful
      
  }
  else {
    alert(`Insufficient coins to buy ${powerup.name}.`);
    return false; // Purchase unsuccessful
}
}

activatePowerup(powerupName) {
  const foundPowerup = this.powerupInventory.find(powerup => powerup.name === powerupName);

  console.log(foundPowerup)
  console.log(this.powerupInventory.find(powerup => powerup.name === powerupName))

  if (foundPowerup) {
      foundPowerup.activated = true;
      //console.log(`Activated ${powerupName}.`);
      return true; // Activation successful
  } else {
      //console.log(`Powerup ${powerupName} not found.`);
      return false; // Activation unsuccessful
  }
}

deactivatePowerup(powerupName) {
  const toDeactivate = this.powerupInventory.find(powerup => powerup.name === powerupName);

  console.log(toDeactivate)
  console.log(this.powerupInventory.find(powerup => powerup.name === powerupName))

  if (toDeactivate) {
      toDeactivate.activated = false;
      //console.log(`Activated ${powerupName}.`);
      return true; // Activation successful
  } else {
      //console.log(`Powerup ${powerupName} not found.`);
      return false; // Activation unsuccessful
  }
}

applyActivatedPowerupsForNextLevel() {
  const activatedPowerups = this.powerupInventory.filter(powerup => powerup.activated);

  activatedPowerups.forEach(powerup => {
    if (powerup.name === 'Alienblaster') {
      this.powerup.activateAlienblaster(player, playerLevels, invaders.rowsCount);
    } 
    else if (powerup.name === 'Alienshock') {
      this.powerup2.activateAlienshock(invaders);
      console.log("did i activate powerup2?")
    }
    else if (powerup.name === 'Alienator') {
      this.powerup2.activateAlienator();
      console.log("did i activate powerup3?")
    }
    
    else {
      console.log("No Powerup to activate");
    }
  });

  console.log("i was able to run")

  // Remove the activated powerups from the inventory and localStorage
  activatedPowerups.forEach(activatedPowerup => {

    this.removePowerupFromLocalStorage(activatedPowerup.name);

    const index = this.powerupInventory.findIndex(powerup => powerup.name === activatedPowerup.name);
    if (index !== -1) {
      if(activatedPowerup.name === 'Alienator') {
        return;
      }
      else {
      this.powerupInventory.splice(index, 1);
      }
      // Remove from localStorage here
    }
    
  });
}

// Function to remove a specific powerup from localStorage
removePowerupFromLocalStorage(powerupName) {
  // Get the powerupInventory from localStorage
  const storedPowerupInventory = JSON.parse(localStorage.getItem('powerupInventory'));
  console.log(storedPowerupInventory);
  console.log(powerupName);
  if (storedPowerupInventory) {
    // Find the index of the powerup to remove
    const indexToRemove = storedPowerupInventory.findIndex(powerup => powerup.name === powerupName);
    console.log(indexToRemove);
    if (indexToRemove === -1) {
      console.error(`Powerup ${powerupName} not found in inventory`);
      return; 
    }

    if (indexToRemove !== -1) {
      if(storedPowerupInventory[indexToRemove].name === 'Alienator') {
        return;
      }
      // Remove the powerup from the array
      else {
      storedPowerupInventory.splice(indexToRemove, 1);
      console.log('removed powerup from local storage')
      localStorage.setItem('powerupInventory', JSON.stringify(storedPowerupInventory));
      }

    // Update the localStorage with the modified powerupInventor
    }
  }
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
  if (this.shootCooldown <= 0 && this.maxBulletCount > 0) {
    const bulletsToShoot = min(this.maxBulletCount, 10); // Assuming a maximum of 3 bullets can be shot at once
    const offset = 10; // Space between bullets if multiple are shot

    for (let i = 0; i < bulletsToShoot; i++) {
      const bulletX = this.x + this.r + (i * offset - (bulletsToShoot - 1) * (offset / 2)); // Distributing bullets evenly around the player
      this.bullets.push(new PlayerBullet(bulletX, this.y, true, this.bulletSpeed));
    }

    this.shootCooldown = 30; // Set cooldown for shooting
    this.lastShotTime = millis();
    // Record the time of the last shot
  }
}

resetForNewLevel() {
  this.gameStarted = false;
  //this.comboMultiplier = 1;
  this.lastComboTime = 0;
  //this.score = 0;
}

resetAfterResume() {
  this.comboMultiplier = 1;
  this.score = 0;
}

updateCombo() {
  const currentTime = millis();
  if (currentTime - this.lastComboTime <= 3000) {
    this.comboMultiplier++;
  } else {
    this.comboMultiplier = 1;
    console.log(currentTime)
    console.log(this.lastComboTime)
  }
  this.lastComboTime = currentTime;
}


updateScore() {
  const comboScore = this.comboMultiplier * 0.5; // Modify as needed
  const coinsEarned = Math.floor(this.comboMultiplier / 4); // Modify as needed
  this.score += comboScore;
  this.coins += coinsEarned;
  this.savePlayerData();
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

  //   pauseGame() {
  //     this.gamePaused = true;
  // }

  resumeGame() {
    this.gamePaused = false;
    this.resumeCount++;
    if (this.resumeCount === 2) { 
        this.upgradeSpaceship();
    }
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

    drawLives(t_width) {
      for (let i = 0; i < this.lives; i++) {
          image(this.image, width - (i + 1) * 30, 10, this.r * 2, this.r * 2);
      }
    }

    drawInfo() {
      fill(255)
      let bounty_text = window?.userProfile?.email + ": ";
      let bounty_text_w = textWidth(bounty_text);
      let score = text(bounty_text, 50, 25);
      push();
      fill(100, 255, 100);
      text(this.score, bounty_text_w + 50, 25);
      pop();
      this.drawLives(bounty_text_w + textWidth(this.score) + 100)
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
  