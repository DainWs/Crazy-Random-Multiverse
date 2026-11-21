import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import * as Constants from '@/core/Constants';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import type CardView from '@/game/cards/CardView';
import type { GameScene } from '@/scenes/Game';

const mockEnter = vi.fn();
const mockExit = vi.fn();
const mockCommit = vi.fn();
const mockDrop = vi.fn();
const mockHover = vi.fn((_slot: unknown) => true);
const mockUnhover = vi.fn((_slot: unknown) => true);
let committed = false;
let cancelTargeting: () => void;
vi.mock('@/game/perspectives/AttackTargetingPerspective', () => {
  return {
    default: class MockAttackTargetingPerspective {
      public readonly sourceSlot: unknown;

      constructor(_scene: unknown, sourceSlot: unknown, onCancel: () => void) {
        this.sourceSlot = sourceSlot;
        cancelTargeting = onCancel;
      }

      enter() {
        mockEnter();
      }

      exit() {
        mockExit();
      }

      commit(targetSlot: unknown) {
        committed = true;
        mockCommit(targetSlot);
      }

      drop() {
        mockDrop();
      }

      isCommitted() {
        return committed;
      }

      hover(slot: unknown) {
        return mockHover(slot);
      }

      unhover(slot: unknown) {
        return mockUnhover(slot);
      }
    }
  };
});

vi.mock('@/core/StoreSystem', () => ({ default: { getPlayer: () => ({ code: 'p-1' }) } }));

describe('CardClickHandler', () => {
  const attackCardOnZoneSlot = vi.fn(() => true);
  const canAct = vi.fn(() => true);
  const scene = { cardController: { attackCardOnZoneSlot, canAct } } as unknown as GameScene;
  const clickInTime = createMockPointer(Constants.DRAG_TIME_THRESHOLD - 10, Constants.DRAG_DISTANCE_THRESHOLD - 2);

  beforeEach(() => {
    vi.clearAllMocks();
    canAct.mockReturnValue(true);
    attackCardOnZoneSlot.mockReturnValue(true);
    committed = false;
  });

  afterEach(() => {
    cancelTargeting?.();
  });

  function createMockPointer(duration: number, distance: number, button: number = Constants.PRIMARY_BUTTON): Phaser.Input.Pointer {
    return {
      button,
      getDuration: vi.fn(() => duration),
      getDistance: vi.fn(() => distance)
    } as unknown as Phaser.Input.Pointer;
  }

  function createSlot(ownedByPlayer: boolean): ZoneSlotView {
    const slot = Object.create(ZoneSlotView.prototype) as ZoneSlotView;
    slot.zone = { isPlayerOwner: () => ownedByPlayer } as unknown as ZoneSlotView['zone'];
    slot.canAttack = () => true;
    return slot;
  }

  function createCard(parentContainer: unknown, canBeClicked = true, isAttackAvailable = true): CardView {
    return { canBeClicked: vi.fn(() => canBeClicked), parentContainer, card: { isAttackAvailable } } as unknown as CardView;
  }

  describe('cancelTargeting', () => {
    // VIEW-4
    it('stops targeting', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      CardClickHandler.cancelTargeting();

      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it('does nothing without a selected attacker', () => {
      CardClickHandler.cancelTargeting();

      expect(mockExit).not.toHaveBeenCalled();
    });

    it('lets the next click select an attacker again', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);
      CardClickHandler.cancelTargeting();

      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect(mockEnter).toHaveBeenCalledTimes(2);
    });
  });

  describe('onPointerUp', () => {
    it('does nothing when card cannot be clicked', () => {
      const card = createCard(createSlot(true), false);

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('selects the attacker when a card of the player in the board is clicked', () => {
      const card = createCard(createSlot(true));

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).toHaveBeenCalledTimes(1);
    });

    // VIEW-19
    it.each([1, 2])('does not select the attacker with the button %i, which pans the camera', (button) => {
      const card = createCard(createSlot(true));

      CardClickHandler.onPointerUp(scene, card, createMockPointer(Constants.DRAG_TIME_THRESHOLD - 10, 2, button));

      expect(mockEnter).not.toHaveBeenCalled();
    });

    // VIEW-4
    it('does not select the attacker when the card cannot attack now', () => {
      const card = createCard(createSlot(true), true, false);

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    // UI-4
    it('does not select the attacker when the player cannot act', () => {
      canAct.mockReturnValue(false);
      const card = createCard(createSlot(true));

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('does not select the attacker if pointer duration reaches the threshold (held too long)', () => {
      const card = createCard(createSlot(true));
      const pointer = createMockPointer(Constants.DRAG_TIME_THRESHOLD, 5);

      CardClickHandler.onPointerUp(scene, card, pointer);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('does not select the attacker if pointer distance reaches the threshold (dragged too far)', () => {
      const card = createCard(createSlot(true));
      const pointer = createMockPointer(50, Constants.DRAG_DISTANCE_THRESHOLD);

      CardClickHandler.onPointerUp(scene, card, pointer);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('does not select the attacker when the card is not in a slot', () => {
      const card = createCard(null);

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('does not select the attacker when the card belongs to another player', () => {
      const card = createCard(createSlot(false));

      CardClickHandler.onPointerUp(scene, card, clickInTime);

      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('selects an attacker again after the targeting is cancelled', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);
      cancelTargeting();

      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect(mockEnter).toHaveBeenCalledTimes(2);
    });
  });

  // VIEW-4
  describe('while an attacker is selected', () => {
    let sourceSlot: ZoneSlotView;

    beforeEach(() => {
      sourceSlot = createSlot(true);
      CardClickHandler.onPointerUp(scene, createCard(sourceSlot), clickInTime);
    });

    it('cancels the selection when the selected card is clicked', () => {
      CardClickHandler.onPointerUp(scene, createCard(sourceSlot), clickInTime);

      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it('lowers the selected card and selects the other when another own card that can attack is clicked', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect([mockExit.mock.calls.length, mockEnter.mock.calls.length]).toEqual([1, 2]);
    });

    it('keeps the selection when another own card that cannot attack is clicked', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true), true, false), clickInTime);

      expect([mockExit, mockEnter].map((mock) => mock.mock.calls.length)).toEqual([0, 1]);
    });

    it('attacks the clicked card when it is a valid target', () => {
      const targetSlot = createSlot(false);

      CardClickHandler.onPointerUp(scene, createCard(targetSlot), clickInTime);

      expect(attackCardOnZoneSlot).toHaveBeenCalledWith(sourceSlot, targetSlot, expect.any(Function));
    });

    it('keeps the attacker and the target lifted while the request is pending', () => {
      const targetSlot = createSlot(false);

      CardClickHandler.onPointerUp(scene, createCard(targetSlot), clickInTime);

      expect([mockCommit, mockExit].map((mock) => mock.mock.calls.length)).toEqual([1, 0]);
    });

    it('lowers both when the request is rejected', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);
      const [, , undoPreview] = attackCardOnZoneSlot.mock.calls[0] as unknown as [unknown, unknown, () => void];

      undoPreview();

      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it('lowers both when the attack is not sent', () => {
      attackCardOnZoneSlot.mockReturnValue(false);

      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);

      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it('does nothing when a rival card that cannot be attacked is clicked, and keeps the selection', () => {
      sourceSlot.canAttack = () => false;

      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);

      expect([attackCardOnZoneSlot, mockExit].map((mock) => mock.mock.calls.length)).toEqual([0, 0]);
    });

    it('ignores the clicks once the attack is waiting for the server', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);

      CardClickHandler.onPointerUp(scene, createCard(sourceSlot), clickInTime);

      expect(mockExit).not.toHaveBeenCalled();
    });
  });

  // VIEW-5
  describe('dropTargeting', () => {
    it('drops the lifts of an attack that waits for the server', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);
      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);

      CardClickHandler.dropTargeting();

      expect(mockDrop).toHaveBeenCalledTimes(1);
    });

    it('does nothing for a selection that has not attacked', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      CardClickHandler.dropTargeting();

      expect(mockDrop).not.toHaveBeenCalled();
    });
  });

  describe('onPointerOver', () => {
    it('is not handled without a selected attacker', () => {
      expect(CardClickHandler.onPointerOver(createCard(createSlot(false)))).toBe(false);
    });

    it('leaves the hover of the card to the selection while an attacker is selected', () => {
      const slot = createSlot(false);
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      const handled = CardClickHandler.onPointerOver(createCard(slot));

      expect(handled).toBe(true);
      expect(mockHover).toHaveBeenCalledWith(slot);
    });

    it('is not handled when the card is not in a slot', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect(CardClickHandler.onPointerOver(createCard(null))).toBe(false);
    });
  });

  describe('onPointerOut', () => {
    it('is not handled without a selected attacker', () => {
      expect(CardClickHandler.onPointerOut(createCard(createSlot(false)))).toBe(false);
    });

    it('is not handled when the selection leaves the hover to the card', () => {
      mockUnhover.mockReturnValueOnce(false);
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect(CardClickHandler.onPointerOut(createCard(createSlot(true)))).toBe(false);
    });
  });
});
