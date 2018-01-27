import {getRandomGridPoint} from '../helpers/index'

export default class Human {
    constructor(game, image) {
        this.image = image || 'orb-blue';

        this.origin = getRandomGridPoint(game.width, game.height);

        this.sprite = game.add.sprite(this.origin.x, this.origin.y, this.image);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.moveToTarget(game)
    }

    moveToTarget(game) {
        this.target = getRandomGridPoint(game.width, game.height);

        // Used for debugging. We want to view where the red orb is going. TODO: REMOVE!
        if (this.image === 'orb-red') {
            if (this.targetSprite)
                this.targetSprite.destroy();

            this.targetSprite = game.add.sprite(this.target.x, this.target.y, 'orb-red');
            this.targetSprite.anchor.setTo(0.5, 0.5);
            this.targetSprite.scale.setTo(0.5, 0.5);
        }

        let speed = 200; // px/s
        let distance = game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        let duration = (distance / speed) * 1000;

        this.sprite.rotation = game.physics.arcade.moveToXY(this.sprite, this.target.x, this.target.y, speed, duration);

        if (this.timer)
            clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.moveToTarget(game);
        }, duration)
    }
}
