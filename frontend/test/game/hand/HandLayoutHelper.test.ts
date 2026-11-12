import { beforeEach, describe, expect, it } from 'vitest';
import type CameraSystem from '@/core/CameraSystem';
import { CARD_WIDTH } from '@/game/cards/CardDimensions';
import HandLayoutCalculator, { HAND_CARD_SCALE } from '@/game/hand/HandLayoutCalculator';
import HandLayoutHelper from '@/game/hand/HandLayoutHelper';

const SCREEN = { width: 1600, height: 900 };

describe('HandLayoutHelper', () => {
  let helper: HandLayoutHelper;

  beforeEach(() => {
    const cameraSystem = {
      getCamera: () => ({ zoom: 0.5 }),
      getScale: () => SCREEN,
      getHUDPosition: (screenX: number, screenY: number) => ({ x: screenX, y: screenY })
    } as unknown as CameraSystem;
    helper = new HandLayoutHelper(cameraSystem);
  });

  describe('updateBounds', () => {
    // VIEW-25
    it.each([{ cardCount: 0 }, { cardCount: 1 }, { cardCount: 4 }, { cardCount: 12 }])(
      'centers the hand horizontally for $cardCount cards',
      ({ cardCount }) => {
        helper.updateBounds(cardCount);

        expect(helper.handBounds.x).toBe(SCREEN.width / 2);
      }
    );

    // VIEW-25
    it('sizes the hand by the cards it holds', () => {
      helper.updateBounds(3);

      expect(helper.handBounds.width).toBe(new HandLayoutCalculator().calculateTotalWidth(3, CARD_WIDTH));
    });

    it('compensates the zoom of the camera', () => {
      helper.updateBounds(1);

      expect(helper.handBounds.scale).toBe(HAND_CARD_SCALE / 0.5);
    });
  });

  describe('calculateSlotPositionFromIndex', () => {
    // VIEW-25
    it('places a single card at the center of the hand', () => {
      expect(helper.calculateSlotPositionFromIndex(0, 1)).toEqual({ x: 0, y: 0 });
    });

    // VIEW-25
    it('places the first and last cards symmetrically', () => {
      const first = helper.calculateSlotPositionFromIndex(0, 4);
      const last = helper.calculateSlotPositionFromIndex(3, 4);

      expect(first.x).toBeCloseTo(-last.x, 5);
    });
  });
});
