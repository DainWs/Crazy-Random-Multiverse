import { beforeEach, describe, expect, it, vi } from 'vitest';
import AttackTargetingPerspective from '@/game/perspectives/AttackTargetingPerspective';
import * as Constants from '@/core/Constants';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import type { GameScene } from '@/scenes/Game';

const lifts: Array<{ slot: unknown; size: unknown; lift: () => void; frame: (isValid: boolean) => void; lower: () => void; drop: () => void; dropShadow: () => void }> = [];
vi.mock('@/game/zone/CardLift', () => ({
  default: class MockCardLift {
    public readonly lift = vi.fn();
    public readonly frame = vi.fn();
    public readonly lower = vi.fn();
    public readonly drop = vi.fn();
    public readonly dropShadow = vi.fn();

    constructor(_scene: unknown, public readonly slot: unknown, public readonly size: unknown) {
      lifts.push(this as never);
    }
  }
}));

vi.mock('@/core/StoreSystem', () => ({ default: { getPlayer: () => ({ code: 'p-1' }) } }));

// VIEW-4
describe('AttackTargetingPerspective', () => {
  const onCancel = vi.fn();
  const restoreBoardOrder = vi.fn();
  const input = { on: vi.fn(), off: vi.fn(), keyboard: { on: vi.fn(), off: vi.fn() } };
  const events = { once: vi.fn(), off: vi.fn() };
  const scene = { input, events, restoreBoardOrder } as unknown as GameScene;

  function createSlot(ownedByPlayer: boolean): ZoneSlotView {
    return {
      zone: { isPlayerOwner: () => ownedByPlayer },
      canAttack: () => true
    } as unknown as ZoneSlotView;
  }

  const liftOf = (slot: ZoneSlotView) => lifts.find((entry) => entry.slot === slot)!;

  let sourceSlot: ZoneSlotView;
  let perspective: AttackTargetingPerspective;

  beforeEach(() => {
    vi.clearAllMocks();
    lifts.length = 0;
    sourceSlot = createSlot(true);
    perspective = new AttackTargetingPerspective(scene, sourceSlot, onCancel);
  });

  describe('enter', () => {
    it('lifts the attacker to 112% with its shadow', () => {
      perspective.enter();

      const attackerLift = liftOf(sourceSlot);
      expect(attackerLift.lift).toHaveBeenCalledTimes(1);
      expect(attackerLift.size).toEqual({ scale: Constants.ATTACKER_LIFT_SCALE, shadowOffset: Constants.ATTACKER_SHADOW_OFFSET });
    });

    it('draws no frame on the attacker', () => {
      perspective.enter();

      expect(liftOf(sourceSlot).frame).not.toHaveBeenCalled();
    });
  });

  describe('exit', () => {
    it('lowers the attacker and puts the board back in order', () => {
      perspective.enter();

      perspective.exit();

      expect(liftOf(sourceSlot).lower).toHaveBeenCalledTimes(1);
      expect(restoreBoardOrder).toHaveBeenCalledTimes(1);
    });

    it('lowers the rival card under the pointer', () => {
      const rival = createSlot(false);
      perspective.enter();
      perspective.hover(rival);

      perspective.exit();

      expect(liftOf(rival).lower).toHaveBeenCalledTimes(1);
    });
  });

  describe('hover', () => {
    it('lifts a rival card to 106% with its shadow', () => {
      const rival = createSlot(false);

      const handled = perspective.hover(rival);

      expect(handled).toBe(true);
      expect(liftOf(rival).lift).toHaveBeenCalledTimes(1);
      expect(liftOf(rival).size).toEqual({ scale: Constants.TARGET_LIFT_SCALE, shadowOffset: Constants.TARGET_SHADOW_OFFSET });
    });

    it('frames a rival card that can be attacked as valid', () => {
      const rival = createSlot(false);

      perspective.hover(rival);

      expect(liftOf(rival).frame).toHaveBeenCalledWith(true);
    });

    it('frames a rival card that cannot be attacked as not valid', () => {
      const rival = createSlot(false);
      sourceSlot.canAttack = () => false;

      perspective.hover(rival);

      expect(liftOf(rival).frame).toHaveBeenCalledWith(false);
    });

    it('leaves the hover of an own card to its enlargement', () => {
      expect(perspective.hover(createSlot(true))).toBe(false);
    });

    it('takes the hover of the attacker, which is not enlarged', () => {
      expect(perspective.hover(sourceSlot)).toBe(true);
    });
  });

  describe('unhover', () => {
    it('lowers the rival card the pointer leaves', () => {
      const rival = createSlot(false);
      perspective.hover(rival);

      const handled = perspective.unhover(rival);

      expect(handled).toBe(true);
      expect(liftOf(rival).lower).toHaveBeenCalledTimes(1);
    });

    it('leaves the unhover of an own card to its enlargement', () => {
      expect(perspective.unhover(createSlot(true))).toBe(false);
    });

    it('does not lower the attacker', () => {
      perspective.enter();

      perspective.unhover(sourceSlot);

      expect(liftOf(sourceSlot).lower).not.toHaveBeenCalled();
    });
  });

  // VIEW-5
  describe('drop', () => {
    it('drops the shadow of the attacker and keeps it lifted', () => {
      perspective.enter();

      perspective.drop();

      expect(liftOf(sourceSlot).dropShadow).toHaveBeenCalledTimes(1);
      expect(liftOf(sourceSlot).lower).not.toHaveBeenCalled();
    });

    it('puts the target back at its rest size at once', () => {
      const rival = createSlot(false);
      perspective.hover(rival);

      perspective.drop();

      expect(liftOf(rival).drop).toHaveBeenCalledTimes(1);
    });
  });

  describe('commit', () => {
    it('stops listening to the clicks outside the cards and to Escape', () => {
      perspective.enter();

      perspective.commit(createSlot(false));

      expect(input.off).toHaveBeenCalledWith('pointerdown', expect.any(Function));
      expect(input.keyboard.off).toHaveBeenCalledWith('keydown-ESC', expect.any(Function));
    });

    it('keeps the target lifted when the pointer leaves it', () => {
      const rival = createSlot(false);
      perspective.hover(rival);
      perspective.commit(rival);

      const handled = perspective.unhover(rival);

      expect(handled).toBe(true);
      expect(liftOf(rival).lower).not.toHaveBeenCalled();
    });

    it('lifts the target if the pointer was not over it', () => {
      const rival = createSlot(false);

      perspective.commit(rival);

      expect(liftOf(rival).lift).toHaveBeenCalledTimes(1);
    });

    it('is committed afterwards', () => {
      perspective.commit(createSlot(false));

      expect(perspective.isCommitted()).toBe(true);
    });

    it('lowers the attacker and the target on exit', () => {
      const rival = createSlot(false);
      perspective.enter();
      perspective.hover(rival);
      perspective.commit(rival);

      perspective.exit();

      expect(liftOf(sourceSlot).lower).toHaveBeenCalledTimes(1);
      expect(liftOf(rival).lower).toHaveBeenCalledTimes(1);
    });

    it('does not take the hover of another card', () => {
      perspective.commit(createSlot(false));

      expect(perspective.hover(createSlot(false))).toBe(false);
    });
  });
});
