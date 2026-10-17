import type ZoneSlotView from "@/game/zone/ZoneSlotView";
import type { Corners3D, Point2D } from "@/domain/Geometry";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import CombatantView from "@/game/cards/CombatantView";

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

function applyCardTransformations(zoneSlotView: ZoneSlotView, combatantView: CombatantView) {
  const scale = calculateCardTargetScale(zoneSlotView.corners);

  combatantView.setOriginalPosition(0, 0);
  combatantView.setOriginalScale(scale.x, scale.y);
  combatantView.setOriginalDepth(zoneSlotView.depth + 1);
  combatantView.setAngle(zoneSlotView.rotation);
  combatantView.reset();
}

function previewCard(zoneSlotView: ZoneSlotView, combatantView: CombatantView) {
  const { tx, ty } = zoneSlotView.getWorldTransformMatrix();
  const scale = calculateCardTargetScale(zoneSlotView.corners);
  const tweenArgs = [tx, ty, scale, zoneSlotView.rotation];
  CardAnimator.playTween(combatantView, 'preview_in_zone_slot', ...tweenArgs);
}

const zoneSlotCardHelper = {
  applyCardTransformations,
  previewCard,
  calculateCardTargetScale
};

export { calculateCardTargetScale };
export default zoneSlotCardHelper;