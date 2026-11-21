import { describe, expect, it } from 'vitest';
import TiltedCameraStrategy, { DEPTH_OFFSET, FOCAL_LENGTH } from '@/core/cameras/TiltedCameraStrategy';
import { REFERENCE_SCREEN, resolveCameraConfiguration } from '@/core/cameras/CameraCalculations';
import type { BoardFraming } from '@/core/cameras/BoardCameraStrategy';

const BOARD_CENTER = { x: 960, y: 540 };
const FRAMING: BoardFraming = {
    screen: REFERENCE_SCREEN,
    boardBounds: { left: 0, top: 0, right: 1920, bottom: 1080 },
    boardCenter: BOARD_CENTER,
    maxPlayersPerSide: 2,
    zoneEdgeMargin: 200
};

describe('TiltedCameraStrategy', () => {
    const camera = new TiltedCameraStrategy();

    // VIEW-57
    it('draws a far point of the board smaller than a near one', () => {
        const far = camera.project({ x: 100, y: -1000 });
        const near = camera.project({ x: 100, y: 1000 });

        expect(near.scale).toBeGreaterThan(far.scale);
    });

    it('keeps the center of the table at the scale of its depth', () => {
        const center = camera.project({ x: 0, y: 0 });

        expect(center.scale).toBeCloseTo(FOCAL_LENGTH / DEPTH_OFFSET, 10);
    });

    // VIEW-24
    it('frames the board with the configuration of its players per side on the reference screen', () => {
        const configuration = resolveCameraConfiguration(FRAMING.maxPlayersPerSide);

        const frame = camera.frame(FRAMING);

        expect(frame).toEqual({ zoom: configuration.zoom, center: { x: BOARD_CENTER.x, y: BOARD_CENTER.y + configuration.yOffset } });
    });

    // VIEW-24
    it('scales the zoom with the screen', () => {
        const halfScreen = { width: REFERENCE_SCREEN.width / 2, height: REFERENCE_SCREEN.height / 2 };

        const frame = camera.frame({ ...FRAMING, screen: halfScreen });

        expect(frame.zoom).toBeCloseTo(resolveCameraConfiguration(FRAMING.maxPlayersPerSide).zoom / 2, 10);
    });

    // VIEW-1
    it('deforms the cards and shows the depth of the table', () => {
        expect([camera.deformsCards, camera.showsTableDepth]).toEqual([true, true]);
    });
});
