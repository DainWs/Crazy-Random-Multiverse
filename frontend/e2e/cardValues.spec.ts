import { frameOf, openBoard, waitForStillFrame } from '@/support/board';
import type { Area } from '@/support/board';
import { expect, test } from '@/support/test';

const CARD_VALUES_STORAGE_KEY = 'crm.settings.cardValues';
const ALL_CARD_VALUES = ['DAMAGE', 'ARMOR', 'HEALTH'];
const PLAYER_COUNTS = [2, 6, 10].map((playerCount) => ({ playerCount }));
const WHOLE_SCREEN: Area = { x: 0, y: 0, width: 1920, height: 1080 };

// VIEW-46, VIEW-47, VIEW-48
test.describe('card values on the board', () => {
    for (const { playerCount } of PLAYER_COUNTS) {
        test(`shows the three values outside the cards of ${playerCount} players`, async ({ page, backend }) => {
            await page.addInitScript(
                ([key, values]) => window.localStorage.setItem(key, JSON.stringify(values)),
                [CARD_VALUES_STORAGE_KEY, ALL_CARD_VALUES] as const
            );

            await openBoard(page, backend, playerCount);

            await expect(page).toHaveScreenshot(`card-values-${playerCount}-players.png`, { maxDiffPixels: 0 });
        });
    }

    test('draws no label with the three values off', async ({ page, backend }) => {
        await openBoard(page, backend, 2);
        const withNoLabels = await frameOf(page, WHOLE_SCREEN);

        await page.getByRole('button', { name: 'Ajustes' }).click();
        await page.getByRole('checkbox', { name: 'Vida' }).check();
        await page.getByRole('checkbox', { name: 'Vida' }).uncheck();
        await page.keyboard.press('Escape');
        await waitForStillFrame(page);

        expect((await frameOf(page, WHOLE_SCREEN)).equals(withNoLabels)).toBe(true);
    });

    test('draws the labels as soon as a value is turned on in the settings', async ({ page, backend }) => {
        await openBoard(page, backend, 2);
        const withNoLabels = await frameOf(page, WHOLE_SCREEN);

        await page.getByRole('button', { name: 'Ajustes' }).click();
        await page.getByRole('checkbox', { name: 'Vida' }).check();
        await page.keyboard.press('Escape');
        await waitForStillFrame(page);

        expect((await frameOf(page, WHOLE_SCREEN)).equals(withNoLabels)).toBe(false);
    });
});
