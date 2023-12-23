class PauseScreen {
    constructor(level, coins, score, powerups) {
        this.level = level;
        this.coins = coins;
        this.score = score;
        this.powerups = powerups;
        this.nextLevelText = `Next Level: ${this.level + 1}`;
    }

    display() {
        // Draw a white rectangle to cover the screen
        fill(255);
        rect(0, 0, width, height);

        // Display the "Next Level" text based on level in the center of the screen
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(this.nextLevelText, width / 2, height / 2);

        // Display coins, score, powerups, and a resume button
        textSize(16);
        text(`Coins: ${this.coins}`, width / 2, height / 2 + 30);
        text(`Score: ${this.score}`, width / 2, height / 2 + 60);
        text(`Powerups: ${this.powerups}`, width / 2, height / 2 + 90);

        // Additional logic for resume button
        // ...
    }
}

