

export default class Walls {
    constructor(state) {
        this.state = state;
        this.walls = this.state.game.add.group();
        state.map.group.add(this.walls);

        state.game.input.onDown.add(() => this.buildWall());
    }

    buildWall() {
        let pos = this.state.grid.toGridCoords(this.state.game.input.activePointer.worldX-this.state.map.group.x,
            this.state.game.input.activePointer.worldY-this.state.map.group.y);
        this.walls.create(pos.x,pos.y,'wall',0);
    }
}
