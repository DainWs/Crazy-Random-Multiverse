import type { Area, PanButton, Point } from '@/support/board';
import {
    EMPTY_TABLE,
    OWN_WARRIOR,
    TABLE_AREA,
    VIEW_CENTER,
    WHEEL_UP_DELTA,
    darkShare,
    frameOf,
    hover,
    isArrowRedBetween,
    openBoard,
    pan,
    waitForStillFrame,
    zoomIn,
    zoomOut
} from '@/support/board';
import { expect, test } from '@/support/test';

const PAN_BUTTONS: PanButton[] = ['right', 'middle'];
const SHORT_PAN: Point = { x: 120, y: 0 };

/** Pans that stay inside the viewport and, repeated, go further than the table can be from the center of the screen at the maximum zoom. */
const PAN_SEQUENCES: { delta: Point; repeats: number }[] = [
    { delta: { x: -750, y: 0 }, repeats: 4 },
    { delta: { x: 750, y: 0 }, repeats: 8 },
    { delta: { x: 0, y: -500 }, repeats: 3 },
    { delta: { x: 0, y: 500 }, repeats: 6 }
];
const MAX_ZOOM_STEPS = 2;
const MIN_TABLE_SHARE = 0.05;
const DRAG_STEPS = 12;
const HUD_ZOOM_LEVELS = [
    { zoom: 0.8, wheelSteps: 2 },
    { zoom: 0.5, wheelSteps: 4 }
];
const LONG_PAN_TEST_TIMEOUT_MS = 180000;

const TURN_TEXT_AREA: Area = { x: 0, y: 0, width: 560, height: 80 };
const BUTTONS_AREA: Area = { x: 1600, y: 930, width: 320, height: 150 };

test.describe('panning the camera', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
        await hover(page, EMPTY_TABLE);
    });

    for (const button of PAN_BUTTONS) {
        // VIEW-19
        test(`moves the board when dragging with the ${button} button`, async ({ page }) => {
            const before = await frameOf(page, TABLE_AREA);

            await pan(page, button, EMPTY_TABLE, SHORT_PAN);

            expect((await frameOf(page, TABLE_AREA)).equals(before)).toBe(false);
        });

        // VIEW-19, VIEW-4
        test(`does not select a card with a click of the ${button} button`, async ({ page }) => {
            const noSelection = await page.screenshot();

            await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y, { button });
            await hover(page, EMPTY_TABLE);

            expect((await page.screenshot()).equals(noSelection)).toBe(true);
        });

        // VIEW-19
        test(`does not drag a card when panning over it with the ${button} button`, async ({ page, backend }) => {
            await pan(page, button, OWN_WARRIOR, SHORT_PAN);

            expect(backend.actions).toEqual([]);
        });

        // VIEW-19, VIEW-4
        test(`keeps the selection of an attacker while panning with the ${button} button`, async ({ page }) => {
            await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
            await hover(page, EMPTY_TABLE);

            await page.mouse.down({ button });
            await page.mouse.move(EMPTY_TABLE.x + SHORT_PAN.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
            await page.mouse.move(EMPTY_TABLE.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
            await page.mouse.up({ button });
            await waitForStillFrame(page);

            expect(await isArrowRedBetween(page, OWN_WARRIOR, EMPTY_TABLE)).toBe(true);
        });
    }

    // VIEW-19
    test('zooms with the wheel when no card is being dragged', async ({ page }) => {
        const before = await frameOf(page, TABLE_AREA);

        await zoomOut(page, 1);

        expect((await frameOf(page, TABLE_AREA)).equals(before)).toBe(false);
    });

    // VIEW-19
    test('does not zoom with the wheel while a card is being dragged', async ({ page }) => {
        const before = await frameOf(page, TABLE_AREA);

        await hover(page, OWN_WARRIOR);
        await page.mouse.down();
        await page.mouse.move(EMPTY_TABLE.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
        await page.mouse.wheel(0, WHEEL_UP_DELTA);
        await waitForStillFrame(page);
        await page.mouse.up();
        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, TABLE_AREA)).equals(before)).toBe(true);
    });

    // VIEW-19
    test('keeps the board on the screen however far the pan goes, at the maximum zoom', async ({ page }) => {
        test.setTimeout(LONG_PAN_TEST_TIMEOUT_MS);
        await zoomIn(page, MAX_ZOOM_STEPS);

        for (const { delta, repeats } of PAN_SEQUENCES) {
            for (let repeat = 0; repeat < repeats; repeat += 1) {
                await pan(page, 'right', VIEW_CENTER, delta);
            }

            expect(await darkShare(page)).toBeGreaterThan(MIN_TABLE_SHARE);
        }
    });
});

test.describe('the HUD while zooming', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    // UI-3
    for (const { zoom, wheelSteps } of HUD_ZOOM_LEVELS) {
        test(`keeps the turn text at its place and size at zoom ${zoom}`, async ({ page }) => {
            await zoomOut(page, wheelSteps);

            await expect(page).toHaveScreenshot(`hud-turn-text-zoom-${zoom}.png`, { clip: TURN_TEXT_AREA, maxDiffPixels: 0 });
        });

        test(`keeps the buttons at their place and size at zoom ${zoom}`, async ({ page }) => {
            await zoomOut(page, wheelSteps);

            await expect(page).toHaveScreenshot(`hud-buttons-zoom-${zoom}.png`, { clip: BUTTONS_AREA, maxDiffPixels: 0 });
        });
    }
});
