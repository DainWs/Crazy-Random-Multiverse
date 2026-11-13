import { describe, expect, it } from 'vitest';
import { buildDisplacementMap, calculateCardPlacement } from '@/game/cards/CardWarp';
import type { Corners3D } from '@/domain/Geometry';
import { WARP_DISPLACEMENT_AMOUNT } from '@/core/Constants';

const CARD = { width: 200, height: 300 };

const cornersOf = (tl: [number, number], tr: [number, number], br: [number, number], bl: [number, number]): Corners3D => ({
  tl: { x: tl[0], y: tl[1], z: 0, scale: 1 },
  tr: { x: tr[0], y: tr[1], z: 0, scale: 1 },
  br: { x: br[0], y: br[1], z: 0, scale: 1 },
  bl: { x: bl[0], y: bl[1], z: 0, scale: 1 }
});

/** What the filter moves a pixel of the map by, in pixels of the map. */
const decode = (value: number, size: number) => (value / 255 - 0.5) * WARP_DISPLACEMENT_AMOUNT * size;

describe('CardWarp', () => {
  // VIEW-1
  describe('calculateCardPlacement', () => {
    it('fills a slot that is a rectangle', () => {
      const corners = cornersOf([-50, -75], [50, -75], [50, 75], [-50, 75]);

      const { center, scale, quad } = calculateCardPlacement(corners, 0, CARD);

      expect([center, scale]).toEqual([{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }]);
      expect(quad).toEqual([{ x: -100, y: -150 }, { x: 100, y: -150 }, { x: 100, y: 150 }, { x: -100, y: 150 }]);
    });

    it('is as wide as the widest edge of a trapezoid, so the quad stays inside the card', () => {
      const corners = cornersOf([-40, -75], [40, -75], [60, 75], [-60, 75]);

      const { scale, quad } = calculateCardPlacement(corners, 0, CARD);

      expect(scale.x).toBeCloseTo(0.6, 6);
      expect(quad[0].x).toBeCloseTo(-200 / 3, 6);
      expect(quad[3].x).toBeCloseTo(-100, 6);
    });

    it('describes the quad in the space of the card when the slot is turned with its zone', () => {
      const turned = cornersOf([75, -50], [75, 50], [-75, 50], [-75, -50]);

      const { scale, quad } = calculateCardPlacement(turned, 90, CARD);

      expect(scale.x).toBeCloseTo(0.5, 6);
      expect(quad[0].x).toBeCloseTo(-100, 6);
      expect(quad[0].y).toBeCloseTo(-150, 6);
    });

    it('puts the card at the middle of the four corners', () => {
      const corners = cornersOf([20, 0], [180, 0], [220, 300], [-20, 300]);

      expect(calculateCardPlacement(corners, 0, CARD).center).toEqual({ x: 100, y: 150 });
    });
  });

  // VIEW-1
  describe('buildDisplacementMap', () => {
    const padding = 10;
    const rectangle = calculateCardPlacement(cornersOf([-50, -75], [50, -75], [50, 75], [-50, 75]), 0, CARD).quad;
    const trapezoid = calculateCardPlacement(cornersOf([-40, -75], [40, -75], [60, 75], [-60, 75]), 0, CARD).quad;

    const pixelAt = (map: ReturnType<typeof buildDisplacementMap>, x: number, y: number) => {
      const index = (Math.round(y) * map.width + Math.round(x)) * 4;
      return { red: map.data[index], green: map.data[index + 1], alpha: map.data[index + 3] };
    };

    it('is as big as the card plus its padding on every side', () => {
      const map = buildDisplacementMap(rectangle, CARD, padding);

      expect([map.width, map.height, map.data.length]).toEqual([220, 320, 220 * 320 * 4]);
    });

    it('moves nothing for a card that fills its rectangle', () => {
      const map = buildDisplacementMap(rectangle, CARD, padding);

      const { red, green } = pixelAt(map, map.width / 2, map.height / 2);

      expect([Math.abs(decode(red, map.width)), Math.abs(decode(green, map.height))].every((moved) => moved < 1)).toBe(true);
    });

    it('takes the pixel at the top left corner of the quad from the top left corner of the card', () => {
      const map = buildDisplacementMap(trapezoid, CARD, padding);
      const [topLeft] = trapezoid;
      const x = map.width / 2 + topLeft.x;
      const y = map.height / 2 + topLeft.y;

      const { red, green } = pixelAt(map, x, y);

      expect(decode(red, map.width)).toBeCloseTo(padding - x, 0);
      expect(-decode(green, map.height)).toBeCloseTo(padding - y, 0);
    });

    it('is opaque, because the filter reads only its red and green channels', () => {
      const map = buildDisplacementMap(trapezoid, CARD, padding);

      expect(pixelAt(map, 0, 0).alpha).toBe(255);
    });
  });
});
