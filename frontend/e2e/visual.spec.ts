import type { Area, Point } from '@/support/board';
import {
    INITIAL_ZOOM,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    SIDE_ZONE_AREA,
    TABLE_AREA,
    TOOLTIP_AREA,
    atZoom,
    cardArea,
    edgeStrength,
    openBoard,
    waitForStillFrame,
    zoomIn,
    zoomOut
} from '@/support/board';
import { expect, test } from '@/support/test';

/** The wheel steps from the initial zoom to the maximum one, 1.5, each of 0.15 (VIEW-19). */
const MAX_ZOOM_IN_STEPS = 2;
const ZOOM_STEP = 0.15;

interface Size {
    width: number;
    height: number;
}

/**
 * The strokes of the texts stay as crisp when the card grows: measured on 2026-11-21, 399.4 before the zoom and 398.8 after it,
 * out of 765. A text enlarged from a smaller texture would lose far more, so a drop under this share is a blur.
 */
const EDGE_STRENGTH_NOISE = 0.05;
/** The inside of the own warrior at the initial zoom, without its border against the table: its strongest steps of light are its texts. */
const CARD_INTERIOR: Size = { width: 48, height: 84 };

function cardInterior(center: Point, zoom: number): Area {
    const width = (CARD_INTERIOR.width * zoom) / INITIAL_ZOOM;
    const height = (CARD_INTERIOR.height * zoom) / INITIAL_ZOOM;

    return { x: center.x - width / 2, y: center.y - height / 2, width, height };
}

/** The limits are the noise measured over five runs, which was zero in every area. */
const TABLE = { clip: TABLE_AREA, maxDiffPixels: 0 };
const HAND = { clip: { x: 700, y: 1005, width: 520, height: 75 }, maxDiffPixels: 0 };
const TOOLTIP = { clip: TOOLTIP_AREA, maxDiffPixels: 0 };
const CARD_MAX_DIFF_PIXELS = 0;

const SHARPNESS_THRESHOLD = 0.05;

const ZOOM_LEVELS = [
    { zoom: INITIAL_ZOOM, wheelSteps: 0 },
    { zoom: 0.8, wheelSteps: 2 },
    { zoom: 0.5, wheelSteps: 4 }
];

test.describe('board appearance', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    test('shows the hand', async ({ page }) => {
        await expect(page).toHaveScreenshot('hand.png', HAND);
    });

    // VIEW-57
    test('draws the texts of a card sharper after zooming in from above', async ({ page }) => {
        const zoomedIn = INITIAL_ZOOM + MAX_ZOOM_IN_STEPS * ZOOM_STEP;
        const before = await edgeStrength(page, cardInterior(OWN_WARRIOR, INITIAL_ZOOM));

        await zoomIn(page, MAX_ZOOM_IN_STEPS);

        const after = await edgeStrength(page, cardInterior(atZoom(OWN_WARRIOR, zoomedIn), zoomedIn));
        expect(after).toBeGreaterThanOrEqual(before * (1 - EDGE_STRENGTH_NOISE));
    });

    // VIEW-1
    test('shows the cards of a rotated zone aligned with their slots', async ({ page, backend }) => {
        await openBoard(page, backend, 3);

        await expect(page).toHaveScreenshot('side-zone.png', { clip: SIDE_ZONE_AREA, maxDiffPixels: 0 });
    });

    test('shows the tooltip of a hovered card', async ({ page }) => {
        await page.mouse.move(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('tooltip.png', TOOLTIP);
    });

    for (const { zoom, wheelSteps } of ZOOM_LEVELS) {
        test(`keeps the table shape at zoom ${zoom}`, async ({ page }) => {
            await zoomOut(page, wheelSteps);

            await expect(page).toHaveScreenshot(`table-zoom-${zoom}.png`, TABLE);
        });

        test(`keeps the shape of the lifted cards at zoom ${zoom}`, async ({ page }) => {
            const attacker = atZoom(OWN_WARRIOR, zoom);
            const target = atZoom(RIVAL_WARRIOR, zoom);
            await zoomOut(page, wheelSteps);

            await page.mouse.click(attacker.x, attacker.y);
            await page.mouse.move(target.x, target.y);
            await waitForStillFrame(page);

            await expect(page).toHaveScreenshot(`attack-zoom-${zoom}.png`, TABLE);
        });

        test(`keeps the card sharp at zoom ${zoom}`, async ({ page }) => {
            const clip = cardArea(atZoom(OWN_WARRIOR, zoom));
            await zoomOut(page, wheelSteps);

            await expect(page).toHaveScreenshot(`card-zoom-${zoom}.png`, {
                clip,
                threshold: SHARPNESS_THRESHOLD,
                maxDiffPixels: CARD_MAX_DIFF_PIXELS
            });
        });
    }
});
