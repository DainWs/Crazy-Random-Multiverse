import type { ConsoleMessage, Page } from '@playwright/test';
import type { CardDto } from '@/api/dtos/CardDto';
import type { GameDto } from '@/api/dtos/GameDto';
import type BackendDouble from '@/support/BackendDouble';
import {
    EMPTY_OWN_SLOT,
    EMPTY_SIDE_RIVAL_SLOT,
    EMPTY_TABLE,
    EXPANDED_HAND_AREA,
    HAND_CARD,
    OWN_SLOT_AREA,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    SIDE_RIVAL_WARRIOR,
    TOOLTIP_AREA,
    dragTo,
    frameOf,
    hover,
    isArrowGreenBetween,
    openBoard,
    waitForStillFrame
} from '@/support/board';
import { createPreparedGame, withCombatant } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const GAME_CODE = 'game-1';
const LOCAL_PLAYER = 'user-1';
const RIVAL_PLAYER = 'user-2';
/** The rival that plays next sits on the left side (VIEW-13). */
const SIDE_RIVAL_PLAYER = 'user-2';
const OWN_ZONE = 0;
const RIVAL_ZONE = 1;
const WARRIOR_POSITION = { row: 1, column: 0 };
const EMPTY_SLOT_POSITION = { row: 1, column: 1 };
const HAND_WARRIOR = { code: '20', type: 'WARRIOR' };
const ARMOR_DAMAGE = 2;
const HEALTH_DAMAGE = 2;

function hasWebGlContext(): boolean {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    return Boolean(canvas.getContext('webgl') ?? canvas.getContext('webgl2'));
}

/** Without a session the first GET /user answers 400, and the browser logs it. */
function isExpectedNoSessionError(message: ConsoleMessage): boolean {
    return message.location().url.endsWith('/user');
}

function collectConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error' && !isExpectedNoSessionError(message)) {
            errors.push(message.text());
        }
    });

    return errors;
}

function combatantAt(game: GameDto, zone: number): CardDto {
    return game.zones[zone].combatants[WARRIOR_POSITION.row][WARRIOR_POSITION.column].combatant!;
}

/** The state of the game after the attack of the prepared game, with the attacker spent (COMBAT-11). */
function gameAfterAttack(game: GameDto): GameDto {
    const attacker = { ...combatantAt(game, OWN_ZONE), attackAvailable: false };
    const target = combatantAt(game, RIVAL_ZONE);
    const damaged = { ...target, armor: target.armor! - ARMOR_DAMAGE, health: target.health! - HEALTH_DAMAGE };

    return withCombatant(withCombatant(game, OWN_ZONE, WARRIOR_POSITION, attacker), RIVAL_ZONE, WARRIOR_POSITION, damaged);
}

async function attackRival(page: Page, backend: BackendDouble, game: GameDto): Promise<void> {
    await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
    await hover(page, RIVAL_WARRIOR);
    await page.mouse.click(RIVAL_WARRIOR.x, RIVAL_WARRIOR.y);
    await expect.poll(() => backend.actions.length).toBe(1);

    backend.emitGameEvent('PLAYER_ATTACK_CARD', {
        game: gameAfterAttack(game),
        sourcePlayer: game.zones[OWN_ZONE].owner,
        sourcePosition: WARRIOR_POSITION,
        targetPlayer: game.zones[RIVAL_ZONE].owner,
        targetPosition: WARRIOR_POSITION,
        armorDamage: ARMOR_DAMAGE,
        healthDamage: HEALTH_DAMAGE,
        targetDead: false
    });
    await hover(page, EMPTY_TABLE);
}

test.describe('startup', () => {
    test('starts Phaser with a WebGL context', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('canvas')).toBeAttached();

        expect(await page.evaluate(hasWebGlContext)).toBe(true);
    });

    test('reaches the main menu without console errors', async ({ page }) => {
        const errors = collectConsoleErrors(page);

        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Crazy Random Multiverse' })).toBeVisible();

        expect(errors).toEqual([]);
    });
});

test.describe('game of two players', () => {
    const game = createPreparedGame(2).game;

    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    // VIEW-14
    test('expands the hand on hover', async ({ page }) => {
        const closedHand = await frameOf(page, EXPANDED_HAND_AREA);

        await hover(page, HAND_CARD);

        expect((await frameOf(page, EXPANDED_HAND_AREA)).equals(closedHand)).toBe(false);
    });

    // VIEW-14
    test('shows the side panel on hover', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);

        await hover(page, HAND_CARD);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    // VIEW-14
    test('closes the side panel when leaving the card', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);
        await hover(page, HAND_CARD);

        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(true);
    });

    // CON-14
    test('sends PUT_ACTION with the row of the slot', async ({ page, backend }) => {
        await dragTo(page, HAND_CARD, EMPTY_OWN_SLOT);

        expect(backend.actions).toEqual([
            {
                game: GAME_CODE,
                type: 'PUT_ACTION',
                sourcePlayer: LOCAL_PLAYER,
                sourceCard: HAND_WARRIOR,
                targetPlayer: LOCAL_PLAYER,
                targetPosition: EMPTY_SLOT_POSITION
            }
        ]);
    });

    // CON-17
    test('draws the placed card after the event', async ({ page, backend }) => {
        const emptySlot = await frameOf(page, OWN_SLOT_AREA);
        const prepared = createPreparedGame(2);
        await dragTo(page, HAND_CARD, EMPTY_OWN_SLOT);

        backend.emitGameEvent('PLAYER_PUT_CARD', {
            game: withCombatant(game, OWN_ZONE, EMPTY_SLOT_POSITION, prepared.hand[0]),
            sourcePlayer: game.zones[OWN_ZONE].owner,
            sourceCard: prepared.hand[0],
            targetPlayer: game.zones[OWN_ZONE].owner,
            targetPosition: EMPTY_SLOT_POSITION
        });
        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, OWN_SLOT_AREA)).equals(emptySlot)).toBe(false);
    });

    // VIEW-4, UI-5
    test('draws a green arrow over a valid target', async ({ page }) => {
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);

        await hover(page, RIVAL_WARRIOR);

        expect(await isArrowGreenBetween(page, OWN_WARRIOR, RIVAL_WARRIOR)).toBe(true);
    });

    // VIEW-4
    test('shows the target in the side panel', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);

        await hover(page, RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    // VIEW-4
    test('sends ATTACK_ACTION when clicking the target', async ({ page, backend }) => {
        await attackRival(page, backend, game);

        expect(backend.actions).toEqual([
            {
                game: GAME_CODE,
                type: 'ATTACK_ACTION',
                sourcePlayer: LOCAL_PLAYER,
                sourcePosition: WARRIOR_POSITION,
                targetPlayer: RIVAL_PLAYER,
                targetPosition: WARRIOR_POSITION
            }
        ]);
    });

    // VIEW-6: the panel shows the statistics, and no other mark of the attack reaches it
    test('lowers the health of the target', async ({ page, backend }) => {
        await hover(page, RIVAL_WARRIOR);
        const panelBefore = await frameOf(page, TOOLTIP_AREA);
        await hover(page, EMPTY_TABLE);

        await attackRival(page, backend, game);
        await hover(page, RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(panelBefore)).toBe(false);
    });

    // COMBAT-11
    test('does not select an attacker that has attacked', async ({ page, backend }) => {
        await attackRival(page, backend, game);

        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, RIVAL_WARRIOR);

        expect(await isArrowGreenBetween(page, OWN_WARRIOR, RIVAL_WARRIOR)).toBe(false);
    });
});

test.describe('game of three players', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend, 3);
    });

    // VIEW-2, VIEW-14
    test('shows the side panel of a card in a rotated zone', async ({ page }) => {
        const noPanel = await frameOf(page, TOOLTIP_AREA);

        await hover(page, SIDE_RIVAL_WARRIOR);

        expect((await frameOf(page, TOOLTIP_AREA)).equals(noPanel)).toBe(false);
    });

    // VIEW-2
    test('attacks a card in a rotated zone', async ({ page, backend }) => {
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, SIDE_RIVAL_WARRIOR);
        await page.mouse.click(SIDE_RIVAL_WARRIOR.x, SIDE_RIVAL_WARRIOR.y);

        await expect.poll(() => backend.actions).toEqual([
            {
                game: GAME_CODE,
                type: 'ATTACK_ACTION',
                sourcePlayer: LOCAL_PLAYER,
                sourcePosition: WARRIOR_POSITION,
                targetPlayer: SIDE_RIVAL_PLAYER,
                targetPosition: WARRIOR_POSITION
            }
        ]);
    });

    // VIEW-2, BOARD: a card is only placed in the zone of its owner
    test('sends no action when dropping on a rotated zone', async ({ page, backend }) => {
        await dragTo(page, HAND_CARD, EMPTY_SIDE_RIVAL_SLOT);
        await waitForStillFrame(page);

        expect(backend.actions).toEqual([]);
    });
});
