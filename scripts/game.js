
import MainMenuScene from '../scripts/menuScene.js';
import GameScene from '../scripts/gameScene.js';
import GameOverScene from '../scripts/gameOverScene.js';
import CreditsScene from '../scripts/creditScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene, GameScene, GameOverScene, CreditsScene], // Add all scene classes here
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
