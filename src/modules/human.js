import {getRandomGridPoint, getObjectsCollidingBounds} from '../helpers/index'
import {CLICK_MODES,HUMAN_HEALTH} from '../consts'
import {findPath} from "./pathfinding";
import {GRID_SIZE} from "./grid";

export class Human {

    constructor(state, health) {
        this.state = state;

        //this.origin = getRandomGridPoint(this.state.map.width, this.state.map.height);

        this.origin = new Phaser.Point(32+16,32+16);

        this.sprite = this.state.game.add.sprite(this.origin.x, this.origin.y, 'orb-red');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.human = this;
        this.state.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        // this.moveToTarget();
        this.sprite.update = () => this.update();
        this.setHealth(health);
    }

    setTarget(target) {
        this.target = target;
        this.movementPlan = findPath(this.sprite,target,this.state);
    }

    moveToTarget() {
        // this.target = getRandomGridPoint(this.state.map.width, this.state.map.height);
        //
        // const SPEED = 150; // px/s
        // let distance = this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y);
        // let duration = (distance / SPEED) * 1000;
        //
        // this.sprite.rotation = this.state.game.physics.arcade.moveToObject(this.sprite, this.target, SPEED, duration);
    }

    update() {

        // path(new Phaser.Point(this.sprite.x,this.sprite.y), this.target, this.state);
        //
        if (this.target) {
            if (this.isHealthy()) {
                getObjectsCollidingBounds(this.state.game, this.sprite.getBounds(),
                    this.state.sickGroup, () => this.infect());


            }
            if (this.movementPlan.length > 0) {
                let point = this.movementPlan[0];
                if (point.distance(this.sprite) < 10) {
                    this.movementPlan.shift();
                } else {
                    this.sprite.rotation = this.state.game.physics.arcade.moveToObject(this.sprite, point, 150);

                }
            } else this.target = null;

            // if (this.state.game.physics.arcade.distanceToXY(this.sprite, this.target.x, this.target.y) < 3) {
            //     this.sprite.body.velocity.setTo(0, 0);
            //     this.moveToTarget();
            // }
        } else {
            let point = null;
            do {
                point = getRandomGridPoint(this.state.map.width, this.state.map.height);
            } while (this.state.walls.convertedMatrix[Math.floor(point.y/GRID_SIZE)][Math.floor(point.x/GRID_SIZE)]);
            this.setTarget(point);
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
