export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Define starColors, currentStarColorIndex, starsCollected, and gameOver as class properties
        this.starColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
        this.currentStarColorIndex = 0;
        this.starsCollected = 0;
        this.gameOver = false; // Initialize gameOver
    }

    preload() {
        // Load game assets before game starts
        this.load.image('background', './assets/images/Background.png');
        this.load.image('star', './assets/images/star.png');
        this.load.image('bomb', './assets/images/Bomb.png');
        this.load.spritesheet('dude', './assets/images/Player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('ground', './assets/images/Platform.png');
        this.load.image('ground1', './assets/images/PlatformG.png');
        this.load.image('ground2', './assets/images/Platform1.png');
        this.load.image('ground3', './assets/images/Platform2.png');
        this.load.image('ground4', './assets/images/Platform3.png');
    }

    create() {
        // Add background image
        this.add.image(400, 300, 'background');

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground1').refreshBody(); // PG
        this.platforms.create(600, 400, 'ground2'); // P1
        this.platforms.create(673, 220, 'ground3'); // P2
        this.platforms.create(125, 250, 'ground4'); // P3

        // Player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);

        // Collider
        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Stars
        this.stars = this.physics.add.group();
        for (let i = 0; i < 5; i++) {
            this.createStar();
        }

        // Star Collider
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Score Text
        this.score = 0;
        this.scoreText = this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Stars Collected UI
        this.starsCollectedText = this.add.text(493, 50, 'Stars Collected: 0', { fontSize: '24px', fill: '#fff' });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    createStar() {
        let x = Phaser.Math.Between(50, 750);
        let y = 0;
        let star = this.stars.create(x, y, 'star');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        // Change player color
        let colorName = this.starColors[this.currentStarColorIndex]; // Access starColors from class property
        this.setPlayerColor(player, colorName);

        this.currentStarColorIndex = (this.currentStarColorIndex + 1) % this.starColors.length; // Update currentStarColorIndex

        // Increase player size/scale by 10% every 5 stars collected
        this.starsCollected++;
        if (this.starsCollected % 5 === 0) {
            player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
            // Create a bomb
            this.createBomb();
        }

        // Update score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        this.starsCollectedText.setText('Stars Collected: ' + this.starsCollected);

        // Create a new star
        this.createStar();
    }

    setPlayerColor(player, colorName) {
        switch (colorName) {
            case 'Red':
                player.setTint(0xFF0000);
                break;
            case 'Orange':
                player.setTint(0xFFA500);
                break;
            case 'Yellow':
                player.setTint(0xFFFF00);
                break;
            case 'Green':
                player.setTint(0x00FF00);
                break;
            case 'Blue':
                player.setTint(0x0000FF);
                break;
            case 'Indigo':
                player.setTint(0x4B0082);
                break;
            case 'Violet':
                player.setTint(0x8A2BE2);
                break;
            default:
                break;
        }
    }

    createBomb() {
        let x = Phaser.Math.Between(50, 750);
        let y = 0;
        let bomb = this.physics.add.sprite(x, y, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        // Collider between bomb and platforms
        this.physics.add.collider(bomb, this.platforms);

        // Collider between bomb and player
        this.physics.add.collider(this.player, bomb, this.hitBomb, null, this);
    }

    hitBomb(player, bomb) {
        // Pause the game
        this.physics.pause();
    
        // Set player tint to red
        player.setTint(0xff0000);
    
        // Display "Game Over" text
        this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    
        // Transition to game over scene after a delay (for visibility)
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene');
        });
    }
    
}
