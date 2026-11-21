import type { Point } from '@/support/board';
import { LEFT_TOOLTIP_AREA, TOOLTIP_AREA, countFramePixels, frameOf, hasFrameSince, hover, openBoard } from '@/support/board';
import { expect, test } from '@/support/test';
import { BOARD_CAMERA_STORAGE_KEY } from '@/core/SettingsSystem';

/** Where the cards of the prepared game of ten players are drawn at its initial zoom, with the top-down camera. */
const TEN_OWN_WARRIOR: Point = { x: 921, y: 861 };
const TEN_TOP_RIVAL_WARRIOR: Point = { x: 998, y: 218 };
const TEN_SIDE_RIVAL_WARRIOR: Point = { x: 638, y: 343 };
const TEN_EMPTY_TABLE: Point = { x: 1100, y: 650 };

const PLAYER_COUNTS = [2, 3, 4, 6, 10].map((playerCount) => ({ playerCount }));
const TILTED_PLAYER_COUNTS = [2, 6, 10];

// VIEW-2, VIEW-13
test.describe('layouts of the table', () => {
    for (const { playerCount } of PLAYER_COUNTS) {
        test(`shows the table of ${playerCount} players`, async ({ page, backend }) => {
            await openBoard(page, backend, playerCount);

            await expect(page).toHaveScreenshot(`layout-${playerCount}-players.png`, { maxDiffPixels: 0 });
        });
    }
});

// VIEW-57: the tilted camera is an option of the settings, so one image of it is kept for each size of the table
test.describe('layouts of the table with the tilted camera', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript((key) => window.localStorage.setItem(key, 'TILTED'), BOARD_CAMERA_STORAGE_KEY);
    });

    for (const playerCount of TILTED_PLAYER_COUNTS) {
        test(`shows the tilted table of ${playerCount} players`, async ({ page, backend }) => {
            await openBoard(page, backend, playerCount);

            await expect(page).toHaveScreenshot(`layout-tilted-${playerCount}-players.png`, { maxDiffPixels: 0 });
        });
    }
});

// VIEW-2
test.describe('game of ten players', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend, 10);
    });

    // VIEW-14: the card is in the right half of the screen, so its panel opens on the left side
    test('shows the side panel of a card of the top side', async ({ page }) => {
        const noPanel = await frameOf(page, LEFT_TOOLTIP_AREA);

        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        expect((await frameOf(page, LEFT_TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    test('shows the side panel of a card of a rotated zone', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);

        await hover(page, TEN_SIDE_RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    test('frames in green a rival of the top side', async ({ page }) => {
        const before = await countFramePixels(page, TEN_TOP_RIVAL_WARRIOR, 'green');
        await page.mouse.click(TEN_OWN_WARRIOR.x, TEN_OWN_WARRIOR.y);

        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        expect(await hasFrameSince(page, TEN_TOP_RIVAL_WARRIOR, 'green', before)).toBe(true);
    });

    test('frames in green a rival of a rotated zone', async ({ page }) => {
        const before = await countFramePixels(page, TEN_SIDE_RIVAL_WARRIOR, 'green');
        await page.mouse.click(TEN_OWN_WARRIOR.x, TEN_OWN_WARRIOR.y);

        await hover(page, TEN_SIDE_RIVAL_WARRIOR);

        expect(await hasFrameSince(page, TEN_SIDE_RIVAL_WARRIOR, 'green', before)).toBe(true);
    });

    test('closes the side panel when leaving the card', async ({ page }) => {
        const noPanel = await frameOf(page, LEFT_TOOLTIP_AREA);
        await hover(page, TEN_TOP_RIVAL_WARRIOR);

        await hover(page, TEN_EMPTY_TABLE);

        expect((await frameOf(page, LEFT_TOOLTIP_AREA)).equals(noPanel)).toBe(true);
    });
});
