class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        // Preload assets for the game over scene if needed
    }

    create() {
        // Display game over message or score
        this.add.text(400, 100, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Add buttons
        const retryButton = this.add.text(400, 200, 'Retry', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const mainMenuButton = this.add.text(400, 300, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add event listeners to buttons
        retryButton.setInteractive().on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        mainMenuButton.setInteractive().on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

// Export the class to be used in other files
export default GameOverScene;
