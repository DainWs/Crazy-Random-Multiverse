import { Corners2D, Point2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "@/core/cameras/CameraMovementManager";

type Camera = Phaser.Cameras.Scene2D.Camera;

class CameraSystem {
    private gameScene: GameScene;
    private camera: Camera;

    public initialize(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.camera = gameScene.cameras.main;
        CameraMovementManager.initialize(gameScene, this.camera);
    }

    public setupBattlefieldCamera(centerX: number, centerY: number) {
        this.camera.setZoom(CameraMovementManager.defaultZoom);
        this.camera.centerOn(centerX, centerY);
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
            x: (screenX - centerX) / zoom + centerX,
            y: (screenY - centerY) / zoom + centerY
        };
    }
}

export default CameraSystem;
