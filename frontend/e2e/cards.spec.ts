import type { CardDto } from '@/api/dtos/CardDto';
import type { Area } from '@/support/board';
import type { PreparedGame } from '@/support/preparedGame';
import {
  EMPTY_TABLE,
  HAND_CARD,
  OWN_WARRIOR,
  SOLE_HAND_CARD,
  TOOLTIP_AREA,
  frameOf,
  hover,
  openBoard,
  openGame,
  sameFrame,
  zoomIn
} from '@/support/board';
import { createEquipment, createPreparedGame, withCombatant, withEliminatedPlayer } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const OWN_ZONE = 0;
const WARRIOR_POSITION = { row: 1, column: 0 };
const PISTOL = { name: 'Pistolon de prueba', damage: 15, health: -5 };
const SHIELD = { name: 'Escudo de prueba', damage: 0, armor: 4 };

/** The side panel without the leave button of a spectator, which is drawn in a corner of `TOOLTIP_AREA`. */
const PANEL_CARD_AREA: Area = { x: 1500, y: 100, width: 360, height: 500 };

function withEquipmentOnOwnWarrior(prepared: PreparedGame, pieces: CardDto[]): PreparedGame {
    const warrior = prepared.game.zones[OWN_ZONE].combatants[WARRIOR_POSITION.row][WARRIOR_POSITION.column].combatant!;
    const equipped = { ...warrior, equipment: pieces };

    return { ...prepared, game: withCombatant(prepared.game, OWN_ZONE, WARRIOR_POSITION, equipped) };
}

// VIEW-14, EQUIP-4
test.describe('side panel of a combatant with equipment', () => {
    const pieces = [createEquipment('30', PISTOL), createEquipment('31', SHIELD)];

    test('lists every piece of equipment', async ({ page, backend }) => {
        await openGame(page, backend, withEquipmentOnOwnWarrior(createPreparedGame(2), pieces));

        await hover(page, OWN_WARRIOR);

        await expect(page).toHaveScreenshot('panel-equipment.png', { clip: TOOLTIP_AREA, maxDiffPixels: 0 });
    });
});

function withOwnWarriorThatCannotAttack(prepared: PreparedGame): PreparedGame {
    const warrior = prepared.game.zones[OWN_ZONE].combatants[WARRIOR_POSITION.row][WARRIOR_POSITION.column].combatant!;
    const resting = { ...warrior, attackAvailable: false };

    return { ...prepared, game: withCombatant(prepared.game, OWN_ZONE, WARRIOR_POSITION, resting) };
}

// VIEW-59
test.describe('side panel of an own card on the turn of the local player', () => {
    test('says that the card can attack this turn', async ({ page, backend }) => {
        await openGame(page, backend, createPreparedGame(2));

        await hover(page, OWN_WARRIOR);

        await expect(page).toHaveScreenshot('panel-can-attack.png', { clip: TOOLTIP_AREA, maxDiffPixels: 0 });
    });

    test('says nothing for a card that cannot attack', async ({ page, backend }) => {
        await openGame(page, backend, withOwnWarriorThatCannotAttack(createPreparedGame(2)));

        await hover(page, OWN_WARRIOR);

        await expect(page).toHaveScreenshot('panel-cannot-attack.png', { clip: TOOLTIP_AREA, maxDiffPixels: 0 });
    });
});

/**
 * The card of the own warrior with its frame and the table to its left, where the pieces of equipment slide out: measured with
 * the top-down camera, the card goes from 848 to 912 by 724 to 824 at rest, and the pieces out reach 690.
 */
const STACK_AREA: Area = { x: 670, y: 705, width: 270, height: 140 };

// VIEW-65, EQUIP-4
test.describe('equipment stacked behind its combatant', () => {
    const pieces = [createEquipment('30', PISTOL), createEquipment('31', SHIELD)];

    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, withEquipmentOnOwnWarrior(createPreparedGame(2), pieces));
    });

    test('shows a strip of every piece behind the card, slides them out while hovering and back after leaving', async ({ page }) => {
        const atRest = await frameOf(page, STACK_AREA);
        await expect.soft(page).toHaveScreenshot('stack-rest.png', { clip: STACK_AREA, maxDiffPixels: 0 });

        await hover(page, OWN_WARRIOR);
        await expect.soft(page).toHaveScreenshot('stack-hover.png', { clip: STACK_AREA, maxDiffPixels: 0 });

        await hover(page, EMPTY_TABLE);
        expect(await sameFrame(page, await frameOf(page, STACK_AREA), atRest)).toBe(true);
    });
});

// VIEW-14
test.describe('equipment card', () => {
    test('shows its name and values in the side panel', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        await openGame(page, backend, { ...prepared, hand: [createEquipment('30', PISTOL)] });

        await hover(page, SOLE_HAND_CARD);

        await expect(page).toHaveScreenshot('panel-equipment-card.png', { clip: TOOLTIP_AREA, maxDiffPixels: 0 });
    });
});

// VIEW-14, VIEW-64, ELIM-3
test.describe('side panel of a card that disappears', () => {
    test('closes when the hand of the hovered card is emptied', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        await openGame(page, backend, prepared);
        const noPanel = await frameOf(page, PANEL_CARD_AREA);
        await hover(page, HAND_CARD);
        expect(await sameFrame(page, await frameOf(page, PANEL_CARD_AREA), noPanel)).toBe(false);
        const eliminated = withEliminatedPlayer(prepared.game, OWN_ZONE);

        backend.emitGameEvent('PLAYER_DIE', { game: eliminated, targetPlayer: eliminated.zones[OWN_ZONE].owner });

        await expect.poll(async () => sameFrame(page, await frameOf(page, PANEL_CARD_AREA), noPanel)).toBe(true);
    });
});

/** A warrior of the zone of the right side when the board is zoomed in with 10 players, which is in the right half of the screen. */
const RIGHT_SIDE_WARRIOR = { x: 1422, y: 583 };
const MAX_ZOOM_STEPS = 2;
const LEFT_PANEL_AREA: Area = { x: 0, y: 0, width: 480, height: 1080 };

// VIEW-14
test('opens the side panel on the left for a card in the right half of the screen', async ({ page, backend }) => {
    await openBoard(page, backend, 10);
    await zoomIn(page, MAX_ZOOM_STEPS);

    await hover(page, RIGHT_SIDE_WARRIOR);

    await expect(page).toHaveScreenshot('panel-left.png', { clip: LEFT_PANEL_AREA, maxDiffPixels: 0 });
});
