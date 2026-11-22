import type { Corners3D, Point2D } from '@/domain/Geometry';
import type { PaletteColor } from '@/game/utils/Palette';
import type { MarkPath } from '@/game/zone/SlotMarkLayout';
import {
  CROWN_RING_FRACTION,
  ELIMINATED_VEIL_ALPHA,
  EXTRA_MARK_FRAME_WIDTH,
  FORBIDDEN_ICON_RING_FRACTION,
  HELP_SAMPLE_CROWN_DIAMETER,
  HELP_SAMPLE_EDGE_WIDTH,
  HELP_SAMPLE_FORBIDDEN_ICON_DIAMETER,
  HELP_SAMPLE_FRAME_WIDTH,
  HELP_SAMPLE_WIDTH,
  OWN_ZONE_LINE_WIDTH,
  SLOT_BORDER_ALPHA,
  SLOT_FILL_ALPHA,
  SLOT_SOLID_FILL_ALPHA
} from '@/core/Constants';
import EffectSettings from '@/core/EffectSettings';
import { CARD_HEIGHT, CARD_WIDTH } from '@/game/cards/CardDimensions';
import { paletteText } from '@/game/utils/Palette';
import { crownPath, ownZoneLines, readyCorners, sourceDashes } from '@/game/zone/SlotMarkLayout';

/** The marks of the board the legend explains, in the order of its rows (VIEW-58). */
type LegendMark = 'OWN_ZONE' | 'READY' | 'TURN' | 'VALID_SLOT' | 'SOURCE' | 'VALID_TARGET' | 'INVALID_TARGET' | 'ELIMINATED';

const LEGEND_MARKS: readonly LegendMark[] = [
  'OWN_ZONE',
  'READY',
  'TURN',
  'VALID_SLOT',
  'SOURCE',
  'VALID_TARGET',
  'INVALID_TARGET',
  'ELIMINATED'
];

/** A piece of a sample, in the units of a slot of the board, drawn in order over the previous ones. */
type SampleShape =
  | { kind: 'POLYGON'; points: Point2D[]; fill: string; fillOpacity: number; stroke: string; strokeOpacity: number; strokeWidth: number }
  | { kind: 'LINES'; paths: MarkPath[]; stroke: string; strokeWidth: number }
  | { kind: 'CIRCLE'; center: Point2D; radius: number; fill: string; stroke: string; strokeWidth: number };

/** Where the sample is drawn: the box of the slot and the room the crown needs above it, and its size on the screen in px. */
type SampleFrame = { viewBox: string; width: number; height: number };

const NO_PAINT = 'none';

const SLOT_CORNERS: Corners3D = {
  tl: { x: 0, y: 0, z: 0, scale: 1 },
  tr: { x: CARD_WIDTH, y: 0, z: 0, scale: 1 },
  bl: { x: 0, y: CARD_HEIGHT, z: 0, scale: 1 },
  br: { x: CARD_WIDTH, y: CARD_HEIGHT, z: 0, scale: 1 }
};

const SLOT_OUTLINE: Point2D[] = [SLOT_CORNERS.tl, SLOT_CORNERS.tr, SLOT_CORNERS.br, SLOT_CORNERS.bl];

/** The sample is the slot of the board scaled down: its lines and icons are given in px and turned into units of the slot. */
const PIXELS_PER_UNIT = HELP_SAMPLE_WIDTH / CARD_WIDTH;
const FRAME_WIDTH = HELP_SAMPLE_FRAME_WIDTH / PIXELS_PER_UNIT;
const EDGE_WIDTH = HELP_SAMPLE_EDGE_WIDTH / PIXELS_PER_UNIT;
const CROWN_RADIUS = HELP_SAMPLE_CROWN_DIAMETER / 2 / PIXELS_PER_UNIT;
const FORBIDDEN_ICON_RADIUS = HELP_SAMPLE_FORBIDDEN_ICON_DIAMETER / 2 / PIXELS_PER_UNIT;

/** The crown sits on the top edge and reaches out of the slot the most, so it sets the room on every side. */
const SAMPLE_MARGIN = CROWN_RADIUS * (1 + CROWN_RING_FRACTION / 2);

/** The box of the sample and its size, so the slot inside it is `HELP_SAMPLE_WIDTH` px wide (VIEW-58). */
function sampleFrame(): SampleFrame {
  const boxWidth = CARD_WIDTH + 2 * SAMPLE_MARGIN;
  const boxHeight = CARD_HEIGHT + 2 * SAMPLE_MARGIN;

  return {
    viewBox: `${-SAMPLE_MARGIN} ${-SAMPLE_MARGIN} ${boxWidth} ${boxHeight}`,
    width: boxWidth * PIXELS_PER_UNIT,
    height: boxHeight * PIXELS_PER_UNIT
  };
}

/** The sample of a mark, as the board draws it now: with the colors of the mode and the second signal only while it is on (VIEW-58). */
function sampleShapes(mark: LegendMark): SampleShape[] {
  return SAMPLES.get(mark)!();
}

const SAMPLES = new Map<LegendMark, () => SampleShape[]>([
  ['OWN_ZONE', ownZoneSample],
  ['READY', readySample],
  ['TURN', turnSample],
  ['VALID_SLOT', validSlotSample],
  ['SOURCE', sourceSample],
  ['VALID_TARGET', () => [neutralSlot(), ...frame('MARK_VALID')]],
  ['INVALID_TARGET', () => [neutralSlot(), ...frame('MARK_INVALID'), ...forbiddenIcon()]],
  ['ELIMINATED', eliminatedSample]
]);

function ownZoneSample(): SampleShape[] {
  const tint = slotFill('SLOT_OWN_TINT', 'SLOT_OWN_BORDER', SLOT_FILL_ALPHA);
  const lines: SampleShape = {
    kind: 'LINES',
    paths: ownZoneLines(SLOT_CORNERS),
    stroke: paletteText('OWN_ZONE_LINES'),
    strokeWidth: OWN_ZONE_LINE_WIDTH
  };

  return EffectSettings.extraMarksAreOn() ? [tint, lines] : [tint];
}

function readySample(): SampleShape[] {
  const mark = EffectSettings.extraMarksAreOn()
    ? edgedLines(readyCorners(SLOT_CORNERS), 'MARK_READY', EXTRA_MARK_FRAME_WIDTH)
    : frame('MARK_READY');

  return [neutralSlot(), ...mark];
}

function turnSample(): SampleShape[] {
  const signal = EffectSettings.extraMarksAreOn() ? crown() : [];

  return [neutralSlot(), ...frame('MARK_TURN_GLOW'), ...signal];
}

function validSlotSample(): SampleShape[] {
  const fill = EffectSettings.extraMarksAreOn()
    ? slotFill('MARK_VALID', 'SLOT_BORDER', SLOT_SOLID_FILL_ALPHA)
    : slotFill('SLOT_VALID_FILL', 'SLOT_BORDER', SLOT_FILL_ALPHA);

  return [fill, ...frame('MARK_VALID')];
}

function sourceSample(): SampleShape[] {
  const mark = EffectSettings.extraMarksAreOn()
    ? edgedLines(sourceDashes(SLOT_CORNERS), 'MARK_SOURCE', EXTRA_MARK_FRAME_WIDTH)
    : frame('MARK_SOURCE');

  return [slotFill('SLOT_SOURCE_FILL', 'SLOT_BORDER', SLOT_FILL_ALPHA), ...mark];
}

function eliminatedSample(): SampleShape[] {
  const veil: SampleShape = {
    kind: 'POLYGON',
    points: SLOT_OUTLINE,
    fill: paletteText('ELIMINATED_VEIL'),
    fillOpacity: ELIMINATED_VEIL_ALPHA,
    stroke: paletteText('ELIMINATED_VEIL_BORDER'),
    strokeOpacity: 1,
    strokeWidth: FRAME_WIDTH
  };

  return [neutralSlot(), veil];
}

function neutralSlot(): SampleShape {
  return slotFill('SLOT_FILL', 'SLOT_BORDER', SLOT_FILL_ALPHA);
}

function slotFill(fill: PaletteColor, border: PaletteColor, fillOpacity: number): SampleShape {
  return {
    kind: 'POLYGON',
    points: SLOT_OUTLINE,
    fill: paletteText(fill),
    fillOpacity,
    stroke: paletteText(border),
    strokeOpacity: SLOT_BORDER_ALPHA,
    strokeWidth: FRAME_WIDTH
  };
}

/** A solid frame over the border of the slot (VIEW-32). */
function frame(color: PaletteColor): SampleShape[] {
  return edgedWidths(FRAME_WIDTH, color).map(([strokeWidth, stroke]) => {
    return { kind: 'POLYGON', points: SLOT_OUTLINE, fill: NO_PAINT, fillOpacity: 0, stroke, strokeOpacity: 1, strokeWidth };
  });
}

function edgedLines(paths: MarkPath[], color: PaletteColor, width: number): SampleShape[] {
  return edgedWidths(width, color).map(([strokeWidth, stroke]) => {
    return { kind: 'LINES', paths, stroke, strokeWidth };
  });
}

/** The near black edge goes first, wider on each side, and only in the accessible mode (VIEW-40). */
function edgedWidths(width: number, color: PaletteColor): Array<[number, string]> {
  const line: [number, string] = [width, paletteText(color)];

  if (!EffectSettings.accessibleModeIsOn()) {
    return [line];
  }

  return [[width + 2 * EDGE_WIDTH, paletteText('MARK_EDGE')], line];
}

/** The crown on its disc, centered on the middle of the top edge (VIEW-39). */
function crown(): SampleShape[] {
  const center = { x: CARD_WIDTH / 2, y: 0 };
  const gold = paletteText('MARK_TURN_GLOW');
  const crownPoints = crownPath(CROWN_RADIUS).map((point) => ({ x: center.x + point.x, y: center.y + point.y }));
  const disc: SampleShape = {
    kind: 'CIRCLE',
    center,
    radius: CROWN_RADIUS,
    fill: paletteText('TURN_CROWN_DISC'),
    stroke: gold,
    strokeWidth: CROWN_RADIUS * CROWN_RING_FRACTION
  };
  const shape: SampleShape = {
    kind: 'POLYGON',
    points: crownPoints,
    fill: gold,
    fillOpacity: 1,
    stroke: NO_PAINT,
    strokeOpacity: 0,
    strokeWidth: 0
  };

  return [disc, shape];
}

/** The red ring and bar on a dark disc, centered on the slot (VIEW-4). */
function forbiddenIcon(): SampleShape[] {
  const radius = FORBIDDEN_ICON_RADIUS;
  const ringWidth = radius * FORBIDDEN_ICON_RING_FRACTION;
  const barReach = radius * Math.SQRT1_2;
  const center = { x: CARD_WIDTH / 2, y: CARD_HEIGHT / 2 };
  const red = paletteText('MARK_INVALID');
  const disc: SampleShape = {
    kind: 'CIRCLE',
    center,
    radius: radius - ringWidth / 2,
    fill: paletteText('FORBIDDEN_ICON_DISC'),
    stroke: red,
    strokeWidth: ringWidth
  };
  const bar: SampleShape = {
    kind: 'LINES',
    paths: [[{ x: center.x - barReach, y: center.y + barReach }, { x: center.x + barReach, y: center.y - barReach }]],
    stroke: red,
    strokeWidth: ringWidth
  };

  return [disc, bar];
}

/** The points as the `points` of an SVG polygon or polyline. */
function svgPoints(points: Point2D[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

export type { LegendMark, SampleFrame, SampleShape };
export { LEGEND_MARKS, sampleFrame, sampleShapes, svgPoints };
