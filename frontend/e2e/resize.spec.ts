import { hover, openBoard, waitForStillFrame } from '@/support/board';
import { expect, test } from '@/support/test';

const INITIAL_SIZE = { width: 1920, height: 1080 };
const MINIMUM_WINDOW = { width: 1280, height: 720 };
const MOST_PLAYERS = 10;
const HAND_POINT = { x: 640, y: 700 };
const WIDE_WINDOW = { width: 1600, height: 700 };

// VIEW-24
test.describe('window resize', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    test('keeps the board, the hand and the buttons in view in the smallest window', async ({ page }) => {
        await page.setViewportSize(MINIMUM_WINDOW);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('window-minimum.png', { maxDiffPixels: 0 });
    });

    test('keeps the board centered in a wide and short window', async ({ page }) => {
        await page.setViewportSize(WIDE_WINDOW);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('window-wide.png', { maxDiffPixels: 0 });
    });

    test('draws the same frame again when the window returns to its size', async ({ page }) => {
        const initial = await page.screenshot();
        await page.setViewportSize(MINIMUM_WINDOW);
        await waitForStillFrame(page);

        await page.setViewportSize(INITIAL_SIZE);
        await waitForStillFrame(page);

        expect((await page.screenshot()).equals(initial)).toBe(true);
    });
});

// VIEW-24
test('keeps the HUD out of the table with the most players in the smallest window', async ({ page, backend }) => {
    await page.setViewportSize(MINIMUM_WINDOW);
    await openBoard(page, backend, MOST_PLAYERS);

    await expect(page).toHaveScreenshot('window-minimum-10-players.png', { maxDiffPixels: 0 });
});

// VIEW-16
test('shows the expanded hand over the own zone in the smallest window with the most players', async ({ page, backend }) => {
    await page.setViewportSize(MINIMUM_WINDOW);
    await openBoard(page, backend, MOST_PLAYERS);

    await hover(page, HAND_POINT);

    await expect(page).toHaveScreenshot('window-minimum-hand.png', { maxDiffPixels: 0 });
});
