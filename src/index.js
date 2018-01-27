require('pixi');
require('p2');
require('phaser');

import './style.css';

// Assets
import Arrow from './assets/sprites/arrow.png';
import OrbBlue from './assets/custom/orb-blue.png';
import Grass from './assets/tests/grass1.png';
import Harrier from './assets/tests/harrier3.png';
import Particle from './assets/misc/particle_smallest.png';

// JS
import Map from './modules/map.js';
import Human from './modules/human.js';

class Crowdc {
    constructor() {
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

        console.log(this.game.world.width, this.game.world.height);

        this.map = new Map(this.game, 512, 512);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#0072bc';
        this.sprite = this.game.add.sprite(400, 300, 'arrow');
        this.sprite.anchor.setTo(0.5, 0.5);
        //  Enable Arcade Physics for the sprite
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //  Tell it we don't want physics to manage the rotation
        this.sprite.body.allowRotation = false;

        this.game.input.onDown.add(() => {
            new Human(this.game)
        }, this)
    }

    update() {
        this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, 60, this.game.input.activePointer, 500);
        this.map.handleScrolling();
    }

    render() {
        // this.game.debug.spriteInfo(this.sprite, 32, 32);
        this.game.debug.inputInfo(32, 32);
        this.game.debug.cameraInfo(this.game.camera, 32, 128);
    }

    resize() {
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        console.log(this.game.world.width, this.game.world.height);
        this.map.handleResize();
    }

    loadAssets() {
        this.game.load.image('orb-blue', OrbBlue);
        this.game.load.image('arrow', Arrow);
        this.game.load.image('grass', Grass);
        this.game.load.image('harrier', Harrier);
        this.game.load.image('particle', Particle);
    }
}

new Crowdc();
