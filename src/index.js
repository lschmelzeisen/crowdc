require('pixi');
require('p2');
require('phaser');

import './style.css';

// Assets
import Arrow from './assets/sprites/arrow.png';
import OrbBlue from './assets/custom/orb-blue.png';
import OrbRed from './assets/custom/orb-red.png';
import OrbGreen from './assets/custom/orb-green.png';
import Grass from './assets/tests/grass1.png';
import Harrier from './assets/tests/harrier3.png';
import Particle from './assets/misc/particle_smallest.png';

// JS
import Map from './modules/map.js';
import Human from './modules/human.js';

class Crowdc {
    constructor() {
        this.spriteCount = 0;
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
            this.resize()
        });

        this.game.time.advancedTiming = true; // enable fps logging

        this.map = new Map(this.game, 512, 512);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#0072bc';
        this.sprite = this.game.add.sprite(400, 300, 'arrow');
        this.sprite.anchor.setTo(0.5, 0.5);
        //  Enable Arcade Physics for the sprite
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //  Tell it we don't want physics to manage the rotation
        this.sprite.body.allowRotation = false;

        this.addInputListeners();

        // Spawn 10 guys immediately
        for (let _ of Array(10).keys()) {
            this.addSprite(Human)
        }
        this.addSprite(Human, 'orb-red')
    }

    update() {
        this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, 60, this.game.input.activePointer, 500);
        this.map.handleScrolling();
    }

    render() {
        let x = 32;
        let y = 32;
        let yi = 16;

        this.game.debug.text(`FPS (now/min/max): ${this.game.time.fps}/${this.game.time.fpsMin}/${this.game.time.fpsMax}`, x, y += yi, '#fff', 'sans 10px');

        this.game.debug.text('Sprite count: ' + this.spriteCount, x, y += 2 * yi, '#fff', 'sans 10px');

        this.game.debug.inputInfo(x, y += 2 * yi);
        this.game.debug.cameraInfo(this.game.camera, x, y += 6 * yi);
    }

    resize() {
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        console.log(this.game.world.width, this.game.world.height);
        this.map.handleResize();
    }

    loadAssets() {
        this.game.load.image('orb-blue', OrbBlue);
        this.game.load.image('orb-red', OrbRed);
        this.game.load.image('orb-green', OrbGreen);
        this.game.load.image('arrow', Arrow);
        this.game.load.image('grass', Grass);
        this.game.load.image('harrier', Harrier);
        this.game.load.image('particle', Particle);
    }

    addSprite(spriteClassName) {
        this.spriteCount++;
        let args = Array.prototype.slice.call(arguments, 1);
        new spriteClassName(this.game, ...args)
    }

    addInputListeners() {
        this.game.input.onDown.add(() => {
            this.addSprite(Human)
        }, this);

        let b_key = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        b_key.onDown.add(() => {
            this.addSprite(Human, 'orb-blue')
        });

        let r_key = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        r_key.onDown.add(() => {
            this.addSprite(Human, 'orb-red')
        });

        let g_key = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        g_key.onDown.add(() => {
            this.addSprite(Human, 'orb-green')
        })
    }
}

new Crowdc();
