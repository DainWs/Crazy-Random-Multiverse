import { beforeEach, describe, expect, it, vi } from 'vitest';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import * as Constants from '@/core/Constants';
import type CardView from '@/game/cards/CardView';

const mockEnter = vi.fn();
vi.mock('@/game/perspectives/CardActionPerspective', () => {
  return {
    default: class MockCardActionPerspective {
      enter() {
        mockEnter();
      }
    }
  };
});

describe('CardClickHandler', () => {
  beforeEach(() => {
    mockEnter.mockClear();
  });

  const createMockCard = (canBeClicked = true): CardView => {
    return {
      canBeClicked: vi.fn(() => canBeClicked)
    } as unknown as CardView;
  };

  const createMockPointer = (duration: number, distance: number): Phaser.Input.Pointer => {
    return {
      getDuration: vi.fn(() => duration),
      getDistance: vi.fn(() => distance)
    } as unknown as Phaser.Input.Pointer;
  };

  const createMockScene = (): Phaser.Scene => {
    return {
      children: {
        list: []
      }
    } as unknown as Phaser.Scene;
  };

  describe('onPointerDown', () => {
    it('is a no-op so Phaser can distinguish click vs drag', () => {
      const scene = createMockScene();
      const card = createMockCard();
      const pointer = createMockPointer(0, 0);

      expect(() => CardClickHandler.onPointerDown(scene, card, pointer)).not.toThrow();
      expect(mockEnter).not.toHaveBeenCalled();
    });
  });

  describe('onPointerUp', () => {
    it('does nothing when card cannot be clicked', () => {
      const scene = createMockScene();
      const card = createMockCard(false);
      const pointer = createMockPointer(
        Constants.DRAG_TIME_THRESHOLD - 10,
        Constants.DRAG_DISTANCE_THRESHOLD - 2
      );

      CardClickHandler.onPointerUp(scene, card, pointer);
      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('triggers action perspective when click duration and distance are within drag thresholds', () => {
      const scene = createMockScene();
      const card = createMockCard(true);
      const pointer = createMockPointer(50, 5); // Below 100ms and 10px

      CardClickHandler.onPointerUp(scene, card, pointer);
      expect(mockEnter).toHaveBeenCalledTimes(1);
    });

    it('does not trigger if pointer duration reaches or exceeds threshold (held too long)', () => {
      const scene = createMockScene();
      const card = createMockCard(true);
      const pointer = createMockPointer(Constants.DRAG_TIME_THRESHOLD, 5);

      CardClickHandler.onPointerUp(scene, card, pointer);
      expect(mockEnter).not.toHaveBeenCalled();
    });

    it('does not trigger if pointer distance reaches or exceeds threshold (dragged too far)', () => {
      const scene = createMockScene();
      const card = createMockCard(true);
      const pointer = createMockPointer(50, Constants.DRAG_DISTANCE_THRESHOLD);

      CardClickHandler.onPointerUp(scene, card, pointer);
      expect(mockEnter).not.toHaveBeenCalled();
    });
  });
});
