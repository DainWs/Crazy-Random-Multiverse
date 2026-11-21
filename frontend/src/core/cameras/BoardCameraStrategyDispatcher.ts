import type BoardCameraStrategy from '@/core/cameras/BoardCameraStrategy';
import TiltedCameraStrategy from '@/core/cameras/TiltedCameraStrategy';

const tiltedCamera = new TiltedCameraStrategy();

/** The camera the board is drawn with (VIEW-57). */
function dispatchBoardCameraStrategy(): BoardCameraStrategy {
    return tiltedCamera;
}

export { dispatchBoardCameraStrategy };
