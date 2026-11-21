import type { Page } from '@playwright/test';
import type { Area, Point } from '@/support/board';
import {
    INITIAL_ZOOM,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    TABLE_AREA,
    TOOLTIP_AREA,
    atZoom,
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
const TOOLTIP = { clip: TOOLTIP_AREA, maxDiffPixels: 0 };
const ZOOM_LEVELS = [
    { zoom: 0.8, wheelSteps: 2 },
    { zoom: 0.5, wheelSteps: 4 }
];

/** Selects the own warrior and puts the pointer over the rival, which lifts both (VIEW-4). */
async function liftAttack(page: Page, zoom: number): Promise<void> {
    const attacker = atZoom(OWN_WARRIOR, zoom);
    const target = atZoom(RIVAL_WARRIOR, zoom);

    await page.mouse.click(attacker.x, attacker.y);
    await page.mouse.move(target.x, target.y);
    await waitForStillFrame(page);
}

test.describe('board appearance', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    // VIEW-57
    test('draws the texts of a card sharper after zooming in from above', async ({ page }) => {
        const zoomedIn = INITIAL_ZOOM + MAX_ZOOM_IN_STEPS * ZOOM_STEP;
        const before = await edgeStrength(page, cardInterior(OWN_WARRIOR, INITIAL_ZOOM));

        await zoomIn(page, MAX_ZOOM_IN_STEPS);

        const after = await edgeStrength(page, cardInterior(atZoom(OWN_WARRIOR, zoomedIn), zoomedIn));
        expect(after).toBeGreaterThanOrEqual(before * (1 - EDGE_STRENGTH_NOISE));
    });

    test('shows the tooltip of a hovered card', async ({ page }) => {
        await page.mouse.move(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('tooltip.png', TOOLTIP);
    });

    // VIEW-19, UI-3: the board at the initial zoom, the hand and the HUD are in `layout-2-players` of `layouts.spec.ts`
    test('keeps the shape of the lifted cards at the initial zoom', async ({ page }) => {
        await liftAttack(page, INITIAL_ZOOM);

        await expect(page).toHaveScreenshot('attack-zoom-initial.png', TABLE);
    });

    for (const { zoom, wheelSteps } of ZOOM_LEVELS) {
        // VIEW-19, UI-3: the table and its cards keep their shape, the HUD its place and size, and so do the lifted cards
        test(`keeps the board, the HUD and the lifted cards at zoom ${zoom}`, async ({ page }) => {
            await zoomOut(page, wheelSteps);

            await expect.soft(page).toHaveScreenshot(`board-zoom-${zoom}.png`, { maxDiffPixels: 0 });
            await liftAttack(page, zoom);
            await expect.soft(page).toHaveScreenshot(`attack-zoom-${zoom}.png`, TABLE);
        });
    }
});
