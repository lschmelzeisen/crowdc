export default class Map {
    constructor(game, width, height) {
        this.game = game;
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
        // Move camera position based on cursor keys
        if (this.cursors.up.isDown)
            this.cameraPosition.y -= 10
        if (this.cursors.down.isDown)
            this.cameraPosition.y += 10
        if (this.cursors.left.isDown)
            this.cameraPosition.x -= 10
        if (this.cursors.right.isDown)
            this.cameraPosition.x += 10

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