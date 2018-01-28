import {drawPlus} from "../helpers";

export const GRID_SIZE = 32;

export default class Grid {
    constructor(state) {
        this.graphics = state.game.add.graphics(0, 0);
        state.map.group.add(this.graphics);

        for (let i = 0; i <= state.map.width / GRID_SIZE; i++)
            for (let j = 0; j <= state.map.height / GRID_SIZE; j++) {
                this.graphics.lineStyle(2, 0x222222, 1);
                drawPlus(this.graphics, i * GRID_SIZE, j * GRID_SIZE, 4);
            }
    }

    toGridCoords(x, y) {
        return new Phaser.Point(x - x % GRID_SIZE, y - y % GRID_SIZE);
    }
}
