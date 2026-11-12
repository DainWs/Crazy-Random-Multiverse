import { openBoard, waitForStillFrame } from '@/support/board';
import { expect, test } from '@/support/test';

const INITIAL_SIZE = { width: 1920, height: 1080 };
const SMALL_WINDOW = { width: 1100, height: 620 };
const WIDE_WINDOW = { width: 1600, height: 700 };

// VIEW-24
test.describe('window resize', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    test('keeps the board, the hand and the buttons in view in a small window', async ({ page }) => {
        await page.setViewportSize(SMALL_WINDOW);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('window-small.png', { maxDiffPixels: 0 });
    });

    test('keeps the board centered in a wide and short window', async ({ page }) => {
        await page.setViewportSize(WIDE_WINDOW);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('window-wide.png', { maxDiffPixels: 0 });
    });

    test('draws the same frame again when the window returns to its size', async ({ page }) => {
        const initial = await page.screenshot();
        await page.setViewportSize(SMALL_WINDOW);
        await waitForStillFrame(page);

        await page.setViewportSize(INITIAL_SIZE);
        await waitForStillFrame(page);

        expect((await page.screenshot()).equals(initial)).toBe(true);
    });
});
