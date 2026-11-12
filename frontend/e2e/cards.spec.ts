import type { CardDto } from '@/api/dtos/CardDto';
import type { Area } from '@/support/board';
import type { PreparedGame } from '@/support/preparedGame';
import { EMPTY_TABLE, HAND_CARD, OWN_WARRIOR, SOLE_HAND_CARD, TOOLTIP_AREA, frameOf, hover, openGame } from '@/support/board';
import { createEquipment, createPreparedGame, withCombatant } from '@/support/preparedGame';
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

/** The card of the own warrior and the table to its left, where the pieces of equipment slide out. */
const STACK_AREA: Area = { x: 650, y: 650, width: 310, height: 130 };

// VIEW-14, EQUIP-4
test.describe('equipment stacked behind its combatant', () => {
    const pieces = [createEquipment('30', PISTOL), createEquipment('31', SHIELD)];

    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, withEquipmentOnOwnWarrior(createPreparedGame(2), pieces));
    });

    test('shows a strip of every piece behind the card', async ({ page }) => {
        await expect(page).toHaveScreenshot('stack-rest.png', { clip: STACK_AREA, maxDiffPixels: 0 });
    });

    test('slides every piece out while hovering', async ({ page }) => {
        await hover(page, OWN_WARRIOR);

        await expect(page).toHaveScreenshot('stack-hover.png', { clip: STACK_AREA, maxDiffPixels: 0 });
    });

    test('slides the pieces back after leaving', async ({ page }) => {
        const atRest = await frameOf(page, STACK_AREA);
        await hover(page, OWN_WARRIOR);

        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, STACK_AREA)).equals(atRest)).toBe(true);
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

// VIEW-14, ELIM-3
test.describe('side panel of a card that disappears', () => {
    test('closes when the hand of the hovered card is emptied', async ({ page, backend }) => {
        const prepared = createPreparedGame(2);
        await openGame(page, backend, prepared);
        const noPanel = await frameOf(page, PANEL_CARD_AREA);
        await hover(page, HAND_CARD);
        expect((await frameOf(page, PANEL_CARD_AREA)).equals(noPanel)).toBe(false);
        const eliminated = structuredClone(prepared.game);
        eliminated.zones[OWN_ZONE].owner.isAlive = false;
        eliminated.zones[OWN_ZONE].owner.isSpectator = true;

        backend.emitGameEvent('PLAYER_DIE', { game: eliminated, targetPlayer: eliminated.zones[OWN_ZONE].owner });

        await expect.poll(async () => (await frameOf(page, PANEL_CARD_AREA)).equals(noPanel)).toBe(true);
    });
});
