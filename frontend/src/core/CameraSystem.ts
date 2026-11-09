import { Corners2D, Point2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "@/core/cameras/CameraMovementManager";
import StoreSystem from "@/core/StoreSystem";
import { calculateCameraCorners, calculateHUDPosition, resolveCameraConfiguration } from "@/core/cameras/CameraCalculations";
import type { Bounds2D, CameraViewport } from "@/core/cameras/CameraCalculations";

type Camera = Phaser.Cameras.Scene2D.Camera;

class CameraSystem {
    private gameScene: GameScene;
    private camera: Camera;
    private boardBounds?: Bounds2D;

    public initialize(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.camera = gameScene.cameras.main;
        CameraMovementManager.initialize(gameScene, this.camera, () => this.boardBounds);
    }

    /** `boardOrigin` is where the battlefield container sits, around which the board is drawn. */
    public setupBattlefieldCamera(centerX: number, centerY: number, boardOrigin: Point2D) {
        const battlefield = StoreSystem.getBattlefield();
        const { tl, br } = battlefield.getCorners();
        this.boardBounds = { left: boardOrigin.x + tl.x, top: boardOrigin.y + tl.y, right: boardOrigin.x + br.x, bottom: boardOrigin.y + br.y };
        const maxPlayersPerSide = battlefield.getMaxPlayersPerSide();
        const cameraConfiguration = resolveCameraConfiguration(maxPlayersPerSide);

        this.camera.setZoom(cameraConfiguration.zoom);
        this.camera.centerOn(centerX, centerY + cameraConfiguration.yOffset);
    }

    public getCameraCorners(): Corners2D {
        return calculateCameraCorners(this.getViewport());
    }

    public getCamera(): Phaser.Cameras.Scene2D.Camera {
        return this.camera;
    }

    public getScale(): Phaser.Scale.ScaleManager {
        return this.gameScene.scale;
    }

    public getHUDPosition(screenX: number, screenY: number): Point2D {
        return calculateHUDPosition(this.getViewport(), screenX, screenY);
    }

    private getViewport(): CameraViewport {
        const { width, height } = this.gameScene.scale;
        return {
            scrollX: this.camera.scrollX,
            scrollY: this.camera.scrollY,
            zoom: this.camera.zoom,
            screenWidth: width,
            screenHeight: height
        };
    }
}

export default CameraSystem;
