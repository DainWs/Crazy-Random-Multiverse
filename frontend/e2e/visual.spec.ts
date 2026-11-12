import type { Area, Point } from '@/support/board';
import { INITIAL_ZOOM, OWN_WARRIOR, RIVAL_WARRIOR, TABLE_AREA, TOOLTIP_AREA, atZoom, openBoard, waitForStillFrame, zoomOut } from '@/support/board';
import { expect, test } from '@/support/test';

/** The limits are the noise measured over five runs, which was zero in every area. */
const TABLE = { clip: TABLE_AREA, maxDiffPixels: 0 };
const HAND = { clip: { x: 700, y: 1005, width: 520, height: 75 }, maxDiffPixels: 0 };
const TOOLTIP = { clip: TOOLTIP_AREA, maxDiffPixels: 0 };
const CARD_MAX_DIFF_PIXELS = 0;

const CARD_AREA_MARGIN = 70;
const SHARPNESS_THRESHOLD = 0.05;

const ZOOM_LEVELS = [
    { zoom: INITIAL_ZOOM, wheelSteps: 0 },
    { zoom: 0.8, wheelSteps: 2 },
    { zoom: 0.5, wheelSteps: 4 }
];

function cardArea(center: Point): Area {
    return {
        x: center.x - CARD_AREA_MARGIN,
        y: center.y - CARD_AREA_MARGIN,
        width: CARD_AREA_MARGIN * 2,
        height: CARD_AREA_MARGIN * 2
    };
}

test.describe('board appearance', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    test('shows the hand', async ({ page }) => {
        await expect(page).toHaveScreenshot('hand.png', HAND);
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

        test(`keeps the attack arrow shape at zoom ${zoom}`, async ({ page }) => {
            const attacker = atZoom(OWN_WARRIOR, zoom);
            const target = atZoom(RIVAL_WARRIOR, zoom);
            await zoomOut(page, wheelSteps);

            await page.mouse.click(attacker.x, attacker.y);
            await page.mouse.move(target.x, target.y);
            await waitForStillFrame(page);

            await expect(page).toHaveScreenshot(`arrow-zoom-${zoom}.png`, TABLE);
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
