const SCROLL_BORDER_SIZE = 50;
const SCROLL_SPEED = 20;
const ZOOM_SPEED = 5;
const MIN_ZOOM_FACTOR = 0.2;
const MAX_ZOOM_FACTOR = 5;
const MAP_BORDER_SIZE = 20;

export default class Map {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.canvas = document.getElementById('game').firstChild;
        this.canvas.addEventListener('wheel', (event) => this.handleZoom(event));

        this.zoomFactor = 1.0;
        this.cameraPosition = new Phaser.Point(0, 0);
        this.cameraAllowXMovement = false;
        this.cameraAllowYMovement = false;
        this.cameraNeedsUpdate = false;
        this.mouseCursorStyle = 'auto';
        this.handleResize();

        // Group that will be moved/scaled to simulate camera movement/zoom.
        // Add all elements that should be in the game world, i.e. not in the
        // UI, to this group!
        this.group = this.game.add.group(this.game.world, 'map.group');

        // Map border
        this.mapBorder = this.game.add.graphics(0, 0);
        this.mapBorder.beginFill(0x333333);
        this.mapBorder.drawRect(
            -MAP_BORDER_SIZE,
            -MAP_BORDER_SIZE,
            this.width + 2 * MAP_BORDER_SIZE,
            this.height + 2 * MAP_BORDER_SIZE);
        this.group.add(this.mapBorder);
        // Map sprite
        this.sprite = this.game.add.tileSprite(0, 0, this.width, this.height, 'grass');
        this.group.add(this.sprite);
        // Camera indicator sprite
        this.cameraIndicator = this.game.add.sprite(0, 0, 'particle');
        this.cameraIndicator.anchor.set(0.5, 0.5);
        this.group.add(this.cameraIndicator);
    }

    handleScrolling() {
        // Booleans that tracks if moues is in scroll trigger area
        let mouseLeft = false;
        let mouseRight = false;
        let mouseUp = false;
        let mouseDown = false;

        if (this.cameraAllowXMovement) {
            mouseLeft = this.game.input.x < SCROLL_BORDER_SIZE;
            mouseRight = this.game.input.x > this.game.scale.width - SCROLL_BORDER_SIZE;

            if (this.cursors.left.isDown || mouseLeft)
                this.cameraMoveLeft();
            if (this.cursors.right.isDown || mouseRight)
                this.cameraMoveRight();

            if (this.cameraNeedsUpdate)
                this.cameraClampX();
        }

        if (this.cameraAllowYMovement) {
            mouseUp = this.game.input.y < SCROLL_BORDER_SIZE;
            mouseDown = this.game.input.y > this.game.scale.height - SCROLL_BORDER_SIZE;

            if (this.cursors.up.isDown || mouseUp)
                this.cameraMoveUp();
            if (this.cursors.down.isDown || mouseDown)
                this.cameraMoveDown();

            if (this.cameraNeedsUpdate)
                this.cameraClampY();
        }

        if (this.cameraNeedsUpdate) {
            this.cameraNeedsUpdate = false;
            console.log('Updating camera...');

            this.group.x = -this.cameraPosition.x;
            this.group.y = -this.cameraPosition.y;

            // Reposition camera indicator
            this.cameraIndicator.x = (this.cameraPosition.x + this.game.width / 2) / this.zoomFactor;
            this.cameraIndicator.y = (this.cameraPosition.y + this.game.height / 2) / this.zoomFactor;
        }

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
        if (this.mouseCursorStyle != oldMouseCursorStyle)
            this.canvas.style.cursor = this.mouseCursorStyle;
    }

    handleResize() {
        if (this.game.scale.width / this.zoomFactor - 2 * MAP_BORDER_SIZE >= this.width) {
            this.cameraCenterX();
            this.cameraAllowXMovement = false;
        } else {
            this.cameraClampX();
            this.cameraAllowXMovement = true;
        }

        if (this.game.scale.height / this.zoomFactor - 2 * MAP_BORDER_SIZE >= this.height) {
            this.cameraCenterY();
            this.cameraAllowYMovement = false;
        } else {
            this.cameraClampY();
            this.cameraAllowYMovement = true;
        }
    }

    handleZoom(event) {
        this.zoomFactor += -event.deltaY * ZOOM_SPEED / 1000;
        this.zoomFactor = Phaser.Math.clamp(this.zoomFactor, MIN_ZOOM_FACTOR, MAX_ZOOM_FACTOR);

        // this.game.world.scale.set(this.zoomFactor);
        this.group.scale.set(this.zoomFactor);
        this.handleResize();
    }

    cameraMoveLeft() {
        this.cameraPosition.x -= SCROLL_SPEED / this.zoomFactor;
        this.cameraNeedsUpdate = true;
    }

    cameraMoveRight() {
        this.cameraPosition.x += SCROLL_SPEED / this.zoomFactor;
        this.cameraNeedsUpdate = true;
    }

    cameraMoveUp() {
        this.cameraPosition.y -= SCROLL_SPEED / this.zoomFactor;
        this.cameraNeedsUpdate = true;
    }

    cameraMoveDown() {
        this.cameraPosition.y += SCROLL_SPEED / this.zoomFactor;
        this.cameraNeedsUpdate = true;
    }

    cameraCenterX() {
        this.cameraPosition.x = -(this.game.width - this.width * this.zoomFactor) / 2;
        this.cameraNeedsUpdate = true;
    }

    cameraCenterY() {
        this.cameraPosition.y = -(this.game.height - this.height * this.zoomFactor) / 2;
        this.cameraNeedsUpdate = true;
    }

    cameraClampX() {
        this.cameraPosition.clampX(
            -MAP_BORDER_SIZE * this.zoomFactor,
            (this.width + MAP_BORDER_SIZE) * this.zoomFactor - this.game.width);
        this.cameraNeedsUpdate = true;
    }

    cameraClampY() {
        this.cameraPosition.clampY(
            -MAP_BORDER_SIZE * this.zoomFactor,
            (this.height + MAP_BORDER_SIZE) * this.zoomFactor - this.game.height);
        this.cameraNeedsUpdate = true;
    }
}