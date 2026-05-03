import { Corners2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "./cameras/CameraMovementManager";

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

    public getCamera(): Camera {
        return this.camera;
    }
}

export default CameraSystem;
