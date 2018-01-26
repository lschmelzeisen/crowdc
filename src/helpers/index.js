export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomGridPoint(width, height) {
    return {
        x: getRandomArbitrary(0, width),
        y: getRandomArbitrary(0, height)
    }
}
