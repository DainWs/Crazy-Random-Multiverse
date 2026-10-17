import { beforeEach, describe, expect, it, vi } from 'vitest';
import InteractiveObjectManager, {
  getGameObjectsAtCursor,
  getTopGameObjectAtCursor,
  InteractiveGameObject
} from '@/core/interactions/InteractiveObjectManager';
import CardInputManager from '@/core/interactions/CardInputManager';
import CardView from '@/game/cards/CardView';
import HandView from '@/game/hand/HandView';
import ZoneSlotView from '@/game/zone/ZoneSlotView';

vi.mock('@/core/interactions/CardInputManager', () => ({
  default: {
    handleCardInputs: vi.fn(),
    removeHandledCard: vi.fn(),
  }
}));

describe('InteractiveObjectManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockCardView = (depth = 0) => {
    const card = Object.create(CardView.prototype);
    card.depth = depth;
    return card as CardView & { depth: number };
  };

  const createMockHandView = (depth = 0) => {
    const hand = Object.create(HandView.prototype);
    hand.depth = depth;
    return hand as HandView & { depth: number };
  };

  const createMockZoneSlotView = (depth = 0) => {
    const slot = Object.create(ZoneSlotView.prototype);
    slot.depth = depth;
    return slot as ZoneSlotView & { depth: number };
  };

  const createMockSceneWithHitTest = (hitTestResults: InteractiveGameObject[]) => {
    const camera = { id: 'main-cam' };
    return {
      cameras: {
        cameras: [camera]
      },
      input: {
        activePointer: { x: 100, y: 100 },
        manager: {
          hitTest: vi.fn((_pointer, candidates: InteractiveGameObject[], _cam, output: InteractiveGameObject[]) => {
            // Only output objects that are in both candidates and hitTestResults
            for (const item of hitTestResults) {
              if (candidates.includes(item)) {
                output.push(item);
              }
            }
          })
        }
      }
    } as unknown as Phaser.Scene;
  };

  describe('registerGameObject and unregisterGameObject', () => {
    it('calls CardInputManager.handleCardInputs when registering a CardView', () => {
      const scene = {} as Phaser.Scene;
      const card = createMockCardView();

      InteractiveObjectManager.registerGameObject(scene, card);
      expect(CardInputManager.handleCardInputs).toHaveBeenCalledWith(scene, card);

      InteractiveObjectManager.unregisterGameObject(scene, card);
      expect(CardInputManager.removeHandledCard).toHaveBeenCalledWith(scene, card);
    });

    it('does not call CardInputManager for non-card game objects', () => {
      const scene = {} as Phaser.Scene;
      const hand = createMockHandView();
      const zoneSlot = createMockZoneSlotView();

      InteractiveObjectManager.registerGameObject(scene, hand);
      InteractiveObjectManager.registerGameObject(scene, zoneSlot);

      expect(CardInputManager.handleCardInputs).not.toHaveBeenCalled();

      InteractiveObjectManager.unregisterGameObject(scene, hand);
      InteractiveObjectManager.unregisterGameObject(scene, zoneSlot);
      expect(CardInputManager.removeHandledCard).not.toHaveBeenCalled();
    });
  });

  describe('getGameObjectsAtCursor and getTopGameObjectAtCursor', () => {
    it('filters registered objects by requested type and hit-test', () => {
      const dummyScene = {} as Phaser.Scene;
      const card = createMockCardView(10);
      const slot = createMockZoneSlotView(5);
      const hand = createMockHandView(20);

      InteractiveObjectManager.registerGameObject(dummyScene, card);
      InteractiveObjectManager.registerGameObject(dummyScene, slot);
      InteractiveObjectManager.registerGameObject(dummyScene, hand);

      const scene = createMockSceneWithHitTest([card, slot, hand]);

      // Only asking for ZoneSlotView
      const slotResults = getGameObjectsAtCursor(scene, 'ZoneSlotView');
      expect(slotResults).toContain(slot);
      expect(slotResults).not.toContain(card);
      expect(slotResults).not.toContain(hand);

      // Asking for multiple types
      const multipleResults = getGameObjectsAtCursor(scene, 'CardView', 'HandView');
      expect(multipleResults).toContain(card);
      expect(multipleResults).toContain(hand);
      expect(multipleResults).not.toContain(slot);

      // Clean up registered objects
      InteractiveObjectManager.unregisterGameObject(dummyScene, card);
      InteractiveObjectManager.unregisterGameObject(dummyScene, slot);
      InteractiveObjectManager.unregisterGameObject(dummyScene, hand);
    });

    it('returns the object with highest depth using getTopGameObjectAtCursor', () => {
      const dummyScene = {} as Phaser.Scene;
      const lowSlot = createMockZoneSlotView(1);
      const highSlot = createMockZoneSlotView(99);

      InteractiveObjectManager.registerGameObject(dummyScene, lowSlot);
      InteractiveObjectManager.registerGameObject(dummyScene, highSlot);

      const scene = createMockSceneWithHitTest([lowSlot, highSlot]);

      const topObject = getTopGameObjectAtCursor(scene, 'ZoneSlotView');
      expect(topObject).toBe(highSlot);

      InteractiveObjectManager.unregisterGameObject(dummyScene, lowSlot);
      InteractiveObjectManager.unregisterGameObject(dummyScene, highSlot);
    });

    it('returns undefined if no objects are hit at cursor', () => {
      const scene = createMockSceneWithHitTest([]);
      const topObject = getTopGameObjectAtCursor(scene, 'ZoneSlotView');
      expect(topObject).toBeUndefined();
    });
  });
});
