export default class State {
    constructor(game, map) {
        this.spriteCount = 0;
        this.sprites = [];
        this.game = game;
        this.map = map;
    }

    addSprite(spriteClassName) {
        let args = Array.prototype.slice.call(arguments, 1);
        let spriteWrapper = new spriteClassName(this, ...args);
        this.spriteCount++;
        this.sprites.push(spriteWrapper);
    }

    removeSprite(spriteWrapper) {
        this.spriteCount--;
        let index = this.sprites.indexOf(spriteWrapper);
        if (index > -1) {
            spriteWrapper.sprite.destroy();
            this.sprites.splice(index, 1);
        }
    }
}


