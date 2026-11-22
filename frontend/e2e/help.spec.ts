import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
import { openGame, waitForStillFrame } from '@/support/board';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const ACTION_WAIT_MS = 1000;
const LEGEND_ROWS = 8;

/** Opens the board with the extra signals of the marks on (UI-31). */
async function openGameWithExtraMarks(page: Page, backend: BackendDouble): Promise<void> {
    backend.prepare(createPreparedGame(2));

    await page.goto('/?extraMarks=1');
    await expect(page.locator('#game-container')).toBeVisible();
    await backend.waitForBoardDrawn();
    await waitForStillFrame(page);
}

// UI-34
test.describe('help in the main menu', () => {
    test('has no help button', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('button', { name: 'Ayuda' })).toBeHidden();
    });
});

// UI-34, VIEW-58
test.describe('help in the game', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, createPreparedGame(2));
        await page.getByRole('button', { name: 'Ayuda' }).click();
    });

    test('opens the panel with the legend of the marks', async ({ page }) => {
        await expect(page.getByRole('dialog').getByRole('listitem')).toHaveCount(LEGEND_ROWS);
    });

    test('closes with the button that opened it', async ({ page }) => {
        await page.getByRole('button', { name: 'Ayuda' }).click();

        await expect(page.getByRole('dialog')).toBeHidden();
    });

    test('closes with its own button', async ({ page }) => {
        await page.getByRole('button', { name: 'Cerrar' }).click();

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
        await page.getByRole('heading', { name: 'Ayuda' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('puts the focus on the close button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Cerrar' })).toBeFocused();
    });

    test('closes when the settings open', async ({ page }) => {
        await page.getByRole('button', { name: 'Ajustes' }).click();

        await expect(page.getByRole('heading', { name: 'Ayuda' })).toBeHidden();
    });

    // UI-4, UI-32
    test('does not end the turn with Space while it is open', async ({ page, backend }) => {
        await page.getByRole('heading', { name: 'Ayuda' }).click();

        await page.keyboard.press('Space');
        await page.waitForTimeout(ACTION_WAIT_MS);

        expect(backend.actions).toEqual([]);
    });

    test('shows no signal of the marks in the base game', async ({ page }) => {
        await expect(page.getByRole('dialog').getByText('Señal:')).toHaveCount(0);
    });

    test('draws the legend in the base game', async ({ page }) => {
        await expect(page.getByRole('dialog')).toHaveScreenshot('help-legend.png', { maxDiffPixels: 0 });
    });
});

// UI-34, VIEW-58, UI-31
test.describe('help with the extra signals', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openGameWithExtraMarks(page, backend);
        await page.getByRole('button', { name: 'Ayuda' }).click();
    });

    test('shows the signal of each mark', async ({ page }) => {
        await expect(page.getByRole('dialog').getByText('Señal:')).toHaveCount(LEGEND_ROWS);
    });

    test('draws the legend with the second signals', async ({ page }) => {
        await expect(page.getByRole('dialog')).toHaveScreenshot('help-legend-extra-marks.png', { maxDiffPixels: 0 });
    });
});
