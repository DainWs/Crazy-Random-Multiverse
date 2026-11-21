import type { PanButton, Point } from '@/support/board';
import {
    EMPTY_TABLE,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    TABLE_AREA,
    WHEEL_UP_DELTA,
    darkShare,
    frameOf,
    hover,
    openBoard,
    pan,
    sameFrame,
    waitForStillFrame,
    zoomIn,
    zoomOut
} from '@/support/board';
import { expect, test } from '@/support/test';

const PAN_BUTTONS: PanButton[] = ['right', 'middle'];
const SHORT_PAN: Point = { x: 120, y: 0 };

/**
 * Pans from one edge of the viewport towards the other, each one further than the pan can take the board. At the maximum zoom
 * the table of two players is about 1240 px on each side, and the pan keeps the center of the screen inside it, so the board
 * moves at most that far from one end to the other: one pan of 1800 px goes past it, and two of 960 px.
 */
const PAN_SEQUENCES: { from: Point; delta: Point; repeats: number }[] = [
    { from: { x: 1860, y: 540 }, delta: { x: -1800, y: 0 }, repeats: 1 },
    { from: { x: 60, y: 540 }, delta: { x: 1800, y: 0 }, repeats: 1 },
    { from: { x: 960, y: 1000 }, delta: { x: 0, y: -960 }, repeats: 1 },
    { from: { x: 960, y: 40 }, delta: { x: 0, y: 960 }, repeats: 2 }
];
const MAX_ZOOM_STEPS = 2;
const MIN_TABLE_SHARE = 0.05;
/** Change of the dark share of the screen that is not a change of the zoom: a dragged card and its marks are a few small spots. */
const TABLE_SHARE_NOISE = 0.01;
const DRAG_STEPS = 12;
const LONG_PAN_TEST_TIMEOUT_MS = 120000;

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

            expect(await sameFrame(page, await frameOf(page, TABLE_AREA), before)).toBe(false);
        });

        // VIEW-19, VIEW-4
        test(`does not select a card with a click of the ${button} button`, async ({ page }) => {
            const noSelection = await page.screenshot();

            await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y, { button });
            await hover(page, EMPTY_TABLE);

            expect(await sameFrame(page, await page.screenshot(), noSelection)).toBe(true);
        });

        // VIEW-19
        test(`does not drag a card when panning over it with the ${button} button`, async ({ page, backend }) => {
            await pan(page, button, OWN_WARRIOR, SHORT_PAN);

            expect(backend.actions).toEqual([]);
        });

        // VIEW-19, VIEW-4
        // The camera comes back to where it was, so the rival is clicked at the same point: an attack sent means the attacker stayed selected
        test(`keeps the selection of an attacker while panning with the ${button} button`, async ({ page, backend }) => {
            await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
            await hover(page, EMPTY_TABLE);

            await page.mouse.down({ button });
            await page.mouse.move(EMPTY_TABLE.x + SHORT_PAN.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
            await page.mouse.move(EMPTY_TABLE.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
            await page.mouse.up({ button });
            await waitForStillFrame(page);
            await page.mouse.click(RIVAL_WARRIOR.x, RIVAL_WARRIOR.y);

            await expect.poll(() => backend.actions.map((action) => action.type)).toEqual(['ATTACK_ACTION']);
        });
    }

    // VIEW-19
    test('zooms with the wheel when no card is being dragged', async ({ page }) => {
        const before = await frameOf(page, TABLE_AREA);

        await zoomOut(page, 1);

        expect(await sameFrame(page, await frameOf(page, TABLE_AREA), before)).toBe(false);
    });

    // VIEW-19
    // A step of the wheel would grow the table by about 28% of its area, so its share of the screen tells the zoom apart from noise
    test('does not zoom with the wheel while a card is being dragged', async ({ page }) => {
        const before = await darkShare(page);

        await hover(page, OWN_WARRIOR);
        await page.mouse.down();
        await page.mouse.move(EMPTY_TABLE.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
        await page.mouse.wheel(0, WHEEL_UP_DELTA);
        await waitForStillFrame(page);
        await page.mouse.up();
        await hover(page, EMPTY_TABLE);

        expect(Math.abs((await darkShare(page)) - before)).toBeLessThan(TABLE_SHARE_NOISE);
    });

    // VIEW-19
    test('keeps the board on the screen however far the pan goes, at the maximum zoom', async ({ page }) => {
        test.setTimeout(LONG_PAN_TEST_TIMEOUT_MS);
        await zoomIn(page, MAX_ZOOM_STEPS);

        for (const { from, delta, repeats } of PAN_SEQUENCES) {
            for (let repeat = 0; repeat < repeats; repeat += 1) {
                await pan(page, 'right', from, delta);
            }

            expect(await darkShare(page)).toBeGreaterThan(MIN_TABLE_SHARE);
        }
    });
});
