import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
import type { PreparedGame } from '@/support/preparedGame';
import { EMPTY_TABLE, OWN_WARRIOR, waitForStillFrame } from '@/support/board';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const DRAG_STEPS = 12;
const OWN_ZONE_AREA = { x: 830, y: 590, width: 260, height: 360 };

/** Opens the board with the accessible mode on (UI-31). */
async function openAccessibleGame(page: Page, backend: BackendDouble, prepared: PreparedGame): Promise<void> {
    backend.prepare(prepared);

    await page.goto('/?accessible=1');
    await expect(page.locator('#game-container')).toBeVisible();
    await backend.waitForBoardDrawn();
    await waitForStillFrame(page);
}

// UI-31, VIEW-40
test.describe('accessible mode', () => {
    test('draws the tint of the own zone and the edge of the marks', async ({ page, backend }) => {
        await openAccessibleGame(page, backend, createPreparedGame(2));

        await expect(page).toHaveScreenshot('accessible-own-zone.png', { clip: OWN_ZONE_AREA, maxDiffPixels: 0 });
    });

    test('draws the border of an eliminated zone', async ({ page, backend }) => {
        const prepared = createPreparedGame(3);
        prepared.game.zones[1].owner.isAlive = false;
        prepared.game.zones[1].owner.isSpectator = true;
        await openAccessibleGame(page, backend, prepared);

        await expect(page).toHaveScreenshot('accessible-eliminated.png', { maxDiffPixels: 0 });
    });

    // VIEW-32
    test('keeps the mark of the source slot while the card is dragged out of it', async ({ page, backend }) => {
        await openAccessibleGame(page, backend, createPreparedGame(2));

        await page.mouse.move(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await waitForStillFrame(page);
        await page.mouse.down();
        await page.mouse.move(EMPTY_TABLE.x, EMPTY_TABLE.y, { steps: DRAG_STEPS });
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('accessible-drag-away.png', { maxDiffPixels: 0 });
        await page.mouse.up();
    });
});
