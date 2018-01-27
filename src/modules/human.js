import {getRandomGridPoint} from '../helpers/index'
import {HUMAN_HEALTH} from '../consts'


export class Human {

    constructor(state, health) {
        this.state = state;

        if (!Human.healthyGroup)
            Human.healthyGroup = this.state.game.add.spriteBatch();
        if (!Human.infectedGroup)
            Human.infectedGroup = this.state.game.add.spriteBatch();
        if (!Human.sickGroup)
            Human.sickGroup = this.state.game.add.spriteBatch();

        this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        // this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, this.image);

        if (health === HUMAN_HEALTH.HEALTHY) {
            this.sprite = Human.healthyGroup.create(this.origin.x, this.origin.y, 'orb-green');
        } else if (health === HUMAN_HEALTH.INFECTED) {
            this.sprite = Human.infectedGroup.create(this.origin.x, this.origin.y, 'orb-blue');
        } else {
            this.sprite = Human.sickGroup.create(this.origin.x, this.origin.y, 'orb-red');
        }

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

            for (let outerSpriteWrapper of this.state.sprites) {
                for (let innerSpriteWrapper of this.state.sprites) {
                    if (outerSpriteWrapper !== innerSpriteWrapper) {
                        let boundsA = outerSpriteWrapper.sprite.getBounds();
                        let boundsB = innerSpriteWrapper.sprite.getBounds();
                        // infect each other
                        if (outerSpriteWrapper.isSick() && innerSpriteWrapper.isHealthy()) {
                            if (Phaser.Rectangle.intersects(boundsA, boundsB))
                                innerSpriteWrapper.infect();
                        } else if (innerSpriteWrapper.isSick() && outerSpriteWrapper.isHealthy()) {
                            if (Phaser.Rectangle.intersects(boundsA, boundsB))
                                outerSpriteWrapper.infect();
                        }
                    }
                }
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
        Human.sickGroup.remove(this.sprite);
        this.health = HUMAN_HEALTH.HEALTHY;
        Human.healthyGroup.add(this.sprite);
        this.sprite.loadTexture('orb-green')
    }

    infect() {
        this.health = HUMAN_HEALTH.INFECTED;
        Human.healthyGroup.remove(this.sprite);
        this.sprite.loadTexture('orb-blue');
        Human.infectedGroup.add(this.sprite);
        setTimeout(() => this.makeSick(), 5000)
    }

    makeSick() {
        this.health = HUMAN_HEALTH.SICK;
        Human.infectedGroup.remove(this.sprite);
        this.sprite.loadTexture('orb-red');
        Human.sickGroup.add(this.sprite);
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
