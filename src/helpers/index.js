export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomGridPoint(width, height) {
    return {
        x: getRandomArbitrary(0, width),
        y: getRandomArbitrary(0, height)
    }
}

export function drawPlus(graphics, x, y, size) {
    graphics.moveTo(x - size, y);
    graphics.lineTo(x + size, y);
    graphics.moveTo(x, y - size);
    graphics.lineTo(x, y + size);
}


export function getObjectsCollidingBounds(game, bounds, group, callback) {
    let quadtree = new Phaser.QuadTree(
        game.world.bounds.x,
        game.world.bounds.y,
        game.world.bounds.width,
        game.world.bounds.height,
        10,
        4);

    quadtree.populate(group);

    let items = quadtree.retrieve(bounds);

    for (let item of items) {
        let itemBounds = item.sprite.getBounds();
        if (Phaser.Rectangle.intersects(bounds, itemBounds))
            callback(item);
    }
}
