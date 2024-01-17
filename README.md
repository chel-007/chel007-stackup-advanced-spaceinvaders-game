## Game Details

The Deployed Game Link is @: https://chel-advanced-spaceinvaders.netlify.app

NB: To Play and test the Game successfully, make sure to **be on the full screen of your PC**, **allow pop-up notifications for the tab**, and **have some t-IMX in your logged in wallet**

## GamePlay Guide

[<img src="https://cdn.hackernoon.com/images/4jLd9wAdOWQW3iTiKFVy3oWadmu1-2w83asp.jpeg" width="50%">](https://vimeo.com/903867901?share=copy "chel007 X Stackup Space Invaders: 55")

**The gameplay guide video above will redirect to a Vimeo video on click.**

### Contents
* I Visit https://chel-advanced-spaceinvaders.netlify.app/ to load the game. Upon loading, the player is moved to Level 6. Since I've previously minted the Level 5 NFT Checkpoint, there's no need to replay Level 5, and the game restarts from Level 6.
  - Note: I refreshed the initial Level 3 minted NFT with Level 5 details using `refreshNFTMetadata`.

* Next, I intentionally lose the game to demonstrate restarting and the game's playability.
  - Note: The checkpoint initializes only when the window is reloaded, not when maintaining the current state after a game loss.

* I Start from Level 1 now, complete it, then purchase the Alienblaster Powerup and activate it. Clicking the resume button shows my player perks boosted with more speed and bullet counts, helping me kill aliens faster, but it only lasts for 10 seconds.
  - Note: My coins are plenty since they were saved in local storage during initial game testing. New players start with just 100 coins.

* After completing Level 2, I also purchase the Alienshock Powerup. It helps shock many aliens in the level, leaving only a few.

* By Timeline 3.52, after playing a few times and completing Level 3, I quickly demonstrate the NFT minting process and successfully mint the Level 3 Badge again.
  - Note: This step is unnecessary for players who have minted before, but it doesn't affect the level checkpoint, as the highest level NFT badge will be considered.

* I then mint the Alienator Powerup NFT and activate it too, entering a cooldown. Upon resuming, the NFT spawns new upgraded spaceships, aiding in killing more aliens. I Get distracted by their shooting and lose.

* I Reload the game finally to showcase the level checkpoint, which beeps me back to Level 6. I Complete the level and take a look at the Activate Powerup Screen; the Alienator Powerup is still on cooldown, which would last  for 10 minutes.

<hr>

### chel007 X Stackup Space Invaders Game WriteUp

Welcome to my advanced update of the StackupInvaders Game Project, integrated with the Immutable SDK Platform.

This brief overview highlights the new features of the game and explains how they function.

Initially, when I encountered this game and delved into understanding its code logic, it seemed challenging. I was tempted to rebuild the entire game using React, thinking it might make the logic creation easier. However, I eventually opted to stick with the existing code because the main functions provided in the original Invaders game were too crucial to overlook. This decision saved me a considerable amount of time, especially with the following features:

1. Passport Login and the game start logic after successful authentication.
2. The major classes triggered at game start in the Draw function (Invaders and Player).
3. The NFT logic for claiming NFTs and showcasing the UI on the right side of the screen.
4. The initialization logic of referenced classes from another JS file. It became clear how this worked, allowing me to access cross-file values seamlessly.

In conclusion, after a closer study, the game files turned out to be straightforward, and I found it quite fun to build upon the existing codebase.

### New Features Implemented into the Invaders Game

#### Level Progression
The first thing I wanted to do was to ensure that players could smoothly progress through levels with customized properties, providing an opportunity to understand and enjoy the game's features. To achieve this, I added a simple constant array in the `Invaders.js` file that holds level properties (`level` and `playerLevels`). These properties are looped through during the initialization of the aliens and to update the player's speed, bullet speed, and max bullet count.

This addition brings a more dynamic feel to the game, as players compete against aliens with varying strengths at each level, while also benefiting from improved player perks.

Note: As players progress through levels, I increased the health property for aliens, requiring multiple shots for elimination. This enhancement added an exciting element to the game, as higher levels could feature a smaller number of aliens, but each with extra health.

The Methods Powering the Level Progression Features includes:
`in Invaders.js`
* updateBullets
* upgradePlayer
* advanced nextLevel
* initialise Aliens (utilising the numberofALiens, and alienHealth)
* checkCollision(utilising the alienHealth property to check for collided)

`in Player.js`
* updateSpeed, updateBulletSpeed, updateBulletCount (which is called from Invaders.js)
* shoot() method upgraded to utilize bulletSpeed and maxBulletCount resp


#### **Persistent Player Data**, In-game Currency and Scoring
This feature laid the foundation for integrating power-ups into the game. I introduced a simple coins earnings system through levels, accumulating based on the player's score in each level. The scoring mechanism is further enhanced with a combo multiplier, rewarding precise shooters with more coins.

Here's how it works: The combo multiplier tracks alien hits within the last 3 seconds, increasing the combo score. Continuously hitting aliens leads to a higher score. The coins are obtained from the score through a simple division, and the final amount is stored in the localStorage. This ensures that even if the game ends, the player retains their coins, which are needed for purchasing power-ups.
The Methods powering this feature includes:
`in Player.js`
* updateScore
* updateCombo
* reserAfterResume (called in sketch.js)
* resetForNewLevel (which isn't needed tbh)
* savePlayerData & loadPlayerData ( which is used to store n retrieve the coins value, n could be extended for other data)

#### **Powerups**
I was eager to test out this feature, especially since it was suggested in the bounty, and I thought it would add a lot of fun to the game. To implement this, I created three different kinds of power-ups.

`one - Alienblaster` to bump the Player's perks according to the level they're on, giving them the ability to shoot faster, and kill more aliens easily. It runs for 10 seconds. This Powerup increases players `bulletSpeed` and `maxBulletCount` than the default level

`two - Alienshock` to work the magic without the players effort and directly shock random aliens with a 1 second delay, this also runs for 10 seconds. Shocked aliens are added to the scoring and contribute to coins. It's abstractly conveyed as if the players spaceship suddenly sends out shock waves, and kills aliens randomly.


`three - Alienator` is the most advanced and costly powerup in the game. It operates as an NFT, available for purchase and minting only once. Once acquired, players can activate this unique NFT powerup, triggering a 10-minute cooldown before it can be utilized again.

This powerup introduces a new class of spaceships, similar to allies of the players. These spaceships assist in eliminating the aliens after the are spawned, providing valuable support for a duration of 10 seconds.

For all these, a new Powerup.js Class is created and the powerups are instantiated in the sketch.js along with an `activate powerups` button which brings up this UI. 
Similar to how the NFTs Minting process is viewed, I made the powerups to display on the right of the game, each with a name, image, Cost and Button for status.

The Button reflects the ownership of the Powerups and for when they arent available in the Players PowerupInventory, `can be bought`, when they are Avaialble `can be activated` making the **Buy** & **Activate** button show respectively. 
The only difference is the Nft Powerup which would always be available in the PowerupInventory and is rather controlled by it's **Cooldown Status**.

Buying Powerups uses the In-game Coin which is deducted and Activating them Calls specific activation method depending on the PowerupName (from the Powerup.js File)

Powerups are also added to Localstorage and remain after window is reloaded. 

Methods powering this feature includes:
`in Player.js`
* ownsPowerup
* isPowerupActivated
* buyPowerup
* activatePowerup
* applyactivatedPowerupForNextLevel
* removePowerupfromLocalStorage
* deactivatePowerup

`in sketch.js`
* togglePowerupNFTDisplay
* displayPowerupsUI
* handleActivateClick
* handleBuyClick
* updatePowerupButton
* removeActivateEventListeners
* handleBuyNFTClick
* handleActivateNFTPowerup

**Plus the entire Poweup.js Class file**

* This code includes three functions for Nft Powerup: `activateAlienator`, `spawnAlienator`, and `updateAlienators`. These functions manage the creation of instances of the `Alienators` class, which run for a specific duration using `setTimeout`. The number of Alienators spawned is specified, and they are evenly distributed across the width of the canvas. The `updateAlienators` function handles the display and shooting of Alienators, checking conditions to set their `active status` to false. Conditions include elapsed time, game end, or player death.

The `Alienators class` is structured similarly to player.js, with similar functions. I developed it separately to avoid potential errors from reusing spawns of player.js. Its purpose was to function differently too, shooting a maximum number of bullets based on a specified level and its movement cannot be controlled by players.

The Powerup Class incorporates additional functions, such as `activateAlienShock` and `activateAlienBlaster`. The former leverage the `Math.random` method to selectively remove invaders from the list or return if the game has concluded. And the latter, enhances the bullet speed and count perks of the player. Both powerups have a fixed duration, running for 10 seconds.


#### **NFT Modifications and Checkpoint**

The integration of NFTs was helpful in advancing the development of this feature. The code calling was straightforward, enabling me to implement modifications that enhanced its robustness for the extended game with 10 levels.

For the 10 levels, I've strategically distributed the NFT awarded to players upon reaching Level 3, Level 5, Level 8, and Level 10 (or Level 9, allowing players to easily replay Level 10).

To complement these levels, I utilized the **Leonardo.AI Image Generator** to create two new NFT images for **Levels 8 and 10**. Meanwhile, I retained the original two images for the initial levels (3 & 5).


Initially, there's a function allowing players to mint an NFT. This function communicates with the Contract Address, increments the Token Supply Count, and mints the NFT to their Wallet Address.

Subsequently, I introduced a `refreshNFTMetadata` function. It takes predefined metadata details from the `getData` function, which has been updated to receive extra IDs from the Player Class (2, 3, 4). It then awaits a call to `refreshNFTMetadata`, passing new metadata containing details like name, description, image URL, etc., based on the player's new level.

I created the `refreshNFTMetadata` function according to the guidelines outlined in the immutable docs. It makes a POST request to a URL endpoint, specifically the NFT Collection refresh metadata on the testnet chain. Instead of minting a new NFT (which would total 4 across the levels), players mint just once and refresh their metadata as they progress.


This seamlessly help for the integration of a simple Checkpoint System for returning players, By introducing a new function called `getNft`. This function involves making a call to the blockchain to check the account ownership of NFTs in a specific contract address, and then retrieving the response using `client.listNFTsByAccountAddress`.

I created a predefined list of NFT names that I want to compare with the response. These names were passed when building the metadata details.

The response is compared using NFT names rather than token IDs (since these IDs would remain the same for a player). This allows the system to update the Game Level accordingly. When the correct NFT owned by the player (or the latest refreshed) is found, the player is beeped back to the correct level. Additionally, a corresponding message is sent out.

I deployed a new NFT Collection specifically for the advanced powerup, the "Alienator," via Immutable Hub. This collection comprises only one NFT token, representing the unique Alienator powerup in the game.

### New NFT Powerup Collection Link:

https://explorer.testnet.immutable.com/address/0x646dc499a9c56c755ebc4e9b0f6580896cc9c3ce


![powerup collection chel007](https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmcMeGhGVJ6tCfVyyee8MWnFjCicbbpteasnHAJqCc7fqX)

#### **Miscellaneous and Extras**
So some other features that could clash because of the changes in my game was basically the game start logic, so Instead of just starting the game as the passport client updates the userProfile, i added an extra check for the Nft Data retrieved by ListAllNfts By Address.

So the Game checks if both functions return success with values before starting

And Secondly, a new PauseScreen.js Class is created that logs the value of next Level, Score, Coins and both the resume & buyPoweup Button when the game is paused to make it more Intuitive to View the Player stats and Interact with the Powerups
