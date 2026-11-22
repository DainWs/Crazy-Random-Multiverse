import { afterEach, describe, expect, it } from 'vitest';
import { LEGEND_MARKS, sampleFrame, sampleShapes, svgPoints } from '@/game/hud/HelpLegendLayout';

function openPageWith(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

function kindsOf(mark: Parameters<typeof sampleShapes>[0]) {
  return sampleShapes(mark).map((shape) => shape.kind);
}

/** The slot of the board is 200 units wide, and the one of a sample 60 px. */
const PIXELS_PER_UNIT = 60 / 200;

// VIEW-58
describe('HelpLegendLayout', () => {
  afterEach(() => {
    openPageWith('');
  });

  it('lists the marks in the order of the legend', () => {
    expect(LEGEND_MARKS).toEqual([
      'OWN_ZONE',
      'READY',
      'TURN',
      'VALID_SLOT',
      'SOURCE',
      'VALID_TARGET',
      'INVALID_TARGET',
      'ELIMINATED'
    ]);
  });

  describe('sampleFrame', () => {
    it('draws the slot 60 px wide', () => {
      const { viewBox, width } = sampleFrame();
      const boxWidth = Number(viewBox.split(' ')[2]);

      expect((width * 200) / boxWidth).toBeCloseTo(60);
    });

    it('leaves room above the slot for the crown', () => {
      const [, top] = sampleFrame().viewBox.split(' ').map(Number);

      expect(top * PIXELS_PER_UNIT).toBeLessThanOrEqual(-11);
    });
  });

  describe('sampleShapes in the base game', () => {
    it('draws the own zone without its lines', () => {
      expect(kindsOf('OWN_ZONE')).toEqual(['POLYGON']);
    });

    it('draws a card that can attack with a whole cyan frame', () => {
      const [, frame] = sampleShapes('READY');

      expect(frame).toEqual(expect.objectContaining({ kind: 'POLYGON', stroke: '#00e5ff' }));
    });

    it('draws the frames 2 px wide', () => {
      const [, frame] = sampleShapes('VALID_TARGET');

      expect(frame.kind === 'POLYGON' && frame.strokeWidth * PIXELS_PER_UNIT).toBeCloseTo(2);
    });

    it('draws the crossed circle 20 px wide', () => {
      const [, , disc] = sampleShapes('INVALID_TARGET');

      expect(disc.kind === 'CIRCLE' && (disc.radius + disc.strokeWidth / 2) * 2 * PIXELS_PER_UNIT).toBeCloseTo(20);
    });

    it('draws the turn without the crown', () => {
      expect(kindsOf('TURN')).toEqual(['POLYGON', 'POLYGON']);
    });

    it('fills a valid slot at 45%', () => {
      const [fill] = sampleShapes('VALID_SLOT');

      expect(fill).toEqual(expect.objectContaining({ fill: '#aaffaa', fillOpacity: 0.45 }));
    });

    it('draws the source slot with a solid frame', () => {
      expect(kindsOf('SOURCE')).toEqual(['POLYGON', 'POLYGON']);
    });

    it('draws the crossed circle on a target that cannot be attacked', () => {
      expect(kindsOf('INVALID_TARGET')).toEqual(['POLYGON', 'POLYGON', 'CIRCLE', 'LINES']);
    });

    it('draws the veil of an eliminated zone over the slot', () => {
      const [, veil] = sampleShapes('ELIMINATED');

      expect(veil).toEqual(expect.objectContaining({ fill: '#3b0a0a', fillOpacity: 0.8 }));
    });
  });

  describe('sampleShapes with the extra signals', () => {
    it('draws the nine lines of the own zone', () => {
      openPageWith('?extraMarks=1');

      const [, lines] = sampleShapes('OWN_ZONE');

      expect(lines.kind === 'LINES' && lines.paths).toHaveLength(9);
    });

    it('draws the four L\'s of a card that can attack', () => {
      openPageWith('?extraMarks=1');

      const [, corners] = sampleShapes('READY');

      expect(corners.kind === 'LINES' && corners.paths).toHaveLength(4);
    });

    it('draws the crown of the turn on its disc', () => {
      openPageWith('?extraMarks=1');

      expect(kindsOf('TURN')).toEqual(['POLYGON', 'POLYGON', 'CIRCLE', 'POLYGON']);
    });

    it('fills a valid slot with solid green', () => {
      openPageWith('?extraMarks=1');

      const [fill] = sampleShapes('VALID_SLOT');

      expect(fill).toEqual(expect.objectContaining({ fill: '#2ecc71', fillOpacity: 1 }));
    });

    it('draws the 24 dashes of the source slot', () => {
      openPageWith('?extraMarks=1');

      const [, dashes] = sampleShapes('SOURCE');

      expect(dashes.kind === 'LINES' && dashes.paths).toHaveLength(24);
    });
  });

  describe('sampleShapes in the accessible mode', () => {
    it('draws the near black edge under a frame', () => {
      openPageWith('?accessible=1');

      const [, edge, frame] = sampleShapes('VALID_TARGET');

      const widths = [edge, frame].map((shape) => (shape.kind === 'POLYGON' ? shape.strokeWidth * PIXELS_PER_UNIT : 0));

      expect(widths.map((width) => Math.round(width))).toEqual([4, 2]);
    });

    it('tints the own zone with the accessible blue', () => {
      openPageWith('?accessible=1');

      const [tint] = sampleShapes('OWN_ZONE');

      expect(tint).toEqual(expect.objectContaining({ fill: '#1a4f95', stroke: '#061a3a' }));
    });
  });

  describe('svgPoints', () => {
    it('joins the points as x,y pairs', () => {
      expect(svgPoints([{ x: 0, y: 0 }, { x: 200, y: 300 }])).toBe('0,0 200,300');
    });
  });
});
