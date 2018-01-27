import {getRandomGridPoint} from '../helpers/index'
import {HUMAN_HEALTH} from '../consts'


export class Human {

    constructor(state, health) {
        this.state = state;

        this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, 'orb-red');

        this.sprite.anchor.setTo(0.5, 0.5);
        this.state.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(() => this.destroy(), this);

        this.moveToTarget();
        this.sprite.update = () => this.update();
        this.setHealth(health)
    }

    moveToTarget() {
        this.target = getRandomGridPoint(this.state.map.width, this.state.map.height);

        const SPEED = 150; // px/s
        let distance = this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        let duration = (distance / SPEED) * 1000;

        this.sprite.rotation = this.state.game.physics.arcade.moveToXY(this.sprite, this.target.x, this.target.y, SPEED, duration);
    }

    update() {
        if (this.target) {
            if (Phaser.Rectangle.contains(this.sprite.body, this.target.x, this.target.y)) {
                this.sprite.body.velocity.setTo(0, 0);
                this.moveToTarget()
            }

            if (this.isHealthy()) {
                this.state.game.physics.arcade.getObjectsAtLocation(this.sprite.body.x, this.sprite.body.y, this.state.sickGroup, (x, y) => this.infect());
            }
        }

    }

    destroy() {
        if (this.targetSprite)
            this.targetSprite.destroy();
        this.state.removeSprite(this);
    }

    /**
     * Health methods
     */

    setHealth(health) {
        switch (health) {
            case HUMAN_HEALTH.HEALTHY:
                this.heal();
                break;
            case HUMAN_HEALTH.INFECTED:
                this.infect();
                break;
            case HUMAN_HEALTH.SICK:
                this.makeSick();
                break;
        }
    }

    heal() {
        this.state.sickGroup.remove(this.sprite);
        this.health = HUMAN_HEALTH.HEALTHY;
        this.state.healthyGroup.add(this.sprite);
        this.sprite.loadTexture('orb-green')
    }

    infect() {
        this.health = HUMAN_HEALTH.INFECTED;
        this.state.healthyGroup.remove(this.sprite);
        this.sprite.loadTexture('orb-blue');
        this.state.infectedGroup.add(this.sprite);
        setTimeout(() => this.makeSick(), 5000)
    }

    makeSick() {
        this.health = HUMAN_HEALTH.SICK;
        this.state.infectedGroup.remove(this.sprite);
        this.sprite.loadTexture('orb-red');
        this.state.sickGroup.add(this.sprite);
    }

    isHealthy() {
        return this.health === HUMAN_HEALTH.HEALTHY;
    }

    isInfected() {
        return this.health === HUMAN_HEALTH.INFECTED;
    }

    isSick() {
        return this.health === HUMAN_HEALTH.SICK;
    }

}

export class HealthyHumanFactory extends Human {
    constructor(state) {
        super(state, HUMAN_HEALTH.HEALTHY)
    }
}

export class InfectedHumanFactory extends Human {
    constructor(state) {
        super(state, HUMAN_HEALTH.INFECTED)
    }
}

export class SickHumanFactory extends Human {
    constructor(state) {
        super(state, HUMAN_HEALTH.SICK)
    }
}
