const CAMERA_DEFAULT_ZOOM = 0.55;
const CAMERA_MIN_ZOOM = 0.2;
const CAMERA_MAX_ZOOM = 1.5;
const CAMERA_ZOOM_STEP = 0.15;

class CameraSystem {
    private scene: Phaser.Scene;
    private camera: Phaser.Cameras.Scene2D.Camera;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        this.setupZoomControls();
    }

    private setupZoomControls() {
        this.scene.input.on('wheel', (
            _pointer: Phaser.Input.Pointer,
            _gameObjects: Phaser.GameObjects.GameObject[],
            _deltaX: number,
            deltaY: number,
            _deltaZ: number
        ) => {
            // Zoom out (scroll down = deltaY > 0) or zoom in (scroll up = deltaY < 0)
            const zoomChange = deltaY > 0 ? -CAMERA_ZOOM_STEP : CAMERA_ZOOM_STEP;
            const newZoom = Phaser.Math.Clamp(
                this.camera.zoom + zoomChange, 
                CAMERA_MIN_ZOOM, 
                CAMERA_MAX_ZOOM
            );

            this.camera.setZoom(newZoom);
        });

        // Drag to pan with middle or right button
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown) return;
            if (pointer.middleButtonDown() || pointer.rightButtonDown()) {
                this.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.camera.zoom;
                this.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.camera.zoom;
            }
        });

        // Disable context menu for right click
        this.scene.input.mouse?.disableContextMenu();
    }

    public setupBattlefieldCamera(centerX: number, centerY: number) {
        this.camera.setZoom(CAMERA_DEFAULT_ZOOM);
        this.camera.centerOn(centerX, centerY);
    }

    public update(delta: number) {
        // Reserved for future camera updates per frame
    }
}

export default CameraSystem;
