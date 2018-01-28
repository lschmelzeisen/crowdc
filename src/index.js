import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Map from './modules/map.js';
import {
    HealthyHumanFactory,
    InfectedHumanFactory,
    SickHumanFactory
} from './modules/human.js';
import State from './modules/state.js';

// CSS
import './style.css';

// Assets
import OrbBlue from './assets/custom/orb-blue.png';
import OrbRed from './assets/custom/orb-red.png';
import OrbGreen from './assets/custom/orb-green.png';
import Grass from './assets/custom/grass.png';
import Wall from './assets/custom/wall.png';
import Kaboom from './assets/custom/explosion.png';
import {CLICK_MODES} from './consts'

// JS
import Map from './modules/map.js';
import Grid from './modules/grid.js';
import Walls from './modules/walls.js';
import {findPath} from "./modules/pathfinding";


import {HealthyHumanFactory, InfectedHumanFactory, SickHumanFactory} from './modules/human.js';
import State from './modules/state.js';
import {getRandomGridPoint} from './helpers/index'


class Crowdc {
    constructor() {
        this.game = new Phaser.Game(
            window.innerWidth,
            window.innerHeight,
            Phaser.AUTO,
            'game', {
                preload: () => this.preload(this),
                create: () => this.create(this),
                render: () => this.render(this),
                update: () => this.update(this)
            });
        this.state = new State(this.game);
    }

    /**
     * StateManager Methods
     * `this` in the following methods is an instance of Phaser.StateManager.
     */

    preload(crowdc) {
        crowdc.loadAssets();
    }

    create(crowdc) {
        window.addEventListener('resize', () => crowdc.resize());

        crowdc.game.time.advancedTiming = true; // enable fps logging

        crowdc.game.physics.startSystem(Phaser.Physics.ARCADE);
        crowdc.game.stage.backgroundColor = '#161616';

        crowdc.addInputListeners();

        let map = new Map(this.game, 512, 512);
        crowdc.state.create(map);

        // Spawn 1 red guy immediately
        crowdc.state.addSprite(SickHumanFactory);
    }

    update(crowdc) {
        crowdc.state.update();
    }

    render(crowdc) {
        let x = 32;
        let y = 32;
        let yi = 16;
        //
        this.game.debug.text(`FPS (now/min/max): ${crowdc.game.time.fps}/${crowdc.game.time.fpsMin}/${crowdc.game.time.fpsMax}`, x, y += yi, '#fff', 'sans 10px');
        //
        // // this.game.debug.text('Sprite count: ' + crowdc.state.spriteCount, x, y += 2 * yi, '#fff', 'sans 10px');
        this.game.debug.text('Click mode: ' + crowdc.state.clickMode + ' (switch with k/w)', x, y += 2 * yi, '#fff', 'sans 10px');
        //
        // this.game.debug.inputInfo(x, y += 2 * yi);
        // let pos = this.state.map.calcCameraCoords(new Phaser.Point(
        //     this.state.game.input.activePointer.worldX,
        //     this.state.game.input.activePointer.worldY));
        // this.game.debug.text(pos, x, y += 6 * yi);
        // this.game.debug.cameraInfo(crowdc.game.camera, x, y += 2 * yi);
        // //this.game.debug.inputInfo(x, y += 2 * yi);
        // //this.game.debug.cameraInfo(crowdc.game.camera, x, y += 6 * yi);
    }

    /**
     * "Normal" crowdc methods
     * `this` in the following methods is an instance of Crowdc.
     */

    resize() {
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.state.map.handleResize();
    }

    loadAssets() {
        this.game.load.image('orb-blue', OrbBlue);
        this.game.load.image('orb-red', OrbRed);
        this.game.load.image('orb-green', OrbGreen);
        this.game.load.image('grass', Grass);
        this.game.load.spritesheet('wall', Wall);
        this.game.load.spritesheet('kaboom', Kaboom, 128, 128);
    }

    addInputListeners() {
        let b_key = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        b_key.onDown.add(() => this.state.addSprite(InfectedHumanFactory));

        let r_key = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        r_key.onDown.add(() => this.state.addSprite(SickHumanFactory));

        let g_key = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        g_key.onDown.add(() => this.state.addSprite(HealthyHumanFactory));

        let x_key = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        x_key.onDown.add(() => this.state.resetSprites());

        let p_key = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        p_key.onDown.add(() => {
            let points = findPath(new Phaser.Point(32,32),new Phaser.Point(480,480),this.state);
            console.log(points);
            let graphics = this.state.game.add.graphics(0, 0);
            this.state.map.group.add(graphics);
            graphics.beginFill(0xFF0000, 1);
            points.forEach(p => graphics.drawCircle(p.x,p.y,10));
        });

        let a_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        a_key.onDown.add(() => {
            for (let _ of Array(10).keys()) {
                this.state.addSprite(HealthyHumanFactory)
                this.state.addSprite(InfectedHumanFactory)
                this.state.addSprite(SickHumanFactory)
            }
        });

        let k_key = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        k_key.onDown.add(() => this.state.clickMode = CLICK_MODES.KILL);
        let w_key = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        w_key.onDown.add(() => this.state.clickMode = CLICK_MODES.WALL);
    }
}

new Crowdc();
