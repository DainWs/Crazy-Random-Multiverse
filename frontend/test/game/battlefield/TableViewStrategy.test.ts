import { beforeEach, describe, expect, it } from 'vitest';
import type Battlefield from '@/domain/Battlefield';
import { DEFAULT_SKIN } from '@/domain/BattlefieldSkin';
import ProjectionSystem from '@/core/ProjectionSystem';
import TableViewStrategy, { GRID_LINE_WIDTH } from '@/game/battlefield/TableViewStrategy';

type GraphicsCall = { method: string; args: unknown[] };

const GRID_STEP = DEFAULT_SKIN.gridStep;
const TABLE_WIDTH = GRID_STEP * 2;
const TABLE_HEIGHT = GRID_STEP;

function createRecordingGraphics() {
  const calls: GraphicsCall[] = [];
  const graphics = new Proxy({} as Record<string, unknown>, {
    get:
      (_target, method: string) =>
      (...args: unknown[]) => {
        calls.push({ method, args });
      }
  });

  return { graphics: graphics as unknown as Phaser.GameObjects.Graphics, calls };
}

/** The calls from the line style of the grid up to the stroke that draws it. */
function callsOfGrid(calls: GraphicsCall[]): GraphicsCall[] {
  const start = calls.findIndex((call) => call.method === 'lineStyle' && call.args[1] === DEFAULT_SKIN.gridColor);
  const end = calls.findIndex((call, index) => index > start && call.method === 'strokePath');
  return calls.slice(start, end + 1);
}

describe('TableViewStrategy', () => {
  let battlefield: Battlefield;
  let strategy: TableViewStrategy;

  beforeEach(() => {
    battlefield = {
      skin: DEFAULT_SKIN,
      getCorners: () => ProjectionSystem.createCorners2D(TABLE_WIDTH, TABLE_HEIGHT)
    } as unknown as Battlefield;
    strategy = new TableViewStrategy();
  });

  describe('render', () => {
    // VIEW-26
    it('draws the grid with a thin translucent line', () => {
      const { graphics, calls } = createRecordingGraphics();

      strategy.render(graphics, battlefield);

      expect(callsOfGrid(calls)[0].args).toEqual([GRID_LINE_WIDTH, DEFAULT_SKIN.gridColor, DEFAULT_SKIN.gridAlpha]);
    });

    // VIEW-26
    it('starts a new path before the lines of the grid', () => {
      const { graphics, calls } = createRecordingGraphics();

      strategy.render(graphics, battlefield);

      expect(callsOfGrid(calls)[1].method).toBe('beginPath');
    });

    // VIEW-26
    it('does not stroke the grid again with the table outline', () => {
      const { graphics, calls } = createRecordingGraphics();

      strategy.render(graphics, battlefield);

      const gridCalls = callsOfGrid(calls);
      const lastGridCall = gridCalls[gridCalls.length - 1];
      const methodsAfterGrid = calls.slice(calls.indexOf(lastGridCall) + 1).map((call) => call.method);
      expect(methodsAfterGrid.indexOf('beginPath')).toBeLessThan(methodsAfterGrid.indexOf('strokePath'));
    });

    it('draws a line at each step of the table in both directions', () => {
      const { graphics, calls } = createRecordingGraphics();

      strategy.render(graphics, battlefield);

      const verticalLines = 3;
      const horizontalLines = 2;
      expect(callsOfGrid(calls).filter((call) => call.method === 'moveTo')).toHaveLength(verticalLines + horizontalLines);
    });
  });
});
