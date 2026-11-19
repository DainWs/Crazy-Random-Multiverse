import { openGame } from '@/support/board';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const SURRENDER_BUTTON = { x: 1825, y: 987 };
const ACTION_WAIT_MS = 1000;

// UI-32
test.describe('keyboard', () => {
    const prepared = createPreparedGame(2);

    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, prepared);
    });

    test('ends the turn with Space', async ({ page, backend }) => {
        await page.keyboard.press('Space');

        await expect.poll(() => backend.actions.map((action) => action.type)).toEqual(['PASS_TURN']);
    });

    test('does not surrender with Enter in the dialog, as its focus starts on No', async ({ page, backend }) => {
        await page.mouse.click(SURRENDER_BUTTON.x, SURRENDER_BUTTON.y);

        await page.keyboard.press('Enter');
        await page.waitForTimeout(ACTION_WAIT_MS);

        expect(backend.actions).toEqual([]);
    });

    test('surrenders with Tab and Enter in the dialog', async ({ page, backend }) => {
        await page.mouse.click(SURRENDER_BUTTON.x, SURRENDER_BUTTON.y);

        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        await expect.poll(() => backend.actions.map((action) => action.type)).toEqual(['SURRENDER_ACTION']);
    });

    test('does not surrender with Escape in the dialog', async ({ page, backend }) => {
        await page.mouse.click(SURRENDER_BUTTON.x, SURRENDER_BUTTON.y);

        await page.keyboard.press('Tab');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(ACTION_WAIT_MS);

        expect(backend.actions).toEqual([]);
    });

    test('does not end the turn with Space while the dialog is open', async ({ page, backend }) => {
        await page.mouse.click(SURRENDER_BUTTON.x, SURRENDER_BUTTON.y);

        await page.keyboard.press('Space');
        await page.waitForTimeout(ACTION_WAIT_MS);

        expect(backend.actions).toEqual([]);
    });
});
