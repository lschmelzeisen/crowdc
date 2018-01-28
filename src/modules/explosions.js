import {GRID_SIZE} from "./grid";
import {CLICK_MODES} from "../consts"

const EXPLOSION_SIZE = 64;

export default class Explosions {
    constructor(state) {
        this.state = state;
        this.group = this.state.game.add.group(this.state.map.group);

        this.state.game.input.onTap.add(this.fire, this);
    }

    fire() {
        if (this.state.clickMode === CLICK_MODES.KILL) {
            let pos = this.state.map.calcCameraCoords(new Phaser.Point(
                this.state.game.input.activePointer.worldX,
                this.state.game.input.activePointer.worldY));

            if ((pos.x >= 0 && pos.x < this.state.map.width) &&
                (pos.y >= 0 && pos.y < this.state.map.height)) {
                pos.clampX(EXPLOSION_SIZE / 2, this.state.map.width - EXPLOSION_SIZE / 2);
                pos.clampY(EXPLOSION_SIZE / 2, this.state.map.height - EXPLOSION_SIZE / 2);

                let sprite = this.state.game.add.sprite(pos.x, pos.y, 'kaboom', 0, this.group);
                sprite.anchor.set(0.5, 0.5);
                const SCALE_FACTOR = EXPLOSION_SIZE / 128; // 128 is image size
                sprite.scale.set(SCALE_FACTOR, SCALE_FACTOR);
                sprite.animations.add('boom');
                sprite.play('boom', 30, false, true);
            }
        }
    }
}