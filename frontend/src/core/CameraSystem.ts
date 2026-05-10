import { Corners2D, Point2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "@/core/cameras/CameraMovementManager";
import StoreSystem from "@/core/StoreSystem";

type Camera = Phaser.Cameras.Scene2D.Camera;

type MaxPlayersPerSide = number;
type CameraConfiguration = { 
    zoom: number,
    yOffset: number
}
const DEFAULT_CONFIGURATION: CameraConfiguration = {zoom: 0.40, yOffset: 0};
const CAMERA_CONFIGURATIONS = new Map<MaxPlayersPerSide, CameraConfiguration>();
CAMERA_CONFIGURATIONS.set(1, {zoom: 1.1, yOffset: -100});
CAMERA_CONFIGURATIONS.set(2, {zoom: 0.85, yOffset: -60});
CAMERA_CONFIGURATIONS.set(3, {zoom: 0.65, yOffset: 50});
CAMERA_CONFIGURATIONS.set(4, {zoom: 0.52, yOffset: 180});

class CameraSystem {
    private gameScene: GameScene;
    private camera: Camera;

    public initialize(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.camera = gameScene.cameras.main;
        CameraMovementManager.initialize(gameScene, this.camera);
    }

    public setupBattlefieldCamera(centerX: number, centerY: number) {
        const battlefield = StoreSystem.getBattlefield();
        const maxPlayersPerSide = battlefield.getMaxPlayersPerSide();
        const cameraConfiguration = CAMERA_CONFIGURATIONS.get(maxPlayersPerSide) || DEFAULT_CONFIGURATION;

        this.camera.setZoom(cameraConfiguration.zoom);
        this.camera.centerOn(centerX, centerY + cameraConfiguration.yOffset);
    }

    public getCameraCorners(): Corners2D {
        const { width: scaledWidth, height: scaledHeight } = this.gameScene.scale;
        const zoom = this.camera.zoom;
        const width = scaledWidth / zoom;
        const height = scaledHeight / zoom;
        const x = (scaledWidth - width) / 2;
        const y = (scaledHeight - height) / 2;

        return {
            tl: { x, y },
            tr: { x: x + width, y },
            bl: { x, y: y + height },
            br: { x: x + width, y: y + height }
        }
    }

    public getCamera(): Phaser.Cameras.Scene2D.Camera {
        return this.camera;
    }

    public getScale(): Phaser.Scale.ScaleManager {
        return this.gameScene.scale;
    }

    public getHUDPosition(screenX: number, screenY: number): Point2D {
        const { width, height } = this.gameScene.scale;
        const zoom = this.camera.zoom;
        const centerX = width / 2;
        const centerY = height / 2;

        return {
            x: this.camera.scrollX + (screenX - centerX) / zoom + centerX,
            y: this.camera.scrollY + (screenY - centerY) / zoom + centerY
        };
    }
}

export default CameraSystem;
