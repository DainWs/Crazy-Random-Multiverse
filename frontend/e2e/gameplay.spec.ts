import type { PreparedGame } from '@/support/preparedGame';
import {
    EMPTY_OWN_SLOT,
    EMPTY_TABLE,
    OWN_WARRIOR,
    TABLE_AREA,
    dragTo,
    frameOf,
    hover,
    isArrowRedBetween,
    openBoard,
    openGame
} from '@/support/board';
import { createPreparedGame, createWarrior, withCombatant } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const OWN_ZONE = 0;
const RIVAL_ZONE = 1;
const SECOND_SLOT = { row: 1, column: 1 };
const RIVAL_BACK_SLOT = { row: 1, column: 0 };
const RIVAL_FRONT_SLOT = { row: 2, column: 0 };
const RIVAL_FRONT_WARRIOR = { x: 1017, y: 255 };

const BACK_ROW = { clip: { x: 850, y: 655, width: 220, height: 125 }, maxDiffPixels: 0 };
const REJECTION_MESSAGE_AREA = { x: 660, y: 0, width: 600, height: 40 };
const NOT_YOUR_TURN_KEY = 'exception.player-action.allowed_only_on_turn';

/** The second warrior has other statistics, because two equal cards would look the same after swapping. */
function createGameWithTwoWarriors(): PreparedGame {
    const prepared = createPreparedGame(2);
    const secondWarrior = createWarrior('15', { damage: 9 });
    prepared.game = withCombatant(prepared.game, OWN_ZONE, SECOND_SLOT, secondWarrior);

    return prepared;
}

/** A warrior that cannot attack, a protected rival in the back row and an exposed rival in the front row (UI-5, PROT-1). */
function createGameWithMarks(): PreparedGame {
    const prepared = createPreparedGame(2);
    const spentWarrior = createWarrior('15');
    const protectedRival = createWarrior('16', { protected: true });
    const exposedRival = createWarrior('17', { targetable: true });
    const withSpent = withCombatant(prepared.game, OWN_ZONE, SECOND_SLOT, spentWarrior);
    const withProtected = withCombatant(withSpent, RIVAL_ZONE, RIVAL_BACK_SLOT, protectedRival);
    prepared.game = withCombatant(withProtected, RIVAL_ZONE, RIVAL_FRONT_SLOT, exposedRival);

    return prepared;
}

test.describe('swap of two cards', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, createGameWithTwoWarriors());
        await hover(page, EMPTY_TABLE);
        backend.holdActions();
    });

    // BOARD-7, ARCH-2
    test('shows both cards swapped while the server answers', async ({ page }) => {
        await dragTo(page, OWN_WARRIOR, EMPTY_OWN_SLOT);
        await hover(page, EMPTY_TABLE);

        await expect(page).toHaveScreenshot('swap-preview.png', BACK_ROW);
    });

    // UI-6
    test('puts both cards back when the server rejects it', async ({ page, backend }) => {
        const backRowBefore = await frameOf(page, BACK_ROW.clip);
        await dragTo(page, OWN_WARRIOR, EMPTY_OWN_SLOT);
        await hover(page, EMPTY_TABLE);

        await backend.rejectHeldActions(NOT_YOUR_TURN_KEY);
        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, BACK_ROW.clip)).equals(backRowBefore)).toBe(true);
    });

    // UI-6
    test('shows the message of the rejection', async ({ page, backend }) => {
        const noMessage = await frameOf(page, REJECTION_MESSAGE_AREA);
        await dragTo(page, OWN_WARRIOR, EMPTY_OWN_SLOT);

        await backend.rejectHeldActions(NOT_YOUR_TURN_KEY);

        await expect.poll(async () => (await frameOf(page, REJECTION_MESSAGE_AREA)).equals(noMessage)).toBe(false);
    });
});

test.describe('aiming an attack', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
        await hover(page, EMPTY_TABLE);
    });

    // VIEW-4
    test('draws a red arrow outside a valid target', async ({ page }) => {
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);

        await hover(page, EMPTY_TABLE);

        expect(await isArrowRedBetween(page, OWN_WARRIOR, EMPTY_TABLE)).toBe(true);
    });

    // VIEW-4, UI-5
    test('cancels the selection with Escape', async ({ page }) => {
        const noSelection = await page.screenshot();
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, EMPTY_TABLE);

        await page.keyboard.press('Escape');
        await hover(page, EMPTY_TABLE);

        expect((await page.screenshot()).equals(noSelection)).toBe(true);
    });

    // VIEW-4, UI-5
    test('cancels the selection with a click outside the cards', async ({ page }) => {
        const noSelection = await page.screenshot();
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, EMPTY_TABLE);

        await page.mouse.click(EMPTY_TABLE.x, EMPTY_TABLE.y);
        await hover(page, EMPTY_TABLE);

        expect((await page.screenshot()).equals(noSelection)).toBe(true);
    });
});

test.describe('marks of an attack', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openGame(page, backend, createGameWithMarks());
        await hover(page, EMPTY_TABLE);
    });

    // UI-5
    test('marks the attacker and only the cards it can attack', async ({ page }) => {
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, EMPTY_TABLE);

        await expect(page).toHaveScreenshot('attack-marks.png', { clip: TABLE_AREA, maxDiffPixels: 0 });
    });

    // UI-5
    test('removes the marks when the attack is made', async ({ page, backend }) => {
        const noMarks = await frameOf(page, TABLE_AREA);
        await page.mouse.click(OWN_WARRIOR.x, OWN_WARRIOR.y);
        await hover(page, RIVAL_FRONT_WARRIOR);

        await page.mouse.click(RIVAL_FRONT_WARRIOR.x, RIVAL_FRONT_WARRIOR.y);
        await expect.poll(() => backend.actions.length).toBe(1);
        await hover(page, EMPTY_TABLE);

        expect((await frameOf(page, TABLE_AREA)).equals(noMarks)).toBe(true);
    });
});
