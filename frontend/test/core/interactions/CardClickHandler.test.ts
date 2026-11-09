import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import * as Constants from '@/core/Constants';
import ZoneSlotView from '@/game/zone/ZoneSlotView';
import type CardView from '@/game/cards/CardView';
import type { GameScene } from '@/scenes/Game';

const mockEnter = vi.fn();
const mockExit = vi.fn();
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
    }
  };
});

vi.mock('@/core/StoreSystem', () => ({ default: { getPlayer: () => ({ code: 'p-1' }) } }));

describe('CardClickHandler', () => {
  const attackCardOnZoneSlot = vi.fn();
  const canAct = vi.fn(() => true);
  const scene = { cardController: { attackCardOnZoneSlot, canAct } } as unknown as GameScene;
  const clickInTime = createMockPointer(Constants.DRAG_TIME_THRESHOLD - 10, Constants.DRAG_DISTANCE_THRESHOLD - 2);

  beforeEach(() => {
    vi.clearAllMocks();
    canAct.mockReturnValue(true);
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

  describe('onPointerDown', () => {
    it('is a no-op so Phaser can distinguish click vs drag', () => {
      const card = createCard(createSlot(true));

      expect(() => CardClickHandler.onPointerDown(scene, card, clickInTime)).not.toThrow();
      expect(mockEnter).not.toHaveBeenCalled();
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

    // UI-5
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

    it('attacks the clicked card from the selected attacker', () => {
      const sourceSlot = createSlot(true);
      const targetSlot = createSlot(false);
      CardClickHandler.onPointerUp(scene, createCard(sourceSlot), clickInTime);

      CardClickHandler.onPointerUp(scene, createCard(targetSlot), clickInTime);

      expect(attackCardOnZoneSlot).toHaveBeenCalledWith(sourceSlot, targetSlot);
    });

    it('stops targeting after the attack', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      CardClickHandler.onPointerUp(scene, createCard(createSlot(false)), clickInTime);

      expect(mockExit).toHaveBeenCalledTimes(1);
    });

    it('selects an attacker again after the targeting is cancelled', () => {
      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);
      cancelTargeting();

      CardClickHandler.onPointerUp(scene, createCard(createSlot(true)), clickInTime);

      expect(mockEnter).toHaveBeenCalledTimes(2);
    });
  });
});
