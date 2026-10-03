import { Corners3D, Point2D } from "@/domain/Geometry";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import type CardView from "@/game/cards/CardView";
import type ZoneSlotView from "@/game/zone/ZoneSlotView";

function distanceBetween(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function calculateCardTargetScale(
  corners: Corners3D,
  cardWidth: number = CARD_WIDTH,
  cardHeight: number = CARD_HEIGHT
): Point2D {
  const visualWidthTop = distanceBetween(corners.tl.x, corners.tl.y, corners.tr.x, corners.tr.y);
  const visualWidthBottom = distanceBetween(corners.bl.x, corners.bl.y, corners.br.x, corners.br.y);
  const visualHeightLeft = distanceBetween(corners.tl.x, corners.tl.y, corners.bl.x, corners.bl.y);
  const visualHeightRight = distanceBetween(corners.tr.x, corners.tr.y, corners.br.x, corners.br.y);

  const targetWidth = (visualWidthTop + visualWidthBottom) / 2;
  const targetHeight = (visualHeightLeft + visualHeightRight) / 2;

  return {
    x: targetWidth / cardWidth,
    y: targetHeight / cardHeight
  };
}

function applyCardTransformations(zoneSlotView: ZoneSlotView, cardView: CardView) {
  const scale = calculateCardTargetScale(zoneSlotView.corners);

  cardView.setOriginalPosition(0, 0);
  cardView.setOriginalScale(scale.x, scale.y);
  cardView.setOriginalDepth(zoneSlotView.depth + 1);
  cardView.setAngle(zoneSlotView.rotation);
  cardView.reset();
}

function previewCard(zoneSlotView: ZoneSlotView, cardView: CardView) {
  const { tx, ty } = zoneSlotView.getWorldTransformMatrix();
  const scale = calculateCardTargetScale(zoneSlotView.corners);
  const tweenArgs = [tx, ty, scale, zoneSlotView.rotation];
  cardView.applyTween('preview_in_zone_slot', ...tweenArgs);
}

const zoneSlotCardHelper = {
  applyCardTransformations,
  previewCard,
  calculateCardTargetScale
};

export { calculateCardTargetScale };
export default zoneSlotCardHelper;