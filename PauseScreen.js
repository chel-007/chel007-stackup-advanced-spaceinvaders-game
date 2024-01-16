class PauseScreen {
    constructor(level, player) {
        this.level = level;
        this.player = player;
        this.coinImage = loadImage('extra-coin.png'); // Load the coin image
        this.nextLevelText = `Next Level: ${this.level.rowsCount + 2}`;

    }

    display() {
        // Draw a white rectangle to cover the screen
        fill(255);
        rect(0, 0, width, height);

        if (this.level.rowsCount === 11) {
            fill(0);
            textSize(32);
            textAlign(CENTER, CENTER);
            text("Congratulations! You completed all levels.", width / 2, height / 2);

        }
        else {
        // Display the "Next Level" text based on level in the center of the screen
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(`Next Level: ${this.level.rowsCount + 1}`, width / 2, height / 2);

        }

        // Display coins, score, powerups, and a resume button
        textSize(16);
        console.log(this.level.rowsCount)

        const coinText = `Coins: ${this.player.coins}`;
    const coinTextWidth = textWidth(coinText); // Get the width of the coin text

    image(this.coinImage, width / 2 - coinTextWidth / 2 - 30, height / 2 + 20, 20, 20); // Adjust positioning of the coin image
    text(`Coins: ${this.player.coins}`, width / 2 - coinTextWidth / 10, height / 2 + 30); // Adjust positioning of the coin text


        text(`Score: ${this.player.score}`, width / 2, height / 2 + 60);

        text(`Combo: ${this.player.comboMultiplier}`, width / 2, height / 2 + 90);

        // Additional logic for resume button
        // ...
    }
}

