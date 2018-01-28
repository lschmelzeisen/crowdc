import {getObjectsCollidingBounds} from "../helpers";

const EXPLOSION_SIZE = 32;
const EXPLOSION_SCALE_FACTOR = EXPLOSION_SIZE / 32; // 128 is image size

export default class Explosions {
    constructor(state) {
        this.state = state;

        this.state.game.input.onTap.add(this.fire, this);
    }

    fire() {
        let pos = this.state.map.calcCameraCoords(new Phaser.Point(
            this.state.game.input.activePointer.worldX,
            this.state.game.input.activePointer.worldY));

        if ((pos.x >= 0 && pos.x < this.state.map.width) &&
            (pos.y >= 0 && pos.y < this.state.map.height)) {
            pos.clampX(EXPLOSION_SIZE / 2, this.state.map.width - EXPLOSION_SIZE / 2);
            pos.clampY(EXPLOSION_SIZE / 2, this.state.map.height - EXPLOSION_SIZE / 2);

            let explosion = this.state.game.add.sprite(pos.x, pos.y, 'kaboom', 0, this.state.map.group);
            explosion.anchor.set(0.5, 0.5);
            explosion.scale.set(EXPLOSION_SCALE_FACTOR, EXPLOSION_SCALE_FACTOR);
            explosion.animations.add('boom');
            explosion.play('boom', 30, false, true);

            explosion.update = () => this.update(explosion);
        }
    }

    update(explosion) {
        let bounds = explosion.getBounds();

        for (let group of [this.state.healthyGroup, this.state.infectedGroup, this.state.sickGroup]) {
            getObjectsCollidingBounds(this.state.game, bounds,
                group, (humanSprite) => humanSprite.sprite.human.destroy());
        }

        setTimeout(() => explosion.destroy(), 50);
    }
}