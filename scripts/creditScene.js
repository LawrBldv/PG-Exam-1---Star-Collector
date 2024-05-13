export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        // Background color
        this.cameras.main.setBackgroundColor('#000');

        // Credits text
        this.add.text(400, 200, 'Credits', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Developer: Lawrenzo Andrey Baldove', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, 'Section: A223', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 400, 'Program: EMC', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Back button
        const backButton = this.add.text(100, 500, 'Back', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        backButton.setInteractive(); // Make the button interactive
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene'); // Go back to the main menu
        });
    }
}
