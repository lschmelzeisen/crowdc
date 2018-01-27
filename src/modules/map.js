const SCROLL_BORDER_SIZE = 50;

export default class Map {
    constructor(game, width, height) {
        this.game = game;
        this.canvas = document.getElementById('game').firstChild;
        this.width = width;
        this.height = height;

        this.cursors = game.input.keyboard.createCursorKeys();

        this.game.world.resize(this.width, this.height);

        // World Sprite
        this.sprite = this.game.add.tileSprite(0, 0, this.width, this.height, 'grass');

        // Camera setup
        this.cameraPosition = new Phaser.Point(this.width / 2, this.height / 2);
        this.cameraFocus = this.game.add.sprite(100, 100, 'particle');
        this.game.camera.follow(this.cameraFocus);
    }

    handleScrolling() {
        const mouseUp = this.game.input.y < SCROLL_BORDER_SIZE;
        const mouseDown = this.game.input.y > this.game.scale.height - SCROLL_BORDER_SIZE;
        const mouseLeft = this.game.input.x < SCROLL_BORDER_SIZE;
        const mouseRight = this.game.input.x > this.game.scale.width - SCROLL_BORDER_SIZE;

        // Move camera position based on cursor keys or mouse
        if (this.cursors.up.isDown || mouseUp)
            this.cameraPosition.y -= 10;
        if (this.cursors.down.isDown || mouseDown)
            this.cameraPosition.y += 10;
        if (this.cursors.left.isDown || mouseLeft)
            this.cameraPosition.x -= 10;
        if (this.cursors.right.isDown || mouseRight)
            this.cameraPosition.x += 10;

        // Chance mouse icon if it's used for scrolling
        // TODO: only change css style if changed from last from as potential performance boost.
        if (mouseUp) {
            this.canvas.style.cursor = 'n-resize';
            if (mouseLeft)
                this.canvas.style.cursor = 'nw-resize';
            else if (mouseRight)
                this.canvas.style.cursor = 'ne-resize';
        } else if (mouseDown) {
            this.canvas.style.cursor = 's-resize';
            if (mouseLeft)
                this.canvas.style.cursor = 'sw-resize';
            else if (mouseRight)
                this.canvas.style.cursor = 'se-resize';
        } else if (mouseLeft) {
            this.canvas.style.cursor = 'w-resize';
        } else if (mouseRight) {
            this.canvas.style.cursor = 'e-resize';
        } else {
            this.canvas.style.cursor = 'auto';
        }

        // Clamp camera position to game world
        this.cameraPosition.clampX(0, this.width);
        this.cameraPosition.clampY(0, this.height);

        // Move camera by adjusting world boundaries. (This actually leaves the
        // camera static, but moves the world under the camera. This is
        // necessary, because if you move the camera, you can't move it out of
        // world bounds.)
        this.game.world.setBounds(
            this.cameraPosition.x - this.game.scale.width / 2,
            this.cameraPosition.y - this.game.scale.height / 2,
            this.cameraPosition.x + this.game.scale.width / 2,
            this.cameraPosition.y + this.game.scale.height / 2);
        this.cameraFocus.x = this.cameraPosition.x - this.cameraFocus.width / 2;
        this.cameraFocus.y = this.cameraPosition.y - this.cameraFocus.height / 2;
    }

    handleResize() {
    }
}