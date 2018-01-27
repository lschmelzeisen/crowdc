const SCROLL_BORDER_SIZE = 50;
const MAP_BORDER_SIZE = 20;

export default class Map {
    constructor(game, width, height) {
        this.game = game;
        this.canvas = document.getElementById('game').firstChild;
        this.width = width;
        this.height = height;

        this.cursors = game.input.keyboard.createCursorKeys();

        // Set world size to be bigger than the window so camera can be moved
        // TODO: find out how these parameters have to be set in relation to window size
        this.game.world.setBounds(-5000, -5000, 10000, 10000);
        // Move camera half the size of the viewport back so the pivot point is in the center of our view
        this.game.camera.x = -game.width / 2;
        this.game.camera.y = -game.height / 2;

        // Initialize camera position in center of world
        this.cameraPosition = new Phaser.Point(this.width / 2, this.height / 2);

        // Mouse cursor style tracker
        this.mouseCursorStyle = 'auto';

        // Zoom setup
        this.zoomFactor = 1.0;
        this.canvas.addEventListener('wheel', (event) => {
            this.zoomFactor += -event.deltaY / 200;
            this.zoomFactor = Phaser.Math.clamp(this.zoomFactor, 0.2, 5);
            this.game.world.scale.set(this.zoomFactor);
            console.log(this.zoomFactor);
        });

        // Map border
        this.mapBorder = this.game.add.graphics(0, 0);
        this.mapBorder.beginFill(0x333333);
        this.mapBorder.drawRect(-MAP_BORDER_SIZE, -MAP_BORDER_SIZE, this.width + 2 * MAP_BORDER_SIZE, this.height + 2 * MAP_BORDER_SIZE);
        // Map sprite
        this.sprite = this.game.add.tileSprite(0, 0, this.width, this.height, 'grass');
        // Camera indicator sprite
        this.cameraIndicator = this.game.add.sprite(100, 100, 'particle');
    }

    handleScrolling() {
        // Booleans that tracks if moues is in position for tracking
        let mouseLeft = false;
        let mouseRight = false;
        let mouseUp = false;
        let mouseDown = false;

        // Change logical camera position
        if (this.game.scale.width / this.zoomFactor >= this.width) {
            this.cameraPosition.x = this.width / 2;
        } else {
            mouseLeft = this.game.input.x < SCROLL_BORDER_SIZE;
            mouseRight = this.game.input.x > this.game.scale.width - SCROLL_BORDER_SIZE;

            if (this.cursors.left.isDown || mouseLeft)
                this.cameraPosition.x -= 10 / this.zoomFactor;
            if (this.cursors.right.isDown || mouseRight)
                this.cameraPosition.x += 10 / this.zoomFactor;

            const unscrollableAreaSize = this.game.scale.width / 2 / this.zoomFactor - MAP_BORDER_SIZE;
            this.cameraPosition.clampX(unscrollableAreaSize, this.width - unscrollableAreaSize);
        }
        if (this.game.scale.height / this.zoomFactor >= this.height) {
            this.cameraPosition.y = this.height / 2;
        } else {
            mouseUp = this.game.input.y < SCROLL_BORDER_SIZE;
            mouseDown = this.game.input.y > this.game.scale.height - SCROLL_BORDER_SIZE;

            if (this.cursors.up.isDown || mouseUp)
                this.cameraPosition.y -= 10 / this.zoomFactor;
            if (this.cursors.down.isDown || mouseDown)
                this.cameraPosition.y += 10 / this.zoomFactor;

            const unscrollableAreaSize = this.game.scale.height / 2 / this.zoomFactor - MAP_BORDER_SIZE;
            this.cameraPosition.clampY(unscrollableAreaSize, this.height - unscrollableAreaSize);
        }

        this.game.world.pivot = this.cameraPosition;

        this.cameraIndicator.x = this.cameraPosition.x - this.cameraIndicator.width / 2;
        this.cameraIndicator.y = this.cameraPosition.y - this.cameraIndicator.height / 2;

        // Change mouse icon if it's used for scrolling
        let oldMouseCursorStyle = this.mouseCursorStyle;
        if (mouseUp) {
            this.mouseCursorStyle = 'n-resize';
            if (mouseLeft)
                this.mouseCursorStyle = 'nw-resize';
            else if (mouseRight)
                this.mouseCursorStyle = 'ne-resize';
        } else if (mouseDown) {
            this.mouseCursorStyle = 's-resize';
            if (mouseLeft)
                this.mouseCursorStyle = 'sw-resize';
            else if (mouseRight)
                this.mouseCursorStyle = 'se-resize';
        } else if (mouseLeft) {
            this.mouseCursorStyle = 'w-resize';
        } else if (mouseRight) {
            this.mouseCursorStyle = 'e-resize';
        } else {
            this.mouseCursorStyle = 'auto';
        }
        if (this.mouseCursorStyle != oldMouseCursorStyle) {
            this.canvas.style.cursor = this.mouseCursorStyle;
        }
    }

    handleResize() {
        this.game.camera.x = -this.game.width / 2;
        this.game.camera.y = -this.game.height / 2;
    }
}