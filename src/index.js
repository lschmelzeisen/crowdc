require('pixi');
require('p2');
require('phaser');

import './style.css';

// Assets
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

        this.addInputListeners();

        // Spawn 11 guys immediately
        for (let _ of Array(10).keys()) {
            this.addSprite(Human, this.map)
        }
        this.addSprite(Human, this.map, 'orb-red')
    }

    update() {
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
        this.map.handleResize();
    }

    loadAssets() {
        this.game.load.image('orb-blue', OrbBlue);
        this.game.load.image('orb-red', OrbRed);
        this.game.load.image('orb-green', OrbGreen);
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
        let b_key = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        b_key.onDown.add(() => {
            this.addSprite(Human, this.map, 'orb-blue')
        });

        let r_key = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        r_key.onDown.add(() => {
            this.addSprite(Human, this.map, 'orb-red')
        });

        let g_key = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        g_key.onDown.add(() => {
            this.addSprite(Human, this.map, 'orb-green')
        })
    }
}

new Crowdc();
