import type { Page } from '@playwright/test';
import type { PreparedGame } from '@/support/preparedGame';
import type BackendDouble from '@/support/BackendDouble';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

/** A point of the padding of the end turn button, which is drawn with its background and no text. */
const BUTTON_PADDING_POINT = { x: 1675, y: 1040 };
const NOTICES_WAIT_MS = 2500;
const SAMPLE_COUNT = 16;
const SAMPLE_INTERVAL_MS = 200;
const MIN_PULSE_RANGE = 12;

// The browser tests ask for reduced motion, which stops the pulses (UI-30)
test.use({ reducedMotion: 'no-preference' });

/** The board never has a still frame here, because the pulses keep it moving, so the notices are waited out instead. */
async function openPulsingGame(page: Page, backend: BackendDouble, prepared: PreparedGame): Promise<void> {
    backend.prepare(prepared);

    await page.goto('/');
    await backend.waitForBoardDrawn();
    await page.waitForTimeout(NOTICES_WAIT_MS);
}

async function readPixel(page: Page): Promise<number> {
    const frame = await page.screenshot({ clip: { ...BUTTON_PADDING_POINT, width: 1, height: 1 } });

    return page.evaluate(async (base64) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();

        const context = new OffscreenCanvas(1, 1).getContext('2d')!;
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, 1, 1).data[0];
    }, frame.toString('base64'));
}

/** How much the red channel of the button changes over a bit more than one period of 1600 ms. */
async function redRange(page: Page): Promise<number> {
    const samples: number[] = [];
    for (let sample = 0; sample < SAMPLE_COUNT; sample += 1) {
        samples.push(await readPixel(page));
        await page.waitForTimeout(SAMPLE_INTERVAL_MS);
    }

    return Math.max(...samples) - Math.min(...samples);
}

// VIEW-38
test.describe('pulse of the end turn button', () => {
    test('pulses when no card can attack and the hand is empty', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        prepared.game.zones[0].combatants[1][0].combatant!.attackAvailable = false;
        prepared.hand = [];
        await openPulsingGame(page, backend, prepared);

        expect(await redRange(page)).toBeGreaterThanOrEqual(MIN_PULSE_RANGE);
    });

    test('does not pulse while a card can attack', async ({ page, backend }) => {
        await openPulsingGame(page, backend, createPreparedGame(2));

        expect(await redRange(page)).toBeLessThan(MIN_PULSE_RANGE);
    });
});
