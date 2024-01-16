let alienImage; 
let invaders;
let shooterImage;
let player;
let powerup;
let allDebris = [];
let gameOver = false;
let canvas;
let canvasEl;
let loading = 10;
let loadingPlus = true;
let resumeButton;
let buyPowerupsButton;
let upgradedShooterImage;
let pauseScreen;
let powerups = [];
let isPowerups = true;
let nftDataReceived = false;
let cooldowns;
let alienatorsImage;

cooldowns = JSON.parse(localStorage.getItem('localCooldowns')) || {};


const initialPowerupsValue = 3;

const NUM_DEBRIS = 5;
//this.loadCooldownsFromLocalStorage(); // number of space debris


function preload() {
  alienImage = loadImage("invader1.png");
  shooterImage = loadImage('player.png');
  upgradedShooterImage = loadImage('playerv2.png');
  alienatorsImage = loadImage('playerv2.png');
}

function setupButtons() { 
  resumeButton = createButton('Resume Game');
  resumeButton.position(width / 2 - 40, height / 2 + 350);
  resumeButton.mousePressed(player.gamePaused = false);
  resumeButton.hide();

  resumeButton.style('background-color', '#4CAF50');
  resumeButton.style('border', 'none');
  resumeButton.style('color', 'white');
  resumeButton.style('text-align', 'center');
  resumeButton.style('text-decoration', 'none');
  resumeButton.style('display', 'inline-block');
  // resumeButton.style('font-size', '16px');

  resumeButton.mouseOver(() => {
  resumeButton.style('background-color', '#45a049');
  });
  
  resumeButton.mouseOut(() => {
  resumeButton.style('background-color', '#4CAF50');
  });

  resumeButton.mousePressed(resumeGame);
  resumeButton.hide();


  buyPowerupsButton = createButton('Activate Powerups');
  buyPowerupsButton.position(width / 2 - 40, height / 2 + 380);
  buyPowerupsButton.mousePressed(() => togglePowerupNFTDisplay(isPowerups));
  buyPowerupsButton.hide();

  buyPowerupsButton.style('background-color', '#f44336');

    // Click effect for Buy Powerups button
  buyPowerupsButton.mouseOver(() => {
  buyPowerupsButton.style('background-color', '#d32f2f'); // Darker color
  });
      
  buyPowerupsButton.mouseOut(() => {
  buyPowerupsButton.style('background-color', '#f44336');
  });

}

async function setup() {
  canvasEl = document.getElementById('sketch-holder')
  canvas = createCanvas(canvasEl.offsetWidth, 400);
  canvas.style('display', 'block');
  canvas.parent('sketch-holder');

  //await getNft(); // Wait for the NFT data to be fetched


  invaders = new Invaders(alienImage);
  player = new Player(shooterImage);
  pauseScreen = new PauseScreen(
    invaders, // Update coins value here
    player, // Update score value here
);
  powerup = new Powerup("Powerup 1", shooterImage, 50, true);

//powerUp = new Powerup("Powerup 1", shooterImage, 50, true);
  const powerup1 = new Powerup("Alienblaster", "alienblaster.png", 50, true);
  const powerup2 = new Powerup("Alienshock", 'alienshock.png', 80, true);
  const powerup3 = new Powerup("Alienator", 'alienator.jpg', 200, false);

    // Add powerups to the array
  powerups.push(powerup1, powerup2, powerup3);

  if (powerup.isActiveAlienator){
    console.log(powerup.isActiveAlienator)
    powerup.updateAlienator();
  }
  // create the debris objects
  for (let i = 0; i < NUM_DEBRIS; i++) {
    if (allDebris.length < NUM_DEBRIS) {
      allDebris.push(new Debris());
    }
  }


setupButtons();
}

function showGameOver() {
  background(0);
  gameOver = true;
  fill(255);
  let gameOverT = "GAME OVER! Click to continue. Your score was " + player.score;
  textSize(16);
  text(gameOverT, width / 2 - textWidth(gameOverT) / 2, height / 2);
}

function connectToStart() {
  background(100);
  fill(255);
  textSize(16);
  let startText1 = "Game will start after successful authentication";
  let startText2 = "Click on Connect passport";
  let textXpos1 = width / 2 - textWidth(startText1) / 2;
  let textXpos2 = width / 2 - textWidth(startText2) / 2;
  let textYpos = height / 2;

  if (window.isconnecting) {
    startText1 = "Connecting ...";
    textXpos1 = width / 2 - textWidth(startText1) / 2;
    if (loadingPlus === true && loading == 100) {
      loadingPlus = false;
    } else if (loading == 10 && loadingPlus === false) {
      loadingPlus = true;
    }
    if (loadingPlus) {
      loading++;
    } else {
      loading--;
    }
    fill(loading + 150);
  }

  text(startText1, textXpos1, textYpos);
  text(startText2, textXpos2, textYpos + 20);
}

// function checkAndDeleteLocalCooldown() {
//   const localCooldownData = localStorage.getItem('localCooldowns');

//   if (localCooldownData) {
//     // If localCooldown exists, delete it
//     localStorage.removeItem('localCooldowns');
//     console.log('localCooldown deleted from localStorage');
//   }
// }

// Attach the function to the onload event
// window.onload = function () {
//   // Call the checkAndDeleteLocalCooldown function on page load
//   checkAndDeleteLocalCooldown();

//   // Rest of your onload logic...
// };

function resumeGame() {
  console.log('Resuming game, hiding resume button');
  player.gamePaused = false;
  resumeButton.hide();
  buyPowerupsButton.hide();
  loop(); 
  let extras = document.getElementById("extras");
  extras.innerHTML = ""
  player.applyActivatedPowerupsForNextLevel();
  player.resetAfterResume();
}

function draw() {
  if (gameOver) {
    showGameOver();
  } else if (window?.userProfile?.email && window.nftDataReceived) {
    if (!player.gamePaused) {
      background(0);
      player.update();
      updateDebrisAndCheckCollisions();
      invaders.update(player);
    }

    player.draw();
    player.drawInfo();
    invaders.draw();
    
    // Check if the game needs to be paused
    if (player.gamePaused && resumeButton.elt.style.display=== 'none') {
      console.log('Pausing game, showing resume button');
      noLoop();
      pauseScreen.display();
      resumeButton.show();
      buyPowerupsButton.show();
    }

    if (invaders.rowsCount == 10){
      levelComplete();
      // resumeButton.addEventListener('click', () => console.log('my job is over'));
      // buyPowerupsButton.addEventListener('click', () => console.log('my job is over'));

      resumeButton.mousePressed(() => alert('my job is over'));
      buyPowerupsButton.mousePressed(() => alert('my job is over'));
    }
    
    if (player.lives == 0) {
      gameOver = true;
    }
  } else {
    connectToStart();
  }

  // Update button visibility based on authentication status
  document.getElementById('btn-passport').hidden = window?.userProfile?.email;
  document.getElementById('btn-logout').hidden = !window?.userProfile?.email;
}

function levelComplete() {
  player.gamePaused == true
  // Show congratulations UI
  showCongratulationsUI();
}

function showCongratulationsUI() {

  const congratsDiv = document.getElementById('extras');
  congratsDiv.innerHTML = ''; 

  const congratsCont = document.createElement('div');
  congratsCont.classList.add('powerup-container');

  const congratsText = document.createElement('h3');
  congratsText.textContent = "Congratulations! You completed the game!";
  congratsCont.appendChild(congratsText);
  // Display congratulations message and restart button

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.addEventListener('click', () => restartGame ());
  restartButton.classList.add('good-button');
  congratsCont.appendChild(restartButton);
  congratsDiv.appendChild(congratsCont);
}

function restartGame() {
  // Reset game state (invaders, player, etc.)
  invaders.rowsCount = 0;

  resumeButton.remove();
  buyPowerupsButton.remove();

  player.resetGameState();
  setup()
  // Hide congratulations UI
  // const congratulationsUI = document.getElementById('extras');
  // congratulationsUI.innerHTML = '';

  player.gamePaused = false;
  let extras = document.getElementById("extras");
  extras.innerHTML = ""

  //resumeGame()
  loop()
}




function togglePowerupNFTDisplay(isPowerups) {
  const extras = document.getElementById('extras');
  extras.innerHTML = '';

  if (isPowerups) {
      // Display the powerup UI
      displayPowerupsUI();
  } else {
      // Display the NFT UI
      // Retrieve data for the NFT (Replace '1' with the appropriate NFT ID)
      getData('1');
  }
}



function displayPowerupsUI() {
  const powerupsDiv = document.getElementById('extras');
  powerupsDiv.innerHTML = ''; 
  // Create elements for Powerup 1
  //powerups.forEach((powerup, index) => {
    for (let i = 0; i < Math.min(3, powerups.length); i++) {
      const powerup = powerups[i];
    const powerupContainer = document.createElement('div');
    powerupContainer.classList.add('powerup-container');
  
    const powerupName = document.createElement('h4');
    powerupName.textContent = powerup.name;
    powerupContainer.appendChild(powerupName);
  
    const powerupImage = document.createElement('img');
    powerupImage.src = powerup.image;
    powerupImage.classList.add('powerup-image');
    powerupImage.width = 50; // Set the width as desired
    powerupImage.height = 50; // Set the height as desired
    powerupContainer.appendChild(powerupImage);
  
    const powerupCost = document.createElement('h5');
    powerupCost.textContent = `Cost: ${powerup.cost}`;
    powerupContainer.appendChild(powerupCost);

    const powerupButton = document.createElement('button');

    // powerupButton.removeEventListener('click', () => handleActivateClick(powerup));
    // powerupButton.removeEventListener('click', () => handleBuyClick(powerup));
    // powerupButton.removeEventListener('click', () => handleBuyNFTClick(powerup));
        if (powerup.mutable) {
          //console.log(player.ownsPowerup(powerup))
            // If the powerup is mutable, check if the player owns it and has activated it
            if (player.ownsPowerup(powerup.name) && !player.isPowerupActivated(powerup.name)) {
              console.log(player.ownsPowerup(powerup.name));
                powerupButton.textContent = 'Activate';
                powerupButton.id = `powerup-${powerup.name}-button`;
                powerupButton.addEventListener('click', () => {
                   handleActivateClick(powerup)
                   updateCooldownsInLocalStorage();
                });
                
            } else {
                powerupButton.textContent = 'Buy';
                powerupButton.id = `powerup-${powerup.name}-button`;
                powerupButton.addEventListener('click', () => handleBuyClick(powerup));
            }
        } else {
          cooldowns = JSON.parse(localStorage.getItem('localCooldowns')) || {};
          // Handle PowerupNFT differently based on its activation and cooldown
          const cooldownInfo = cooldowns[powerup.name];
          console.log(cooldownInfo)
          if (cooldownInfo) {
            const { activationTime, cooldownTime } = cooldownInfo;
            console.log(activationTime)
            const elapsedTime = Date.now() - activationTime;
            const remainingTime = cooldownTime - elapsedTime;
    
            if (remainingTime > 0) {
              // PowerupNFT is activated and in cooldown
              const remainingSeconds = Math.ceil(remainingTime / 1000); // Convert remaining time to seconds
              powerupButton.textContent = `Cooldown (${remainingSeconds}s)`;
              powerupButton.disabled = true;
          
              // Optionally, add a countdown timer to update the remaining time displayed
              // You can use setInterval to update the button text every second based on the remainingTime
              const countdownInterval = setInterval(() => {
                const remaining = Math.ceil((cooldownTime - (Date.now() - activationTime)) / 1000);
                if (remaining > 0) {
                  powerupButton.textContent = `Cooldown (${remaining}s)`;
                } else {
                  clearInterval(countdownInterval);
                  // If the cooldown ends, reset the button to 'Activate'
                  powerupButton.textContent = 'Activate';
                  powerupButton.disabled = false;
                  powerupButton.addEventListener('click', () => {
                    handleActivateNFTPowerup(powerup)
                    powerupButton.textContent = 'Cooldown';
                    powerupButton.disabled = true;
                  
                  });
                }
              }, 1000);
    
              // Handle the cooldown UI here if needed
            } else if (player.ownsPowerup(powerup.name)) {
              // PowerupNFT owned and cooldown elapsed, show Activate button
              console.log(powerup.name)
              powerupButton.textContent = 'Activate';
              powerupButton.addEventListener('click', () => {
                handleActivateNFTPowerup(powerup)
                powerupButton.textContent = 'Cooldown';
                powerupButton.disabled = true;
              
              });
            }
         } else {
            // If no cooldown info found, handle as Buy NFT
            powerupButton.textContent = 'Buy NFT Powerup';
            powerupButton.addEventListener('click', () => handleBuyNFTClick(powerup));
          }
        }
        
        powerupContainer.appendChild(powerupButton);

  
    powerupsDiv.appendChild(powerupContainer);

      }
// });
  
  // Repeat similar steps for other powerups if needed...
}

document.addEventListener('showPowerupsUI', () => {
  displayPowerupsUI();
});

function updateCooldownsInLocalStorage() {
  localStorage.setItem('localCooldowns', JSON.stringify(cooldowns));
}

function updateLocalStorage(powerupName, activationTime, cooldownTime) {
  const storedCooldowns = JSON.parse(localStorage.getItem('localCooldowns')) || {};
  storedCooldowns[powerupName] = { activationTime, cooldownTime };
  localStorage.setItem('localCooldowns', JSON.stringify(storedCooldowns));
}

function loadCooldownsFromLocalStorage() {
  const storedCooldowns = JSON.parse(localStorage.getItem('localCooldowns'));
  if (storedCooldowns) {
    cooldowns = storedCooldowns;
  }
  else{
    console.log('No cooldowns found in local storage')
  }
}

function handleActivateClick(powerup) {
  const activated = player.activatePowerup(powerup.name);

  if (activated) {
    disableActivateButton(powerup);
    removeActivateEventListeners(powerup);
  }
}

function handleBuyClick(powerup) {
  //const powerupButton = document.getElementById(`powerup-${powerup.name}-button`);
  //console.log(powerupButton)
  const purchaseSuccess = player.buyPowerup(powerup);

  //console.log(purchaseSuccess)

  if (purchaseSuccess) {
    updatePowerupButton(powerup);
  }
}

function updatePowerupButton(powerup) {
  //const powerupButton = document.createElement('button');
  // Find the existing button associated with the powerup
  const existingButton = document.getElementById(`powerup-${powerup.name}-button`);

  if (existingButton) {
    existingButton.textContent = 'Activate';
    existingButton.removeEventListener('click', () => handleBuyClick(powerup)); // Remove the event listener

    // Add a new event listener for activation
    existingButton.addEventListener('click', () => handleActivateClick(powerup));
  }
}

function handleActivateNFTPowerup(powerup) {
  if (player.ownsPowerup(powerup.name)) {
    // Activate the powerup
    console.log(player.ownsPowerup(powerup.name))
    player.activatePowerup(powerup.name);

    // Set cooldown time (in milliseconds)
    const cooldownTime = 600000; // 60 seconds

    // Store the activation time for the powerup
    const activationTime = Date.now();

    // Set the cooldown for the powerup
    cooldowns[powerup.name] = {
      activationTime,
      cooldownTime,
    };
    

    // Update the UI for the activated powerup
    updatePowerupUI(powerup);

    updateLocalStorage(powerup.name, activationTime, cooldownTime);
  }
}

// Function to check cooldowns and update UI
function checkCooldowns() {
  Object.keys(cooldowns).forEach((powerupName) => {
    const { activationTime, cooldownTime } = cooldowns[powerupName];
    const elapsedTime = Date.now() - activationTime;
    const remainingTime = cooldownTime - elapsedTime;

    if (remainingTime <= 0) {
      // Cooldown elapsed, update UI and remove the cooldown entry
      delete cooldowns[powerupName];
      updatePowerupUI(powerupName);
    } else {
      // Update the UI with remaining cooldown time
      updatePowerupUI(powerupName, remainingTime);
    }
  });

  // Schedule the next check for cooldowns
  setTimeout(checkCooldowns, 1000);
}

// Start checking for cooldowns
checkCooldowns();

// Function to update UI based on powerup state
function updatePowerupUI(powerup, remainingTime = 0) {
  const powerupButton = document.getElementById(`powerup-${powerup.name}-button`);

  if (!powerupButton) return;

  if (remainingTime <= 0) {
    powerupButton.textContent = 'Activate';
    powerupButton.disabled = false;
    powerupButton.addEventListener('click', () => handleActivateNFTPowerup(powerup, player));
  } else {
    powerupButton.textContent = `Cooldown (${Math.ceil(remainingTime / 1000)}s)`;
    powerupButton.disabled = true;
  }
}

function handleBuyNFTClick(powerup) {
  const purchaseSuccess = player.buyNFTPowerup(powerup);


  if(purchaseSuccess) {
    const existingButton = document.getElementById(`powerup-${powerup.name}-button`);

    const activationTime = Date.now();
    const cooldownTime = 0;
    // Update the cooldowns object
    cooldowns[powerup.name] = { activationTime, cooldownTime };
    updateCooldownsInLocalStorage();
    console.log(localStorage.getItem('localCooldowns'))

    if (existingButton) {
      existingButton.textContent = 'Activate';
      existingButton.removeEventListener('click', () => handleBuyNFTClick(powerup)); // Remove the event listener
  
      // Add a new event listener for activation
      existingButton.addEventListener('click', () => handleActivateNFTPowerup(powerup));
    }
  }
}

function disableActivateButton(activatedPowerup) {
  const powerupsDiv = document.getElementById('extras');
  const powerupButtons = powerupsDiv.querySelectorAll('.powerup-container button');

  powerupButtons.forEach((button) => {
    const powerupName = button.parentElement.querySelector('h4').textContent;

    if (powerupName === activatedPowerup.name) {
      button.textContent = 'Activated';
      button.disabled = true;
    }
  });
}

function removeActivateEventListeners(activatedPowerup) {
  const powerupsDiv = document.getElementById('extras');
  const powerupButtons = powerupsDiv.querySelectorAll('.powerup-container button');
  powerupButtons.forEach((button) => {
    if (button.textContent !== 'Activate') {
      button.removeEventListener('click', handleActivateClick);
      console.log("You can only activate one powerup per Level");
    }
  });

  const existingButton = document.getElementById(`powerup-${activatedPowerup.name}-button`);


  console.log(activatedPowerup)

  if (existingButton) {
    existingButton.removeEventListener('click', () => handleActivateClick);
  }
}

function mousePressed() {
  if (gameOver === true) {
    gameOver = false;
    setup();
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW || keyCode == 88) {
    player.moveRight();
  } else if (keyCode === LEFT_ARROW || keyCode == 90) {
    player.moveLeft();
  } else if (keyCode === 32) {
    player.shoot();
  }

  if (keyCode === UP_ARROW) {
    player.moveUp()
  } else if (keyCode == DOWN_ARROW) {
    player.moveDown();
  }
}

function updateDebrisAndCheckCollisions() {
  for (let i = 0; i < allDebris.length; i++) {
    allDebris[i].update();
    allDebris[i].display();

    if (allDebris[i].hasHitPlayer(player)) {
      allDebris.splice(i, 1);
      player.loseLife();
      break;
    }
  }
}
function windowResized() {
  resizeCanvas(canvasEl.offsetWidth, 400)
  background(0)
}