class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Preload assets for the main menu scene
        this.load.image('Menu', './assets/images/Menu.png');
    }

    create() {
        // Add background image
        this.add.image(400, 300, 'Menu');

        // Add title text
        this.add.text(550, 70, 'Potion Collector', { fontSize: '48px', fill: '#000000' }).setOrigin(0.5);

        // Add buttons
        const playButton = this.add.text(170, 200, 'PLAY', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const creditsButton = this.add.text(170, 300, 'CREDITS', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const quitButton = this.add.text(170, 400, 'QUIT', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add event listeners to buttons
        playButton.setInteractive().on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        creditsButton.setInteractive().on('pointerdown', () => {
            // Display credits scene
            this.scene.launch('CreditsScene');
            this.scene.pause();
        });

        quitButton.setInteractive().on('pointerdown', () => {
            // Show an alert when quitting the game
            alert('Exiting the game');
        });
    }
}

// Export the class to be used in other files
export default MainMenuScene;
