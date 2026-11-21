import type { Area } from '@/support/board';
import { frameOf, openBoard, sameFrame } from '@/support/board';
import { createPreparedGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const RIVAL_ZONE = 1;
const NEXT_ROUND = 2;

/** The center of the screen, where the notices are shown (VIEW-15). */
const NOTICE_AREA: Area = { x: 660, y: 518, width: 600, height: 44 };
const NOTICE_TIMEOUT_MS = 5000;

test.describe('notices of the turn and the round', () => {
    // A notice stays for its hold, which the instant motion skips, so it would be gone before any frame shows it
    test.use({ instantMotion: false });

    // VIEW-15
    test('shows a notice when the turn changes', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        await openBoard(page, backend);
        const withoutNotice = await frameOf(page, NOTICE_AREA);

        backend.emitGameEvent('TURN_CHANGE', { game: { ...prepared.game, playerWithTurn: prepared.game.zones[RIVAL_ZONE].owner } });

        await expect.poll(async () => sameFrame(page, await frameOf(page, NOTICE_AREA), withoutNotice), { timeout: NOTICE_TIMEOUT_MS }).toBe(false);
    });

    // VIEW-15
    test('shows a notice when the round changes', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        await openBoard(page, backend);
        const withoutNotice = await frameOf(page, NOTICE_AREA);

        backend.emitGameEvent('ROUND_CHANGE', { game: { ...prepared.game, round: NEXT_ROUND } });

        await expect.poll(async () => sameFrame(page, await frameOf(page, NOTICE_AREA), withoutNotice), { timeout: NOTICE_TIMEOUT_MS }).toBe(false);
    });
});
