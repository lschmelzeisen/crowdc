require('pixi');
require('p2');
require('phaser');

import Arrow from './assets/sprites/arrow.png';


class Crowdc {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', this);
    }

    preload() {
        this.game.load.image('arrow', Arrow);
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#0072bc';

        this.sprite = this.game.add.sprite(400, 300, 'arrow');
        this.sprite.anchor.setTo(0.5, 0.5);

        //  Enable Arcade Physics for the sprite
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        //  Tell it we don't want physics to manage the rotation
        this.sprite.body.allowRotation = false;
    }

    update() {
        this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, 60, this.game.input.activePointer, 500);
    }

    render() {
        this.game.debug.spriteInfo(this.sprite, 32, 32);
    }
}

var game = new Crowdc();
