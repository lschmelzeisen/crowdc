import {drawPlus} from "../helpers";

export default class Grid {
    constructor(state) {
        this.graphics = state.game.add.graphics(0, 0);
        state.map.group.add(this.graphics);

        for (var i = 0; i <= state.map.width / 32; i++)
            for (var j = 0; j <= state.map.height / 32; j++) {
                this.graphics.lineStyle(2, 0x222222, 1);
                drawPlus(this.graphics, i * 32, j * 32, 4);
            }
    }

    toGridCoords(x, y) {
        return new Phaser.Point(x - x % 32, y - y % 32);
    }
}
