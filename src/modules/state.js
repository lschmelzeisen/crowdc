import Walls from "./walls";
import Grid from "./grid";
import Explosions from "./explosions";
import {CLICK_MODES} from '../consts';

export default class State {
    constructor(game) {
        this.spriteCount = 0;
        this.sprites = [];
        this.game = game;
        this.clickMode = CLICK_MODES.KILL;
    }

    create(map) {
        this.map = map;

        this.grid = new Grid(this);
        this.walls = new Walls(this);

        this.humanGroup = this.game.add.group(this.map.group);
        this.healthyGroup = this.game.add.spriteBatch(null, 'healthy');
        this.map.group.add(this.healthyGroup);
        this.infectedGroup = this.game.add.spriteBatch(null, 'infected');
        this.map.group.add(this.infectedGroup);
        this.sickGroup = this.game.add.spriteBatch(null, 'sick');
        this.map.group.add(this.sickGroup);

        this.explosions = new Explosions(this);
    }

    update() {
        this.map.handleScrolling();
        this.walls.update();
    }

    addSprite(spriteClassName) {
        let args = Array.prototype.slice.call(arguments, 1);
        let spriteWrapper = new spriteClassName(this, ...args);
        this.spriteCount++;
        this.sprites.push(spriteWrapper);
        return spriteWrapper;
    }

    removeSprite(spriteWrapper) {
        this.spriteCount--;
        let index = this.sprites.indexOf(spriteWrapper);
        if (index > -1) {
            spriteWrapper.sprite.destroy();
            this.sprites.splice(index, 1);
        }
    }

    resetSprites() {
        this.healthyGroup.removeAll(true)
        this.infectedGroup.removeAll(true)
        this.sickGroup.removeAll(true)
        this.sprites = []
        this.spriteCount = 0
    }
}


