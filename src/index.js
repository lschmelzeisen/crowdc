require('pixi');
require('p2');
require('phaser');

import Arrow from './assets/sprites/arrow.png';
import Ship from './assets/sprites/thrust_ship.png';


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('arrow', Arrow);
    game.load.image('ship', Ship);
}

var sprite;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'ship');
    sprite.anchor.setTo(0.5, 0.5);

    //  Enable Arcade Physics for the sprite
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

}

function update() {

    sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}