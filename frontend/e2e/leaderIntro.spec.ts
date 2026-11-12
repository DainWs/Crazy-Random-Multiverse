import type { Page } from '@playwright/test';
import type { PreparedGame } from '@/support/preparedGame';
import { TABLE_AREA, waitForStillFrame } from '@/support/board';
import { createLoadingGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const INTRO_SAMPLE_MS = 1500;
const INTRO_WAIT_MS = 3000;
const MIN_FRAMES_WITH_INTRO = 4;

async function confirmReady(page: Page, readyCalls: () => number): Promise<void> {
    await page.goto('/');
    await expect.poll(readyCalls).toBe(1);
}

/** The frames the screen shows until the time is up: the loading, the board with no leader and each leader placed. */
async function collectDistinctFrames(page: Page): Promise<number> {
    const frames: Buffer[] = [];
    const deadline = Date.now() + INTRO_SAMPLE_MS;

    while (Date.now() < deadline) {
        const frame = await page.screenshot({ clip: TABLE_AREA });
        if (!frames.some((known) => known.equals(frame))) {
            frames.push(frame);
        }
    }

    return frames.length;
}

// VIEW-12
test.describe('placement of the leaders', () => {
    let prepared: PreparedGame;

    test.beforeEach(({ backend }) => {
        prepared = createLoadingGame(2);
        backend.prepareLoading(prepared);
    });

    test('animates the leaders when the board is first shown after confirming', async ({ page, backend }) => {
        await confirmReady(page, () => backend.readyCalls);

        backend.emitGameEvent('GAME_START', { game: prepared.game });

        expect(await collectDistinctFrames(page)).toBeGreaterThanOrEqual(MIN_FRAMES_WITH_INTRO);
    });

    test('shows both leaders in their slots when it ends', async ({ page, backend }) => {
        await confirmReady(page, () => backend.readyCalls);

        backend.emitGameEvent('GAME_START', { game: prepared.game });
        await page.waitForTimeout(INTRO_WAIT_MS);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('leaders-placed.png', { clip: TABLE_AREA, maxDiffPixels: 0 });
    });
});
