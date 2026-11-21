import type { Corners3D, Point2D, Size2D } from '@/domain/Geometry';
import type { LabelSide } from '@/game/zone/ZoneLabelLayout';
import { CARD_VALUE_LABEL_CARD_GAP } from '@/core/Constants';
import ZoneLabelLayout from '@/game/zone/ZoneLabelLayout';

interface LabelPlacement {
  side: LabelSide;
  /** Center of the label, in the same space as the center of the slot. */
  position: Point2D;
}

/** An item that has a center on the board, to be sorted by how far it is from another point. */
interface Centered {
  center: Point2D;
}

/**
 * Pure layout class of the labels with the values of a card (VIEW-47, VIEW-48): on which edge of the card each one goes and
 * where its center is, and in which order they are drawn.
 */
class CardValueLabelLayout {
  private readonly zoneLayout = new ZoneLabelLayout();

  /** `labelSize` is in px on the screen and `unitsPerPixel` turns it into the units of the space of `slotCenter`. */
  public place(
    slotCenter: Point2D,
    corners: Pick<Corners3D, 'bl' | 'br'>,
    labelSize: Size2D,
    unitsPerPixel: number
  ): LabelPlacement {
    const offset = this.zoneLayout.edgeOffset(corners);
    const side = this.zoneLayout.sideOf(offset);
    const edge = { x: slotCenter.x + offset.x, y: slotCenter.y + offset.y };
    const halfWidth = (labelSize.width / 2 + CARD_VALUE_LABEL_CARD_GAP) * unitsPerPixel;
    const halfHeight = (labelSize.height / 2 + CARD_VALUE_LABEL_CARD_GAP) * unitsPerPixel;

    if (side === 'BOTTOM') {
      return { side, position: { x: edge.x, y: edge.y + halfHeight } };
    }

    if (side === 'TOP') {
      return { side, position: { x: edge.x, y: edge.y - halfHeight } };
    }

    return { side, position: { x: edge.x + (side === 'RIGHT' ? halfWidth : -halfWidth), y: edge.y } };
  }

  /** The farthest from `leader` first, so the closest is drawn last and ends on top (VIEW-48). A tie keeps the order it had. */
  public farthestFirst<T extends Centered>(items: T[], leader: Point2D): T[] {
    const distanceToLeader = (item: T) => Math.hypot(item.center.x - leader.x, item.center.y - leader.y);

    return [...items].sort((first, second) => distanceToLeader(second) - distanceToLeader(first));
  }
}

export type { LabelPlacement };
export default CardValueLabelLayout;
