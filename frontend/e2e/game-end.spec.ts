import type { Page } from '@playwright/test';
import type { GameDto } from '@/api/dtos/GameDto';
import type BackendDouble from '@/support/BackendDouble';
import type { PreparedGame } from '@/support/preparedGame';
import { frameOf, openGame } from '@/support/board';
import { createPreparedGame, withCombatant } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const OWN_ZONE = 0;
const RIVAL_ZONE = 1;
const ATTACKER_POSITION = { row: 1, column: 0 };
const RIVAL_WARRIOR_POSITION = { row: 1, column: 0 };
const RIVAL_LEADER_POSITION = { row: 0, column: 0 };
const LEADER_HEALTH = 30;

/** A pixel of the background, which only changes when the veil of the result covers the screen. */
const BACKGROUND_PIXEL = { x: 200, y: 200, width: 1, height: 1 };

/** The attack and the death of a leader last at least 2.4 s, and a slow render only makes them longer. */
const ANIMATIONS_MIN_DURATION_MS = 2000;
const RESULT_TIMEOUT_MS = 15000;

/** The only thing protecting the rival leader is gone, so it can receive the last attack (PROT-2). */
function createGameWithExposedLeader(): PreparedGame {
    const prepared = createPreparedGame(2);
    prepared.game = withCombatant(prepared.game, RIVAL_ZONE, RIVAL_WARRIOR_POSITION);

    return prepared;
}

/** The server removes the cards of the eliminated player and has no player with the turn (ELIM-3, CON-23). */
function gameAfterLastAttack(game: GameDto): GameDto {
    const ended = withCombatant(game, RIVAL_ZONE, RIVAL_LEADER_POSITION);
    ended.zones[RIVAL_ZONE].owner.isAlive = false;
    delete ended.playerWithTurn;

    return ended;
}

/** The events of the last attack of a game, all together, in the order of CON-22. */
function emitLastAttack(backend: BackendDouble, game: GameDto): void {
    const ended = gameAfterLastAttack(game);
    const winner = game.zones[OWN_ZONE].owner;
    const loser = ended.zones[RIVAL_ZONE].owner;

    backend.emitGameEvent('PLAYER_ATTACK_CARD', {
        game: ended,
        sourcePlayer: winner,
        sourcePosition: ATTACKER_POSITION,
        targetPlayer: loser,
        targetPosition: RIVAL_LEADER_POSITION,
        armorDamage: 0,
        healthDamage: LEADER_HEALTH,
        targetDead: true
    });
    backend.emitGameEvent('PLAYER_DIE', { game: ended, targetPlayer: loser });
    backend.emitGameEvent('GAME_END', { game: ended });
    backend.emitGameEvent('GAME_END_WITH_WINNER', { game: ended, targetPlayer: winner });
}

async function isBackgroundCoveredWithin(page: Page, background: Buffer, durationMs: number): Promise<boolean> {
    const end = Date.now() + durationMs;

    while (Date.now() < end) {
        if (!(await frameOf(page, BACKGROUND_PIXEL)).equals(background)) {
            return true;
        }
    }

    return false;
}

test.describe('last attack of a game', () => {
    const prepared = createGameWithExposedLeader();

    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, prepared);
    });

    // UI-4, WIN-4
    test('shows no result while the animations play', async ({ page, backend }) => {
        const background = await frameOf(page, BACKGROUND_PIXEL);

        emitLastAttack(backend, prepared.game);

        expect(await isBackgroundCoveredWithin(page, background, ANIMATIONS_MIN_DURATION_MS)).toBe(false);
    });

    // WIN-4, VIEW-12
    test('shows the result after the last animation', async ({ page, backend }) => {
        const background = await frameOf(page, BACKGROUND_PIXEL);

        emitLastAttack(backend, prepared.game);

        await expect.poll(async () => (await frameOf(page, BACKGROUND_PIXEL)).equals(background), { timeout: RESULT_TIMEOUT_MS }).toBe(false);
    });
});
