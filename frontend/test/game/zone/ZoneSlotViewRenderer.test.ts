import { afterEach, describe, expect, it } from 'vitest';
import type { Corners3D } from '@/domain/Geometry';
import ZoneSlotViewRenderer from '@/game/zone/ZoneSlotViewRenderer';

const CORNERS = { tl: { x: 0, y: 0 }, tr: { x: 10, y: 0 }, br: { x: 10, y: 10 }, bl: { x: 0, y: 10 } } as Corners3D;
const COLOR = 0x00e5ff;

/** A graphics that only keeps the line styles it was given. */
function fakeGraphics() {
  const lines: Array<[number, number]> = [];
  const graphics = {
    lines,
    clear: () => graphics,
    lineStyle: (width: number, color: number) => lines.push([width, color]),
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    closePath: () => undefined,
    strokePath: () => undefined
  };

  return graphics;
}

// VIEW-40, UI-31
describe('ZoneSlotViewRenderer', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  describe('renderMarker', () => {
    it('draws only the colored line in the base game', () => {
      const graphics = fakeGraphics();

      ZoneSlotViewRenderer.renderMarker(graphics as never, CORNERS, COLOR);

      expect(graphics.lines.map(([, color]) => color)).toEqual([COLOR]);
    });

    it('draws a near black edge under the colored line in the accessible mode', () => {
      window.history.replaceState(null, '', '/?accessible=1');
      const graphics = fakeGraphics();

      ZoneSlotViewRenderer.renderMarker(graphics as never, CORNERS, COLOR);

      expect(graphics.lines.map(([, color]) => color)).toEqual([0x000000, COLOR]);
    });

    it('makes the edge wider than the colored line', () => {
      window.history.replaceState(null, '', '/?accessible=1');
      const graphics = fakeGraphics();

      ZoneSlotViewRenderer.renderMarker(graphics as never, CORNERS, COLOR);

      expect(graphics.lines[0][0]).toBeGreaterThan(graphics.lines[1][0]);
    });
  });

  // VIEW-4
  describe('renderForbiddenIcon', () => {
    it('draws the red ring and bar of the crossed circle', () => {
      const graphics = { ...fakeGraphics(), fillStyle: () => undefined, fillCircle: () => undefined, strokeCircle: () => undefined };

      ZoneSlotViewRenderer.renderForbiddenIcon(graphics as never, 16);

      expect(graphics.lines.map(([, color]) => color)).toEqual([0xe74c3c]);
    });
  });
});
