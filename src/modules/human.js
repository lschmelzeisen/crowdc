import {getRandomGridPoint, getRandomArbitrary} from '../helpers/index'

export default class Human {
    constructor(game) {
        this.origin = getRandomGridPoint(game.width, game.height);

        this.sprite = game.add.sprite(this.origin.x, this.origin.y, 'trap');
        this.sprite.scale.setTo(0.5, 0.5)

        this.moveToTarget(game)
    }

    moveToTarget(game) {
        this.target = getRandomGridPoint(game.width, game.height);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        let speed = getRandomArbitrary(500, 5000); // random between 0.5s and 5s
        game.physics.arcade.moveToXY(this.sprite, this.target.x, this.target.y, 60, speed)

        if (this.timer)
            clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.moveToTarget(game)
        }, speed)
    }
}
