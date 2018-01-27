
export default class Grid {
    constructor(state) {
        this.graphics = state.game.add.graphics(0, 0);
        state.map.group.add(this.graphics);

        for (var i = 0; i <= state.map.width / 32; i++)
            for (var j = 0; j <= state.map.height / 32; j++) {
                this.graphics.beginFill(0xFF0000, 1);
                this.graphics.drawCircle(i*32, j*32, 10);
            }
    }

    toGridCoords(x,y) {
        return new Phaser.Point(x - x % 32,y - y % 32);
    }
}
