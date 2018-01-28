import {getRandomGridPoint, getObjectsCollidingBounds} from '../helpers/index'
import {CLICK_MODES, HUMAN_HEALTH} from '../consts'

export class Human {

    constructor(state, health) {
        this.state = state;

        this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, 'orb-red');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.human = this;
        this.state.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.moveToTarget();
        this.sprite.update = () => this.update();
        this.setHealth(health);
    }

    moveToTarget() {
        this.target = getRandomGridPoint(this.state.map.width, this.state.map.height);

        const SPEED = 150; // px/s
        let distance = this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        let duration = (distance / SPEED) * 1000;

        this.sprite.rotation = this.state.game.physics.arcade.moveToObject(this.sprite, this.target, SPEED, duration);
    }

    update() {
        if (this.target) {
            if (this.isHealthy())
                getObjectsCollidingBounds(this.state.game, this.sprite.getBounds(),
                    this.state.sickGroup, () => this.infect());

            if (this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y) < 3) {
                this.sprite.body.velocity.setTo(0, 0);
                this.moveToTarget()
            }
        }

    }

    destroyWithClick() {
        if (this.state.clickMode === CLICK_MODES.KILL)
            this.destroy();
    }

    destroy() {
        if (this.makeSickTimer)
            clearTimeout(this.makeSickTimer);
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
        this.sprite.loadTexture('orb-green');
    }

    infect() {
        this.health = HUMAN_HEALTH.INFECTED;
        this.state.healthyGroup.remove(this.sprite);
        this.sprite.loadTexture('orb-blue');
        this.state.infectedGroup.add(this.sprite);
        this.makeSickTimer = setTimeout(() => this.makeSick(), 5000);
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
        super(state, HUMAN_HEALTH.HEALTHY);
    }
}

export class InfectedHumanFactory extends Human {
    constructor(state) {
        super(state, HUMAN_HEALTH.INFECTED);
    }
}

export class SickHumanFactory extends Human {
    constructor(state) {
        super(state, HUMAN_HEALTH.SICK);
    }
}
