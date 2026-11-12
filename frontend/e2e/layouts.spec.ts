import type { Point } from '@/support/board';
import { TOOLTIP_AREA, frameOf, hover, isArrowGreenBetween, openBoard } from '@/support/board';
import { expect, test } from '@/support/test';

/** Where the cards of the prepared game of ten players are drawn at its initial zoom. */
const TEN_OWN_WARRIOR: Point = { x: 910, y: 782 };
const TEN_TOP_RIVAL_WARRIOR: Point = { x: 988, y: 125 };
const TEN_SIDE_RIVAL_WARRIOR: Point = { x: 665, y: 325 };
const TEN_EMPTY_TABLE: Point = { x: 1250, y: 650 };

const PLAYER_COUNTS = [2, 3, 4, 6, 10].map((playerCount) => ({ playerCount }));

// VIEW-2, VIEW-13
test.describe('layouts of the table', () => {
    for (const { playerCount } of PLAYER_COUNTS) {
        test(`shows the table of ${playerCount} players`, async ({ page, backend }) => {
            await openBoard(page, backend, playerCount);

            await expect(page).toHaveScreenshot(`layout-${playerCount}-players.png`, { maxDiffPixels: 0 });
        });
    }
});

// VIEW-2
test.describe('game of ten players', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend, 10);
    });

    test('shows the side panel of a card of the top side', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);

        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    test('shows the side panel of a card of a rotated zone', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);

        await hover(page, TEN_SIDE_RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    test('draws a green arrow over a rival of the top side', async ({ page }) => {
        await page.mouse.click(TEN_OWN_WARRIOR.x, TEN_OWN_WARRIOR.y);

        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        expect(await isArrowGreenBetween(page, TEN_OWN_WARRIOR, TEN_TOP_RIVAL_WARRIOR)).toBe(true);
    });

    test('draws a green arrow over a rival of a rotated zone', async ({ page }) => {
        await page.mouse.click(TEN_OWN_WARRIOR.x, TEN_OWN_WARRIOR.y);

        await hover(page, TEN_SIDE_RIVAL_WARRIOR);

        expect(await isArrowGreenBetween(page, TEN_OWN_WARRIOR, TEN_SIDE_RIVAL_WARRIOR)).toBe(true);
    });

    test('closes the side panel when leaving the card', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);
        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        await hover(page, TEN_EMPTY_TABLE);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(true);
    });
});
