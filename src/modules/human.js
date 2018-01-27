import {getRandomGridPoint} from '../helpers/index'

export default class Human {
    constructor(state, image) {
        this.state = state;
        this.image = image || 'orb-blue';

        this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, this.image);
        this.state.map.group.add(this.sprite);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.state.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.inputEnabled = true
        this.sprite.events.onInputDown.add(() => this.destroy(), this);

        this.moveToTarget();
        this.sprite.update = () => this.update()
    }

    moveToTarget() {
        this.target = getRandomGridPoint(this.state.map.width, this.state.map.height);
        this.target = this.state.game.add.sprite(this.target.x, this.target.y);
        this.state.map.group.add(this.target);
        this.state.game.physics.enable(this.target, Phaser.Physics.ARCADE);

        // Used for debugging. We want to view where the red orb is going. TODO: REMOVE!
        if (this.image === 'orb-red') {
            if (this.targetSprite)
                this.targetSprite.destroy();

            this.targetSprite = this.state.game.add.sprite(this.target.x, this.target.y, 'orb-red');
            this.state.map.group.add(this.targetSprite);
            this.targetSprite.anchor.setTo(0.5, 0.5);
            this.targetSprite.scale.setTo(0.5, 0.5);
        }

        const SPEED = 100; // px/s
        let distance = this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        let duration = (distance / SPEED) * 1000;

        this.sprite.rotation = this.state.game.physics.arcade.moveToXY(this.sprite, this.target.x, this.target.y, SPEED, duration);
    }

    update() {
        if (this.target) {
            if (this.state.game.physics.arcade.distanceBetween(this.sprite, this.target) < 2) {
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
