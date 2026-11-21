import type { Area } from '@/support/board';
import { frameOf, openBoard, openGame, sameFrame, waitForStillFrame } from '@/support/board';
import { createPreparedGame, withEliminatedPlayer } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const WHOLE_SCREEN: Area = { x: 0, y: 0, width: 1920, height: 1080 };
const NEXT_RIVAL_ZONE = 1;
const THIRD_ZONE = 2;
/** The leader row of the contract (CON-14). */
const LEADER_ROW = 0;

// VIEW-49, VIEW-50, VIEW-51: the labels of a board at rest are in the images of `layouts.spec.ts`
test.describe('labels around the zones', () => {
    // VIEW-50: the fill is green at any share, so only its length tells how much is left
    test('fills the bar by the health of the leader', async ({ page, backend }) => {
        const prepared = createPreparedGame(4);
        const healthByZone = [30, 20, 12, 3];
        prepared.game.zones.forEach((zone, index) => {
            zone.combatants[LEADER_ROW][0].combatant!.health = healthByZone[index];
        });

        await openGame(page, backend, prepared);

        await expect(page).toHaveScreenshot('zone-labels-damaged.png', { maxDiffPixels: 0 });
    });

    test('moves the mark of who plays next when the turn changes', async ({ page, backend }) => {
        const prepared = createPreparedGame(4);
        await openBoard(page, backend, 4);
        const beforeTurnChange = await frameOf(page, WHOLE_SCREEN);

        backend.emitGameEvent('TURN_CHANGE', { game: { ...prepared.game, playerWithTurn: prepared.game.zones[NEXT_RIVAL_ZONE].owner } });
        await waitForStillFrame(page);

        expect(await sameFrame(page, await frameOf(page, WHOLE_SCREEN), beforeTurnChange)).toBe(false);
    });

    test('draws no health bar for the zone of an eliminated player', async ({ page, backend }) => {
        const prepared = createPreparedGame(3);
        await openBoard(page, backend, 3);
        const withBars = await frameOf(page, WHOLE_SCREEN);

        const eliminated = withEliminatedPlayer(prepared.game, THIRD_ZONE);
        backend.emitGameEvent('PLAYER_DIE', { game: eliminated, targetPlayer: eliminated.zones[THIRD_ZONE].owner });
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('zone-labels-eliminated.png', { maxDiffPixels: 0 });
        expect(await sameFrame(page, await frameOf(page, WHOLE_SCREEN), withBars)).toBe(false);
    });
});
