import {getRandomGridPoint} from '../helpers/index'

export default class Human {
    constructor(state, image) {
        this.state = state;
        this.image = image || 'orb-blue';

        this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, this.image);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.state.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.inputEnabled = true
        this.sprite.events.onInputDown.add(() => this.destroy(), this);

        this.moveToTarget();
        this.sprite.update = () => this.update(this)
    }

    moveToTarget() {
        this.target = getRandomGridPoint(this.state.map.width, this.state.map.height);

        // Used for debugging. We want to view where the red orb is going. TODO: REMOVE!
        if (this.image === 'orb-red') {
            if (this.targetSprite)
                this.targetSprite.destroy();

            this.targetSprite = this.state.game.add.sprite(this.target.x, this.target.y, 'orb-red');
            this.targetSprite.anchor.setTo(0.5, 0.5);
            this.targetSprite.scale.setTo(0.5, 0.5);
        }

        const SPEED = 150; // px/s
        let distance = this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        let duration = (distance / SPEED) * 1000;

        this.sprite.rotation = this.state.game.physics.arcade.moveToXY(this.sprite, this.target.x, this.target.y, SPEED, duration);
    }

    update(human) {
        if (human.target) {
            if (Phaser.Rectangle.contains(this.sprite.body, human.target.x, human.target.y)) {
                this.sprite.body.velocity.setTo(0, 0);
                this.moveToTarget()
            }
        }
    }

    destroy() {
        if (this.targetSprite)
            this.targetSprite.destroy();
        this.state.removeSprite(this);
    }
}
