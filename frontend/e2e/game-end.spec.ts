import type { Page } from '@playwright/test';
import type { GameDto } from '@/api/dtos/GameDto';
import type BackendDouble from '@/support/BackendDouble';
import type { PreparedGame } from '@/support/preparedGame';
import { TABLE_AREA, frameOf, openGame, waitForStillFrame } from '@/support/board';
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

// ELIM-5, VIEW-11
test.describe('elimination of a rival in a game of three', () => {
    const prepared = createPreparedGame(3);

    test('keeps the game going and covers the zone of the eliminated rival', async ({ page, backend }) => {
        await openGame(page, backend, prepared);
        const before = await frameOf(page, TABLE_AREA);
        const eliminated = structuredClone(prepared.game);
        eliminated.zones[RIVAL_ZONE].owner.isAlive = false;
        eliminated.zones[RIVAL_ZONE].owner.handSize = 0;

        backend.emitGameEvent('PLAYER_DIE', { game: eliminated, targetPlayer: eliminated.zones[RIVAL_ZONE].owner });
        await waitForStillFrame(page, before);

        expect(await frameOf(page, TABLE_AREA)).not.toEqual(before);
    });
});

// UI-8, UI-15, SPEC-3
test.describe('spectator who was eliminated', () => {
    const LEAVE_BUTTON = { x: 1850, y: 1035 };
    const CONFIRM_YES = { x: 830, y: 590 };
    const prepared = createPreparedGame(3);

    test('leaves the game after confirming and returns to the main menu', async ({ page, backend }) => {
        await openGame(page, backend, prepared);
        const eliminated = structuredClone(prepared.game);
        eliminated.zones[OWN_ZONE].owner.isAlive = false;
        eliminated.zones[OWN_ZONE].owner.isSpectator = true;
        backend.emitGameEvent('PLAYER_DIE', { game: eliminated, targetPlayer: eliminated.zones[OWN_ZONE].owner });
        await waitForStillFrame(page);

        await page.mouse.click(LEAVE_BUTTON.x, LEAVE_BUTTON.y);
        await waitForStillFrame(page);
        await page.mouse.click(CONFIRM_YES.x, CONFIRM_YES.y);

        await expect(page.getByRole('button', { name: 'Crear party' })).toBeVisible();
        expect(backend.leaveCalls).toBe(1);
    });
});
