import * as Constants from '@/core/Constants';

class CameraSystem {
    private camera: Phaser.Cameras.Scene2D.Camera;

    constructor(scene: Phaser.Scene) {
        this.camera = scene.cameras.main;
    }

    public setupBattlefieldCamera(centerX: number, centerY: number) {
        this.camera.setZoom(Constants.CAMERA_DEFAULT_ZOOM);
        this.camera.centerOn(centerX, centerY);
    }
}

export default CameraSystem;
