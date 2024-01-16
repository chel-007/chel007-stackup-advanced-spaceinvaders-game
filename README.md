## Game Details

The Deployed Game Link is @: 

NB: To Play and test the Game successfully, make sure to **be on the full screen of your PC**, **allow pop-up notifications for the tab**, and **have some t-IMX in your logged in wallet**


<hr>

### chel007 X Stackup Space Invaders Game WriteUp

Welcome to my Advanced Update of the StackupInvaders Game Project Integradted with the Immutable SDK Platform.

This short writeup works through the new features of the Game and their Functionality.

So when I first say this Game and Started to Digest it to understand the Code Logic, it seemed difficult to me, I was tempted to revise the whole Game into one powered by React since it could be easier to create the Logic with that, or Would it really?

Well, I eventually decided to go along with this because the Main Functions provided in the Initial Invaders game were too much to Overlook and it saved me a lot of time not having to re-implement them, Especially the foll features:

* Passport Login and the Game Start Logic after Successful Authentication
* The Major Classes triggered at game Start in the Draw Function (Invaders n Player)
* The NFT Logic of Claiming NFTs and Showcasing the UI of the right side of the Screen
* The Initializing Logic of references Classes from another Js File, it later became apparent to me how this worked and I could access as much cross-file Values as i wanted.

So in short, this Game files upon close study became simple and I decided to just build on it which was soo fun!.

### New Features Implemented into the Invaders Game

#### Level Progression
The First thing I wanted to do was to ensure that Players comfortably progressed through Levels with Customised Property which would give breath to Understand the game and Enjoy it's features. 

So I added const variables in the Invaders.js document that would hold the Level properties (level & playerLevels), which are being Looped through when Initialising the Aliens and to Update the player Speed, Bullet Speed and Max Bullet Count properties. 

This introduced a more dynamic feel to the Game because you are Competition against different strength of Aliens each Level (using improving Player perks too).

NB: During Level Progressing, I amped the health property for Aliens to make them require multiple contact shots to be Eliminated, this was very cool because Higher Levels could contain smaller Number of Aliens but with Extra health.

The Methods Powering the Level Progression Features includes:
`in Invaders.js`
* updateBullets
* upgradePlayer
* advanced nextLevel
* initialise Aliens (utilising the numberofALiens, and alienHealth)
* checkCollision(utilising the alienHealth property to check for collided)

`in Player.js`
* updateSpeed, updateBulletSpeed, updateBulletCount (which is called from Invaders.js)
* shoot upgraded to utilize bulletSpeed and maxBulletCount resp


#### **Persistent Player Data**, In-game Currency and Scoring
This was a feature that set the groundwork for the integration of Powerups. So I added a simple Coins Earninsg through Levels that is accumulated based on the Score player receives in a Level. 
The socring is further calculated using a Simple comboMultiplier so that precise shooters earn more coins.
How does it work?: so the ComboMultiplier checks for alien hits within the last 3 seconds and increases the combo score so that continuously hitting aliens gives a very high score. 
The Coins is obtained from the Score with a Simple Division and it's finally stored in the localStorage, so that even if the game ends the player doesn't lose it (bcos they'll need to buy powerups).
The Methods powering this feature includes:
`in Player.js`
* updateScore
* updateCombo
* reserAfterResume (called in sketch.js)
* resetForNewLevel (which isn't needed tbh)
* savePlayerData & loadPlayerData ( which is used to store n retrieve the coins value, n could be extended for other data)

#### **Powerups**
So I really wanted to test out this feature as it was suggested in the Bounty, and I thought it would be extremely fun to have.
So I decided to create three different kinds of Powerup, 

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

### Collection Link:

https://hub.immutable.com/projects/11446236-6349-42b7-bbae-57855458d9c7/3ef83fc0-b8a2-4838-baff-d626002699a1/collections/0xcc21556b1b08e76bdbfbd5220c24c12723d0e540


![powerup collection chel007](https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmcMeGhGVJ6tCfVyyee8MWnFjCicbbpteasnHAJqCc7fqX)

#### **Miscellaneous and Extras**
So some other features that could clash because of the changes in my game was basically the game start logic, so Instead of just starting the game as the passport client updates the userProfile, i added an extra check for the Nft Data retrieved by ListAllNfts By Address.

So the Game checks if both functions return success with values before starting

And Secondly, a new PauseScreen.js Class is created that logs the value of next Level, Score, Coins and both the resume & buyPoweup Button when the game is paused to make it more Intuitive to View the Player stats and Interact with the Powerups
