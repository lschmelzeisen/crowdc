import {GRID_SIZE} from "./grid";

export default class Walls {
    constructor(state) {
        this.state = state;
        this.walls = this.state.game.add.spriteBatch();
        state.map.group.add(this.walls);

        // this.wallMatrix = Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(false))
        this.wallMatrix = new Array(GRID_SIZE);
        for (let i = 0; i !== GRID_SIZE; ++i)
            this.wallMatrix[i] = Array(GRID_SIZE).fill(false);
    }

    update() {
        if (this.state.game.input.activePointer.leftButton.isDown)
            this.buildWall();
    }

    buildWall() {
        let pos = this.state.map.calcCameraCoords(new Phaser.Point(
            this.state.game.input.activePointer.worldX,
            this.state.game.input.activePointer.worldY));

        if ((pos.x >= 0 && pos.x < this.state.map.width) &&
            (pos.y >= 0 && pos.y < this.state.map.height)) {
            pos = this.state.grid.toGridCoords(pos.x, pos.y);

            if (!this.wallMatrix[pos.y / GRID_SIZE][pos.x / GRID_SIZE]) {
                this.wallMatrix[pos.y / GRID_SIZE][pos.x / GRID_SIZE] = true;

                let sprite = this.walls.create(pos.x, pos.y, 'wall', 0);
                const SCALE_FACTOR = GRID_SIZE / 32; // 32 is image size
                sprite.scale.set(SCALE_FACTOR, SCALE_FACTOR);
            }
        }
    }
}
