import { Point2D } from "@/domain/Geometry";
import { CardView } from "@/game/cards/CardView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

const Distance = Phaser.Math.Distance;

function applyCardTransformations(zoneSlotView: ZoneSlotView, cardView: CardView) {
  const scale = getCardTargetScale(zoneSlotView);

  cardView.setOriginalPosition(0, 0);
  cardView.setOriginalScale(scale.x, scale.y);
  cardView.setOriginalDepth(zoneSlotView.depth + 1);
  cardView.setAngle(zoneSlotView.rotation);
  cardView.reset();
}

function previewCard(zoneSlotView: ZoneSlotView, cardView: CardView) {
  const {tx, ty} = zoneSlotView.getWorldTransformMatrix();
  const scale = getCardTargetScale(zoneSlotView);
  const tweenArgs = [tx, ty, scale, zoneSlotView.rotation];
  cardView.applyTween('preview_in_zone_slot', ...tweenArgs);
}

function getCardTargetScale(zoneSlotView: ZoneSlotView): Point2D {
  const { corners } = zoneSlotView;
  const visualWidthTop = Distance.Between(corners.tl.x, corners.tl.y, corners.tr.x, corners.tr.y);
  const visualWidthBottom = Distance.Between(corners.bl.x, corners.bl.y, corners.br.x, corners.br.y);
  const visualHeightLeft = Distance.Between(corners.tl.x, corners.tl.y, corners.bl.x, corners.bl.y);
  const visualHeightRight = Distance.Between(corners.tr.x, corners.tr.y, corners.br.x, corners.br.y);

  const targetWidth = (visualWidthTop + visualWidthBottom) / 2;
  const targetHeight = (visualHeightLeft + visualHeightRight) / 2;

  return {
    x: targetWidth / CardView.WIDTH,
    y: targetHeight / CardView.HEIGHT
  };
}

const zoneSlotCardHelper = {
  applyCardTransformations,
  previewCard
}

export default zoneSlotCardHelper;