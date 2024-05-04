var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//Game initialization
var game = new Phaser.Game(config);

//Variable initialization
let player, cursors, score, scoreText, starsCollectedText;
let starColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
let currentStarColorIndex = 0;
let starsCollected = 0;

var platforms;

//load game assets before game starts
function preload ()
{
    this.load.image('background','./assets/images/Background.png');
    this.load.image('star','./assets/images/star.png');
    this.load.image('bomb', './assets/images/Bomb.png');
    this.load.spritesheet('dude', './assets/images/Player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('ground', './assets/images/Platform.png');


    //Platforms
    this.load.image('ground1', './assets/images/PlatformG.png');
    this.load.image('ground2', './assets/images/Platform1.png');
    this.load.image('ground3', './assets/images/Platform2.png');
    this.load.image('ground4', './assets/images/Platform3.png');
}

function create ()
{
    this.add.image(400, 300, 'background');

    //Controls
    cursors = this.input.keyboard.createCursorKeys();

    //Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground1').refreshBody(); //PG
    platforms.create(600, 400, 'ground2'); //P1
    platforms.create(673, 220, 'ground3'); //P2
    platforms.create(125, 250, 'ground4'); //P3


    //Player
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(1);

    //Colider
    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Stars
    stars = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        createStar(this);
    }

    // Star Collider
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Score Text
    score = 0;
    scoreText = this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Stars Collected UI
    starsCollectedText = this.add.text(493, 50, 'Stars Collected: 0', { fontSize: '24px', fill: '#fff' });
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function createStar(scene) {
    let x = Phaser.Math.Between(50, 750);
    let y = 0;
    let star = stars.create(x, y, 'star');
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
}

function collectStar(player, star)
{
    star.disableBody(true, true);

    // Change player color
    let colorName = starColors[currentStarColorIndex];
    setPlayerColor(player, colorName);

    currentStarColorIndex = (currentStarColorIndex + 1) % starColors.length;

    // Increase player size/scale by 10% every 5 stars collected
    starsCollected++;
    if (starsCollected % 5 === 0) {
        player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
        // Create a bomb
        createBomb(this);
    }

    // Update score
    score += 10;
    scoreText.setText('Score: ' + score);

    starsCollectedText.setText('Stars Collected: ' + starsCollected);

    // Create a new star
    createStar(this);
}

function setPlayerColor(player, colorName) {
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

function createBomb(scene) {
    let x = Phaser.Math.Between(50, 750);
    let y = 0;
    let bomb = scene.physics.add.sprite(x, y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    // Collider between bomb and platforms
    scene.physics.add.collider(bomb, platforms);

    // Collider between bomb and player
    scene.physics.add.collider(player, bomb, hitBomb, null, scene);
}

function hitBomb(player, bomb) {
    // Pause the game
    this.physics.pause();

    // Set player tint to red
    player.setTint(0xff0000);

    // Display "Game Over" text
    this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

    // Game over flag
    gameOver = true;
}
