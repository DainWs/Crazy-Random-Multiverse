import type { Point2D, Size2D } from '@/domain/Geometry';
import type { LabelSide } from '@/game/zone/CardValueLabelLayout';
import * as Constants from '@/core/Constants';

/** The smallest rectangle that holds a zone, in the space of the board. */
interface ZoneBounds {
  min: Point2D;
  max: Point2D;
}

/** A rectangle in the space of the board, given by its center. */
interface Strip {
  center: Point2D;
  size: Size2D;
}

type BarLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface ZoneTurnOrderEntry {
  code: string;
  isAlive: boolean;
}

/**
 * Pure layout of what is drawn around a zone (VIEW-49, VIEW-50, VIEW-51): the health bar of its leader and the label with the
 * name of its player, both outside the edge of the zone that faces away from the center of the table, and who plays next.
 * `unitsPerPixel` turns the pixels on the screen, which do not change with the zoom, into the units of the board.
 */
class ZoneLabelLayout {
  public boundsOf(points: Point2D[]): ZoneBounds {
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);

    return { min: { x: Math.min(...xs), y: Math.min(...ys) }, max: { x: Math.max(...xs), y: Math.max(...ys) } };
  }

  /** The bar is as long as the edge of the zone, and as thick as the same pixels on the screen at any zoom. */
  public bar(bounds: ZoneBounds, side: LabelSide, unitsPerPixel: number): Strip {
    const thickness = Constants.ZONE_BAR_THICKNESS * unitsPerPixel;
    const length = this.isHorizontal(side) ? bounds.max.x - bounds.min.x : bounds.max.y - bounds.min.y;
    const size = this.isHorizontal(side) ? { width: length, height: thickness } : { width: thickness, height: length };

    return { center: this.outside(bounds, side, Constants.ZONE_BAR_GAP * unitsPerPixel, thickness), size };
  }

  /** The part of the bar that is filled: from the left on a horizontal bar and from the bottom on a vertical one. */
  public fill(bar: Strip, ratio: number): Strip {
    const share = Math.min(Math.max(ratio, 0), 1);
    const { center, size } = bar;

    if (size.width >= size.height) {
      const width = size.width * share;
      return { center: { x: center.x - size.width / 2 + width / 2, y: center.y }, size: { width, height: size.height } };
    }

    const height = size.height * share;
    return { center: { x: center.x, y: center.y + size.height / 2 - height / 2 }, size: { width: size.width, height } };
  }

  /** The label goes beyond the bar. `labelSize` is in pixels on the screen. */
  public name(bounds: ZoneBounds, side: LabelSide, labelSize: Size2D, unitsPerPixel: number): Point2D {
    const barEnd = Constants.ZONE_BAR_GAP + Constants.ZONE_BAR_THICKNESS + Constants.ZONE_NAME_GAP;
    const depth = this.isHorizontal(side) ? labelSize.height : labelSize.width;

    return this.outside(bounds, side, barEnd * unitsPerPixel, depth * unitsPerPixel);
  }

  public barLevel(ratio: number): BarLevel {
    if (ratio > Constants.ZONE_BAR_HIGH_ABOVE) {
      return 'HIGH';
    }

    return ratio > Constants.ZONE_BAR_MEDIUM_ABOVE ? 'MEDIUM' : 'LOW';
  }

  /** Cuts the name, ending it with an ellipsis, until `measure` says it fits in `maxWidth` (VIEW-49). */
  public truncateName(name: string, maxWidth: number, measure: (text: string) => number): string {
    if (measure(name) <= maxWidth) {
      return name;
    }

    let length = name.length - 1;
    while (length > 0 && measure(`${name.slice(0, length)}${Constants.ZONE_NAME_ELLIPSIS}`) > maxWidth) {
      length -= 1;
    }

    return `${name.slice(0, length)}${Constants.ZONE_NAME_ELLIPSIS}`;
  }

  /** The first player alive after the one with the turn, in the order of the zones (VIEW-51, TURN-1). */
  public nextPlayerCode(order: ZoneTurnOrderEntry[], turnCode: string | undefined): string | undefined {
    const turnIndex = order.findIndex((entry) => entry.code === turnCode);
    if (turnIndex === -1) {
      return undefined;
    }

    for (let step = 1; step < order.length; step += 1) {
      const candidate = order[(turnIndex + step) % order.length];
      if (candidate.isAlive) {
        return candidate.code;
      }
    }

    return undefined;
  }

  private isHorizontal(side: LabelSide): boolean {
    return side === 'BOTTOM' || side === 'TOP';
  }

  /** The center of a strip `depth` thick that starts `distance` away from the edge of the zone on its `side`. */
  private outside(bounds: ZoneBounds, side: LabelSide, distance: number, depth: number): Point2D {
    const offset = distance + depth / 2;
    const centerX = (bounds.min.x + bounds.max.x) / 2;
    const centerY = (bounds.min.y + bounds.max.y) / 2;

    if (side === 'BOTTOM') {
      return { x: centerX, y: bounds.max.y + offset };
    }

    if (side === 'TOP') {
      return { x: centerX, y: bounds.min.y - offset };
    }

    return side === 'LEFT' ? { x: bounds.min.x - offset, y: centerY } : { x: bounds.max.x + offset, y: centerY };
  }
}

export type { BarLevel, Strip, ZoneBounds, ZoneTurnOrderEntry };
export default ZoneLabelLayout;
