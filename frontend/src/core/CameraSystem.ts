import { Corners2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "./cameras/CameraMovementManager";

type Camera = Phaser.Cameras.Scene2D.Camera;

class CameraSystem {
    private gameScene: GameScene;
    private mainCamera: Camera;
    private uiCamera: Camera;

    public initialize(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.mainCamera = gameScene.cameras.main;

        // Create a dedicated UI Camera that stays fixed
        const { width, height } = gameScene.scale;
        this.uiCamera = gameScene.cameras.add(0, 0, width, height);
        this.uiCamera.setName("UICamera");

        CameraMovementManager.initialize(gameScene, this.mainCamera);
    }

    public setupBattlefieldCamera(centerX: number, centerY: number) {
        this.mainCamera.setZoom(CameraMovementManager.defaultZoom);
        this.mainCamera.centerOn(centerX, centerY);
    }

    public showOnlyInMainCamera(gameObject: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[]) {
        this.uiCamera.ignore(gameObject);
    }

    public showOnlyInUICamera(gameObject: Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.GameObjects.GameObject[]) {
        this.mainCamera.ignore(gameObject);
    }

    public getCameraCorners(): Corners2D {
        const { width: scaledWidth, height: scaledHeight } = this.gameScene.scale;
        const zoom = this.mainCamera.zoom;
        const width = scaledWidth / zoom;
        const height = scaledHeight / zoom;
        
        // This calculates world-space corners based on current zoom and scroll
        const x = this.mainCamera.worldView.x;
        const y = this.mainCamera.worldView.y;

        return {
            tl: { x, y },
            tr: { x: x + width, y },
            bl: { x, y: y + height },
            br: { x: x + width, y: y + height }
        }
    }

    public getUIScreenCorners(): Corners2D {
        const { width, height } = this.gameScene.scale;
        return {
            tl: { x: 0, y: 0 },
            tr: { x: width, y: 0 },
            bl: { x: 0, y: height },
            br: { x: width, y: height }
        }
    }

    public getCamera(): Camera {
        return this.mainCamera;
    }

    public getUICamera(): Camera {
        return this.uiCamera;
    }
}

export default CameraSystem;
