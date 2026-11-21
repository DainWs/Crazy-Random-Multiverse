import { openGame } from '@/support/board';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const ACTION_WAIT_MS = 1000;

// UI-33
test.describe('settings in the main menu', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Ajustes' }).click();
    });

    test('has no options', async ({ page }) => {
        await expect(page.getByRole('dialog').getByRole('checkbox')).toHaveCount(0);
    });

    test('closes with its own button', async ({ page }) => {
        await page.getByRole('button', { name: 'Cerrar' }).click();

        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('closes with the button that opened it', async ({ page }) => {
        await page.getByRole('button', { name: 'Ajustes' }).click();

        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('closes with Escape', async ({ page }) => {
        await page.keyboard.press('Escape');

        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('closes with a click outside it', async ({ page }) => {
        await page.mouse.click(20, 500);

        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('stays open with a click inside it', async ({ page }) => {
        await page.getByRole('heading', { name: 'Ajustes' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();
    });
});

// UI-33, UI-32
test.describe('settings in the game', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, createPreparedGame(2));
        await page.getByRole('button', { name: 'Ajustes' }).click();
    });

    test('does not end the turn with Space while it is open', async ({ page, backend }) => {
        await page.getByRole('heading', { name: 'Ajustes' }).click();

        await page.keyboard.press('Space');
        await page.waitForTimeout(ACTION_WAIT_MS);

        expect(backend.actions).toEqual([]);
    });

    test('ends the turn with Space again once it is closed', async ({ page, backend }) => {
        await page.keyboard.press('Escape');

        await page.keyboard.press('Space');

        await expect.poll(() => backend.actions.map((action) => action.type)).toEqual(['PASS_TURN']);
    });
});
