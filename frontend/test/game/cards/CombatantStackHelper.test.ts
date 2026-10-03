import { describe, expect, it, vi } from 'vitest';
import CombatantStackHelper, {
  calculateRevealedCardOffset,
  calculateStackedCardOffset
} from '@/game/cards/CombatantStackHelper';
import type CardView from '@/game/cards/CardView';

describe('CombatantStackHelper', () => {
  describe('calculateStackedCardOffset', () => {
    it('returns [-offset, 0] for 0 degrees (default)', () => {
      expect(calculateStackedCardOffset(0, 20)).toEqual([-20, 0]);
    });

    it('returns [0, offset] for 90 degrees', () => {
      expect(calculateStackedCardOffset(90, 20)).toEqual([0, 20]);
    });

    it('returns [offset, 0] for 180 degrees', () => {
      expect(calculateStackedCardOffset(180, 20)).toEqual([20, 0]);
    });

    it('returns [0, -offset] for -90 degrees', () => {
      expect(calculateStackedCardOffset(-90, 20)).toEqual([0, -20]);
    });
  });

  describe('calculateRevealedCardOffset', () => {
    const cardWidth = 200;
    const offset = 20;
    const total = 220;

    it('returns [-total, 0] for 0 degrees', () => {
      expect(calculateRevealedCardOffset(0, offset, cardWidth)).toEqual([-total, 0]);
    });

    it('returns [0, total] for 90 degrees', () => {
      expect(calculateRevealedCardOffset(90, offset, cardWidth)).toEqual([0, total]);
    });

    it('returns [total, 0] for 180 degrees', () => {
      expect(calculateRevealedCardOffset(180, offset, cardWidth)).toEqual([total, 0]);
    });

    it('returns [0, -total] for -90 degrees', () => {
      expect(calculateRevealedCardOffset(-90, offset, cardWidth)).toEqual([0, -total]);
    });
  });

  describe('stacking state and rules', () => {
    const createMockCardView = (angle = 0, depth = 10) => {
      return {
        angle,
        depth,
        scene: {
          input: {
            setDraggable: vi.fn()
          }
        },
        addAt: vi.fn(),
        on: vi.fn(),
        setOriginalPosition: vi.fn(),
        setOriginalDepth: vi.fn(),
        setAngle: vi.fn(),
        reset: vi.fn(),
        disableInteractive: vi.fn(),
        applyTween: vi.fn()
      } as unknown as CardView;
    };

    it('allows stacking initially and forbids multiple stacking', () => {
      const combatant = createMockCardView();
      const helper = new CombatantStackHelper(combatant, 20);

      expect(helper.canStackMore()).toBe(true);
      expect(helper.hasCardStacked()).toBe(false);
      expect(helper.getCardBehind()).toBeUndefined();

      const equipment = createMockCardView();
      helper.stack(equipment);

      expect(helper.canStackMore()).toBe(false);
      expect(helper.hasCardStacked()).toBe(true);
      expect(helper.getCardBehind()).toBe(equipment);

      // Attempting to stack a second card throws
      const equipment2 = createMockCardView();
      expect(() => helper.stack(equipment2)).toThrowError('A card is already attached behind.');
    });

    it('sets stacked card depth behind combatant and syncs angle', () => {
      const combatant = createMockCardView(90, 50);
      const helper = new CombatantStackHelper(combatant, 25);
      const equipment = createMockCardView();

      helper.stack(equipment);

      expect(equipment.setOriginalDepth).toHaveBeenCalledWith(49);
      expect(equipment.setAngle).toHaveBeenCalledWith(90);
      expect(equipment.setOriginalPosition).toHaveBeenCalledWith(0, 25);
    });
  });
});
