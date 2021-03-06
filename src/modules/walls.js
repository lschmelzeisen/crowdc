import {GRID_SIZE} from "./grid";
import {CLICK_MODES} from '../consts';

const WALL_SCALE_FACTOR = GRID_SIZE / 32; // 32 is image size

export default class Walls {
    constructor(state) {
        this.state = state;
        this.walls = this.state.game.add.spriteBatch();
        state.map.group.add(this.walls);

        this.wallMatrix = new Array(GRID_SIZE);
        for (let i = 0; i !== GRID_SIZE; ++i)
            this.wallMatrix[i] = Array(GRID_SIZE).fill(false);

        this.convertedMatrix = new Array(GRID_SIZE);
        for (let i = 0; i !== GRID_SIZE; ++i)
            this.convertedMatrix[i] = Array(GRID_SIZE).fill(false);
    }

    update() {
        if (this.state.game.input.activePointer.leftButton.isDown)
            this.buildWall();
    }



    buildWall() {
        if (this.state.clickMode === CLICK_MODES.WALL) {
            let pos = this.state.map.calcCameraCoords(new Phaser.Point(
                this.state.game.input.activePointer.worldX,
                this.state.game.input.activePointer.worldY));

            if ((pos.x >= 0 && pos.x < this.state.map.width) &&
                (pos.y >= 0 && pos.y < this.state.map.height)) {
                pos = this.state.grid.toGridCoords(pos.x, pos.y);

            if (!this.wallMatrix[pos.y / GRID_SIZE][pos.x / GRID_SIZE]) {
                this.wallMatrix[pos.y / GRID_SIZE][pos.x / GRID_SIZE] = true;
                this.convertedMatrix[(pos.y / GRID_SIZE)][(pos.x / GRID_SIZE)] = true;
                this.convertedMatrix[(pos.y / GRID_SIZE)+1][(pos.x / GRID_SIZE)] = true;
                this.convertedMatrix[(pos.y / GRID_SIZE)][(pos.x / GRID_SIZE)+1] = true;
                this.convertedMatrix[(pos.y / GRID_SIZE)+1][(pos.x / GRID_SIZE)+1] = true;

                    let sprite = this.walls.create(pos.x, pos.y, 'wall', 0);
                    sprite.scale.set(WALL_SCALE_FACTOR, WALL_SCALE_FACTOR);
                }
            }
        }
    }
}
