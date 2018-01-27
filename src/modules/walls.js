export default class Walls {
    constructor(state) {
        this.state = state;
        this.walls = this.state.game.add.spriteBatch();
        state.map.group.add(this.walls);

        state.game.input.onDown.add(() => this.buildWall());
    }

    buildWall() {
        let pos = this.state.map.calcCameraCoords(new Phaser.Point(
            this.state.game.input.activePointer.worldX,
            this.state.game.input.activePointer.worldY));
        pos = this.state.grid.toGridCoords(pos.x, pos.y);
        if (pos.x >= 0 && pos.x < this.state.map.width && pos.y >= 0 && pos.y < this.state.map.height)
            this.walls.create(pos.x, pos.y, 'wall', 0);

    }
}
