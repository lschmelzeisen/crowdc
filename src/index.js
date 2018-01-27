require('pixi');
require('p2');
require('phaser');

import './style.css';
import Arrow from './assets/sprites/arrow.png';
import OrbBlue from './assets/custom/orb-blue.png';
import OrbRed from './assets/custom/orb-red.png';
import Human from './modules/human.js';

class Crowdc {
    constructor() {
        this.spriteCount = 0
        this.game = new Phaser.Game(
            window.innerWidth,
            window.innerHeight,
            Phaser.AUTO,
            'game',
            this);
    }

    preload() {
        this.loadAssets()
    }

    create() {
        window.addEventListener('resize', () => {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        });

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#0072bc';
        this.sprite = this.game.add.sprite(400, 300, 'arrow');
        this.sprite.anchor.setTo(0.5, 0.5);
        //  Enable Arcade Physics for the sprite
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //  Tell it we don't want physics to manage the rotation
        this.sprite.body.allowRotation = false;

        this.game.input.onDown.add(() => {
            this.addSprite(Human)
        }, this)

        // Spawn 10 guys immediately
        for (let _ of Array(10).keys()) {
            this.addSprite(Human)
        }
        this.addSprite(Human, 'orb-red')
    }

    update() {
        this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, 60, this.game.input.activePointer, 500);
    }

    render() {
        let x = 32;
        let y = 96;
        let yi = 16;
        this.game.time.advancedTiming = true // enable fps logging

        this.game.debug.spriteInfo(this.sprite, 32, 32);
        this.game.debug.text('Sprite count: ' + this.spriteCount, x, y += yi, '#fff', 'sans 10px');
        this.game.debug.text(`FPS (now/min/max): ${this.game.time.fps}/${this.game.time.fpsMin}/${this.game.time.fpsMax}`, x, y += yi, '#fff', 'sans 10px');
    }

    loadAssets() {
        this.game.load.image('orb-blue', OrbBlue);
        this.game.load.image('orb-red', OrbRed);
        this.game.load.image('arrow', Arrow);
    }

    addSprite(spriteClassName) {
        this.spriteCount++;
        new spriteClassName(this.game, Array.prototype.slice.call(arguments, 1))
    }
}

new Crowdc();
