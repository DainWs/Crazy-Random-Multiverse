import { Corners3D } from "@/domain/Geometry";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import {
  ELIMINATED_VEIL_ALPHA, ELIMINATED_VEIL_BORDER_COLOR, ELIMINATED_VEIL_BORDER_WIDTH, ELIMINATED_VEIL_COLOR, SLOT_BORDER_WIDTH
} from "@/core/Constants";

type Graphics = Phaser.GameObjects.Graphics;
type Image = Phaser.GameObjects.Image;

const BACKGROUND_ALPHA = 0.45;
const BACKGROUND_COLOR = 0xffffff;
const BACKGROUND_BORDER_COLOR = 0x4488cc;
const BACKGROUND_BORDER_ALPHA = 0.8;

class ZoneSlotViewRenderer {

  public static render(graphics: Graphics, mark: Image, zoneSlotView: ZoneSlotView) {
    this.renderBackground(graphics, zoneSlotView.corners);
    this.renderMark(mark, zoneSlotView);
  }

  public static renderBackground(graphics: Graphics, corners: Corners3D, backgroundColor = BACKGROUND_COLOR, borderColor = BACKGROUND_BORDER_COLOR) {
    graphics.clear();
    graphics.fillStyle(backgroundColor, BACKGROUND_ALPHA);
    graphics.lineStyle(SLOT_BORDER_WIDTH, borderColor, BACKGROUND_BORDER_ALPHA);
    graphics.beginPath();
    graphics.moveTo(corners.tl.x, corners.tl.y);
    graphics.lineTo(corners.tr.x, corners.tr.y);
    graphics.lineTo(corners.br.x, corners.br.y);
    graphics.lineTo(corners.bl.x, corners.bl.y);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  /** Tints the slot of an eliminated player's zone a dark red, with a dark border that tells the slots apart (VIEW-11). */
  public static renderVeil(graphics: Graphics, corners: Corners3D) {
    graphics.clear();
    graphics.fillStyle(ELIMINATED_VEIL_COLOR, ELIMINATED_VEIL_ALPHA);
    graphics.lineStyle(ELIMINATED_VEIL_BORDER_WIDTH, ELIMINATED_VEIL_BORDER_COLOR, 1);
    graphics.beginPath();
    graphics.moveTo(corners.tl.x, corners.tl.y);
    graphics.lineTo(corners.tr.x, corners.tr.y);
    graphics.lineTo(corners.br.x, corners.br.y);
    graphics.lineTo(corners.bl.x, corners.bl.y);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  /** Frames the slot with a solid line, to be drawn over its card so the mark stays visible (UI-5, VIEW-4). */
  public static renderMarker(graphics: Graphics, corners: Corners3D, color: number) {
    graphics.clear();
    graphics.lineStyle(SLOT_BORDER_WIDTH, color, 1);
    graphics.beginPath();
    graphics.moveTo(corners.tl.x, corners.tl.y);
    graphics.lineTo(corners.tr.x, corners.tr.y);
    graphics.lineTo(corners.br.x, corners.br.y);
    graphics.lineTo(corners.bl.x, corners.bl.y);
    graphics.closePath();
    graphics.strokePath();
  }

  private static renderMark(mark: Image, zoneSlotView: ZoneSlotView) {
    // ZoneSlotView is centered at (0,0) in local-space; mark goes at the center
    mark.setPosition(0, 0);
    mark.setScale(4 * zoneSlotView.centerPoint.scale);
    mark.setOrigin(0.5, 0.5);
    mark.setAlpha(0.8);
    mark.setAngle(zoneSlotView.slotRotation ?? 0);
  }

}

export default ZoneSlotViewRenderer;