import { describe, expect, it } from 'vitest';
import Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import {
    HUD_CORNER_PIECES_REACH,
    RENDER_SCALE,
    ZONE_BAR_GAP,
    ZONE_BAR_THICKNESS,
    ZONE_LABEL_PADDING,
    ZONE_NAME_GAP,
    ZONE_NAME_MAX_WIDTH
} from '@/core/Constants';
import { CARD_HEIGHT } from '@/game/cards/CardDimensions';
import { HAND_CARD_SCALE, HAND_RESTING_HIDDEN_RATIO } from '@/game/hand/HandLayoutCalculator';
import { calculateScreenFit } from '@/core/cameras/CameraCalculations';
import TopDownCameraStrategy, { TOP_DOWN_RESERVES, TOP_DOWN_SCALE } from '@/core/cameras/TopDownCameraStrategy';
import type { CameraFrame } from '@/core/cameras/BoardCameraStrategy';
import type { Size2D } from '@/domain/Geometry';

const PRECISION = 6;
const EPSILON = 1e-6;
const ZONE_EDGE_MARGIN = DEFAULT_SKIN.gridStep * 2;
const SMALLEST_WINDOW: Size2D = { width: 1280, height: 720 };
const LARGEST_WINDOW: Size2D = { width: 1920, height: 1080 };
/** A window narrower than 16:9 inside the supported range, where the width limits the table. */
const NARROW_WINDOW: Size2D = { width: 1280, height: 1080 };
/** How far the bar and the widest label of a side zone reach past its edge, in px of the reference screen (VIEW-49, VIEW-50). */
const SIDE_LABEL_WIDTH = ZONE_BAR_GAP + ZONE_BAR_THICKNESS + ZONE_NAME_GAP + 2 * ZONE_LABEL_PADDING + ZONE_NAME_MAX_WIDTH;
/** 2, 6 and 10 players put 1, 2 and 3 players on the widest side. */
const PLAYERS_PER_SIDE = [1, 2, 3];

/** The extent on the screen, in px of the canvas, of the table and the labels that stick out of it. */
interface ContentExtent {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

function toCanvas(window: Size2D): Size2D {
    return { width: window.width * RENDER_SCALE, height: window.height * RENDER_SCALE };
}

function frameTable(screen: Size2D, maxPlayersPerSide: number): { frame: CameraFrame; halfTable: number } {
    const halfTable = (Battlefield.sideSizeForPlayerCount(maxPlayersPerSide) / 2) * TOP_DOWN_SCALE;
    const frame = new TopDownCameraStrategy().frame({
        screen,
        boardBounds: { left: -halfTable, top: -halfTable, right: halfTable, bottom: halfTable },
        boardCenter: { x: 0, y: 0 },
        maxPlayersPerSide,
        zoneEdgeMargin: ZONE_EDGE_MARGIN
    });

    return { frame, halfTable };
}

function contentExtent(screen: Size2D, maxPlayersPerSide: number): ContentExtent {
    const { frame, halfTable } = frameTable(screen, maxPlayersPerSide);
    const labelScale = calculateScreenFit(screen);
    const margin = ZONE_EDGE_MARGIN * TOP_DOWN_SCALE * frame.zoom;
    const overflowY = Math.max(0, TOP_DOWN_RESERVES.labelDepth * labelScale - margin);
    const overflowX = Math.max(0, SIDE_LABEL_WIDTH * labelScale - margin);
    const toScreenX = (x: number) => screen.width / 2 + (x - frame.center.x) * frame.zoom;
    const toScreenY = (y: number) => screen.height / 2 + (y - frame.center.y) * frame.zoom;

    return {
        top: toScreenY(-halfTable) - overflowY,
        bottom: toScreenY(halfTable) + overflowY,
        left: toScreenX(-halfTable) - overflowX,
        right: toScreenX(halfTable) + overflowX
    };
}

describe('TopDownCameraStrategy', () => {
    const camera = new TopDownCameraStrategy();

    // VIEW-57
    it('draws every point of the board at the same scale', () => {
        const far = camera.project({ x: 100, y: -1000 });
        const near = camera.project({ x: 100, y: 1000 });

        expect([far.scale, near.scale, near.y]).toEqual([TOP_DOWN_SCALE, TOP_DOWN_SCALE, 1000 * TOP_DOWN_SCALE]);
    });

    // VIEW-1, VIEW-57
    it('neither deforms the cards nor shows the depth of the table', () => {
        expect([camera.deformsCards, camera.showsTableDepth]).toEqual([false, false]);
    });

    describe('frame', () => {
        for (const window of [SMALLEST_WINDOW, LARGEST_WINDOW]) {
            for (const maxPlayersPerSide of PLAYERS_PER_SIDE) {
                // VIEW-57, VIEW-24, VIEW-49
                const size = `${window.width} by ${window.height}`;
                it(`fills the height between its reserves at ${size} with ${maxPlayersPerSide} per side`, () => {
                    const screen = toCanvas(window);

                    const extent = contentExtent(screen, maxPlayersPerSide);

                    expect(extent.top).toBeCloseTo(TOP_DOWN_RESERVES.top * RENDER_SCALE, PRECISION);
                    expect(extent.bottom).toBeCloseTo(screen.height - TOP_DOWN_RESERVES.bottom * RENDER_SCALE, PRECISION);
                });
            }
        }

        // VIEW-57
        it('centers the table horizontally', () => {
            const screen = toCanvas(LARGEST_WINDOW);

            const extent = contentExtent(screen, 3);

            expect(extent.left + extent.right).toBeCloseTo(screen.width, PRECISION);
        });

        // VIEW-24, VIEW-57
        it('keeps the table and the labels between the rows of corner pieces of the HUD and above the hand at rest', () => {
            const screen = toCanvas(NARROW_WINDOW);
            const handAtRest = CARD_HEIGHT * HAND_CARD_SCALE * (1 - HAND_RESTING_HIDDEN_RATIO) * RENDER_SCALE;
            const cornerPieces = HUD_CORNER_PIECES_REACH * RENDER_SCALE;

            const extent = contentExtent(screen, 3);

            expect(extent.top).toBeGreaterThanOrEqual(cornerPieces - EPSILON);
            expect(extent.bottom).toBeLessThanOrEqual(screen.height - Math.max(cornerPieces, handAtRest) + EPSILON);
        });

        // VIEW-24
        it('keeps the labels of the side zones inside the screen on a window narrower than 16:9', () => {
            const screen = toCanvas(NARROW_WINDOW);

            const extent = contentExtent(screen, 3);

            expect(extent.left).toBeGreaterThanOrEqual(0);
        });
    });
});
