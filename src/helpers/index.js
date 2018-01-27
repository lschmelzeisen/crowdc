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
