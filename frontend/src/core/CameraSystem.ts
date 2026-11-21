import { Point2D } from "@/domain/Geometry";
import { GameScene } from "@/scenes/Game";
import CameraMovementManager from "@/core/cameras/CameraMovementManager";
import StoreSystem from "@/core/StoreSystem";
import ProjectionSystem from "@/core/ProjectionSystem";
import { dispatchBoardCameraStrategy } from "@/core/cameras/BoardCameraStrategyDispatcher";
import { calculateBoundsOfPoints, calculateHUDPosition } from "@/core/cameras/CameraCalculations";
import type { Bounds2D, CameraViewport } from "@/core/cameras/CameraCalculations";
import type { BoardFraming } from "@/core/cameras/BoardCameraStrategy";
import { calculateZoneEdgeMargin } from "@/game/zone/ZoneLayout";

type Camera = Phaser.Cameras.Scene2D.Camera;

class CameraSystem {
    private gameScene: GameScene;
    private camera: Camera;
    private boardBounds?: Bounds2D;
    private board?: Omit<BoardFraming, 'screen'>;

    public initialize(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.camera = gameScene.cameras.main;
        CameraMovementManager.initialize(gameScene, this.camera, () => this.boardBounds);
    }

    /** `boardOrigin` is where the battlefield container sits, around which the board is drawn. */
    public setupBattlefieldCamera(centerX: number, centerY: number, boardOrigin: Point2D) {
        const battlefield = StoreSystem.getBattlefield();
        // The table is drawn projected by the camera, so its corners are the projected ones
        const { tl, tr, bl, br } = ProjectionSystem.toCorners3D(battlefield.getCorners());
        this.boardBounds = calculateBoundsOfPoints([tl, tr, bl, br], boardOrigin);
        this.board = {
            boardBounds: this.boardBounds,
            boardCenter: { x: centerX, y: centerY },
            maxPlayersPerSide: battlefield.getMaxPlayersPerSide(),
            zoneEdgeMargin: calculateZoneEdgeMargin(battlefield)
        };

        this.fitToScreen();
    }

    /** Frames the board again for the current size of the screen, so it stays in view and centered (VIEW-24). */
    public fitToScreen() {
        if (this.board) {
            const { width, height } = this.gameScene.scale;
            const { zoom, center } = dispatchBoardCameraStrategy().frame({ ...this.board, screen: { width, height } });

            this.camera.setZoom(zoom);
            this.camera.centerOn(center.x, center.y);
        }
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
