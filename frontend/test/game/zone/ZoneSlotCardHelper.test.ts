import { describe, expect, it } from 'vitest';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import zoneSlotCardHelper, { calculateCardCenter, calculateCardTargetScale } from '@/game/zone/ZoneSlotCardHelper';
import { Corners3D } from '@/domain/Geometry';

describe('ZoneSlotCardHelper', () => {
  describe('calculateCardTargetScale', () => {
    it('returns scale (1, 1) when slot dimensions match card dimensions', () => {
      const corners: Corners3D = {
        tl: { x: 0, y: 0, z: 0, scale: 1 },
        tr: { x: 200, y: 0, z: 0, scale: 1 },
        bl: { x: 0, y: 300, z: 0, scale: 1 },
        br: { x: 200, y: 300, z: 0, scale: 1 },
      };

      const scale = calculateCardTargetScale(corners, 200, 300);
      expect(scale.x).toBeCloseTo(1, 4);
      expect(scale.y).toBeCloseTo(1, 4);
    });

    it('returns scale (0.5, 0.5) when slot is half size of card', () => {
      const corners: Corners3D = {
        tl: { x: 0, y: 0, z: 0, scale: 1 },
        tr: { x: 100, y: 0, z: 0, scale: 1 },
        bl: { x: 0, y: 150, z: 0, scale: 1 },
        br: { x: 100, y: 150, z: 0, scale: 1 },
      };

      const scale = calculateCardTargetScale(corners, 200, 300);
      expect(scale.x).toBeCloseTo(0.5, 4);
      expect(scale.y).toBeCloseTo(0.5, 4);
    });

    it('handles trapezoid perspective by averaging opposite sides', () => {
      // top width = 160, bottom width = 240 -> average width = 200
      // side edges slant by dx = 40 over dy = 300 -> length = Math.hypot(40, 300)
      const expectedHeight = Math.hypot(40, 300);
      const corners: Corners3D = {
        tl: { x: 20, y: 0, z: 0, scale: 1 },
        tr: { x: 180, y: 0, z: 0, scale: 1 },
        bl: { x: -20, y: 300, z: 0, scale: 1 },
        br: { x: 220, y: 300, z: 0, scale: 1 },
      };

      const scale = calculateCardTargetScale(corners, 200, 300);
      expect(scale.x).toBeCloseTo(1.0, 4);
      expect(scale.y).toBeCloseTo(expectedHeight / 300, 4);
    });

    it('averages differing opposite vertical side lengths', () => {
      // top edge is horizontal: width = 200
      // left height = 280, right height = 320 -> average height = (280 + 320) / 2 = 300
      // bottom edge slants by dy = 40 over dx = 200 -> length = Math.hypot(200, 40)
      const expectedWidth = (200 + Math.hypot(200, 40)) / 2;
      const corners: Corners3D = {
        tl: { x: 0, y: 0, z: 0, scale: 1 },
        tr: { x: 200, y: 0, z: 0, scale: 1 },
        bl: { x: 0, y: 280, z: 0, scale: 1 },
        br: { x: 200, y: 320, z: 0, scale: 1 },
      };

      const scale = calculateCardTargetScale(corners, 200, 300);
      expect(scale.x).toBeCloseTo(expectedWidth / 200, 4);
      expect(scale.y).toBeCloseTo(1.0, 4);
    });
  });

  describe('calculateCardCenter', () => {
    it('returns the middle of a trapezoid', () => {
      const corners: Corners3D = {
        tl: { x: 20, y: 0, z: 0, scale: 1 },
        tr: { x: 180, y: 0, z: 0, scale: 1 },
        bl: { x: -20, y: 300, z: 0, scale: 1 },
        br: { x: 220, y: 300, z: 0, scale: 1 },
      };

      expect(calculateCardCenter(corners)).toEqual({ x: 100, y: 150 });
    });
  });

  describe('applyCardTransformations', () => {
    const corners: Corners3D = {
      tl: { x: -50, y: -75, z: 0, scale: 1 },
      tr: { x: 50, y: -75, z: 0, scale: 1 },
      bl: { x: -50, y: 75, z: 0, scale: 1 },
      br: { x: 50, y: 75, z: 0, scale: 1 },
    };

    const createCard = () => {
      const card = {
        angle: 0,
        setOriginalPosition: () => {},
        setOriginalScale: () => {},
        setOriginalDepth: () => {},
        reset: () => {},
        applyWarp: () => {},
        setAngle(angle: number) {
          card.angle = angle;
        }
      };
      return card;
    };

    // VIEW-1
    it.each([{ slotRotation: 0 }, { slotRotation: 90 }, { slotRotation: -90 }, { slotRotation: 180 }])(
      'turns the card with its slot at $slotRotation degrees',
      ({ slotRotation }) => {
        const slot = { corners, depth: 1, slotRotation } as unknown as ZoneSlotView;
        const card = createCard();

        zoneSlotCardHelper.applyCardTransformations(slot, card as unknown as CombatantView);

        expect(card.angle).toBe(slotRotation);
      }
    );
  });
});
