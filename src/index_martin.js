
require('pixi');
require('p2');
require('phaser');

import Ship from './assets/sprites/thrust_ship.png';


// ok, this is so unbelievably unfinished, but the basic idea was:
// 1) create objects that can be send around on the playing field (MyShip)
// and instantiate multiple of those
// 2) then create StateMachine that can capture the different meanings of a click
// first click selects a unit (if a unit is under the cursor), otherwise it does nothing
// second click sets the target that the units moves towards
// 3) create an simplified input management that can get positions (for sending units around
// the map) and as well as ask what object (if any) is under that position


let StateMachine = function() {
    this.currentState = null;
};
StateMachine.prototype.constructor = StateMachine;
StateMachine.prototype.transition = function(state) {
    if (this.currentState)
        this.currentState.exit();

    this.currentState = state;
    this.currentState.enter();
};

let State = function(owner) {
    this.owner = owner;
};
State.prototype.constructor = State;
State.prototype.enter = function() { };
State.prototype.exit = function() { };

// yep, I don't have any better name right now
let MyController = function() {
    StateMachine.call(this);
};
MyController.prototype = Object.create(StateMachine);

let SelectUnitState = function(owner,game) {
    State.call(this,owner);
    this.game = game;
};

SelectUnitState.prototype.OnMouseDown = function(object,pointer) {

};

let MyShip = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.game = game;
    game.physics.enable(this,Phaser.Physics.ARCADE); // this can be changed to something better, I think
    this.target = null;
};
MyShip.prototype = Object.create(Phaser.Sprite.prototype);
MyShip.prototype.constructor = MyShip;

MyShip.prototype.setTarget = function(target) {
    this.target = target;
};

MyShip.prototype.update = function() {
    if (this.target) {
        this.rotation = this.game.physics.arcade.moveToXY(this, this.target.x,this.target.y,60);
        if (this.position.distance(this.target,true) < 10)
            this.target = null;
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('ship', Ship);
}

var unit;


function create() {
    game.input.mouse.capture = true;
    game.input.
    game.stage.backgroundColor = '#303030';

    unit = new MyShip(game, 400, 300);
    game.add.existing(unit);
    // sprite = this.add.sprite(400,300,'ship');
    // game.physics.enable(sprite,Phaser.Physics.ARCADE);
    //
    // game.sprite.add()
    // weapon = game.add.weapon(30, 'bullet');
    // weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    // weapon.bulletSpeed = 600;
    // weapon.fireRate = 100;
    //
    // sprite = this.add.sprite(400, 300, 'ship');
    // sprite.anchor.set(0.5);
    //
    // game.physics.arcade.enable(sprite);
    // sprite.body.drag.set(70);
    // sprite.body.maxVelocity.set(200);
    //
    // weapon.trackSprite(sprite,0,0,true);
    // cursors = this.input.keyboard.createCursorKeys();
    // fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

function update() {
    if (game.input.mousePointer.leftButton.isDown) {
        unit.setTarget(new Phaser.Phaser.Point(game.input.mousePointer.position.x, game.input.mousePointer.position.y));
    }
    // if (target) {
    //     sprite.rotation = game.physics.arcade.moveToPointer(sprite,60,game.target);
    //     //sprite.rotation = game.physics.arcade.accelerateToXY(sprite, target.x,target.y, 60, 500);
    // } else {
    //     sprite.body.velocity.x = 0;
    //     sprite.body.velocity.y = 0;
    // }

    // if (cursors.up.isDown) {
    //     game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
    // } else {
    //     sprite.body.acceleration.set(0);
    // }
    //
    // if (cursors.left.isDown) sprite.body.angularVelocity = -300;
    // else if (cursors.right.isDown) sprite.body.angularVelocity = 300;
    // else sprite.body.angularVelocity = 0;
    //
    // if (fireButton.isDown) weapon.fire();
    //
    // game.world.wrap(sprite);
}

function render() {
    // weapon.debug();
    game.debug.text("Hello World: " + game.input.activePointer.position.distance(new Phaser.Phaser.Point(10,20),true),10,20);
}