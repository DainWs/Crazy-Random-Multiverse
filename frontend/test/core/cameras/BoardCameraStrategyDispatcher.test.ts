import { afterEach, describe, expect, it } from 'vitest';
import { dispatchBoardCameraStrategy, useBoardCamera } from '@/core/cameras/BoardCameraStrategyDispatcher';
import { DEFAULT_BOARD_CAMERA } from '@/core/SettingsSystem';
import TiltedCameraStrategy from '@/core/cameras/TiltedCameraStrategy';
import TopDownCameraStrategy from '@/core/cameras/TopDownCameraStrategy';

// VIEW-57
describe('BoardCameraStrategyDispatcher', () => {
    afterEach(() => {
        useBoardCamera(DEFAULT_BOARD_CAMERA);
    });

    it('draws the board with the top-down camera when it is in use', () => {
        useBoardCamera('TOP_DOWN');

        expect(dispatchBoardCameraStrategy()).toBeInstanceOf(TopDownCameraStrategy);
    });

    it('draws the board with the tilted camera when it is in use', () => {
        useBoardCamera('TILTED');

        expect(dispatchBoardCameraStrategy()).toBeInstanceOf(TiltedCameraStrategy);
    });
});
