import type BoardCameraStrategy from '@/core/cameras/BoardCameraStrategy';
import type { BoardCamera } from '@/core/SettingsSystem';
import TiltedCameraStrategy from '@/core/cameras/TiltedCameraStrategy';
import TopDownCameraStrategy from '@/core/cameras/TopDownCameraStrategy';
import { DEFAULT_BOARD_CAMERA } from '@/core/SettingsSystem';

const CAMERA_STRATEGIES = new Map<BoardCamera, BoardCameraStrategy>([
    ['TOP_DOWN', new TopDownCameraStrategy()],
    ['TILTED', new TiltedCameraStrategy()]
]);

/** The camera the board is drawn with now: a choice of the settings applies only when the scene draws the board again (VIEW-57). */
let activeCamera: BoardCamera = DEFAULT_BOARD_CAMERA;

function useBoardCamera(camera: BoardCamera) {
    activeCamera = camera;
}

function dispatchBoardCameraStrategy(): BoardCameraStrategy {
    return CAMERA_STRATEGIES.get(activeCamera)!;
}

export { dispatchBoardCameraStrategy, useBoardCamera };
