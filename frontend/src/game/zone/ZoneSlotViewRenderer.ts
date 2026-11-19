import { Corners3D } from "@/domain/Geometry";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { ELIMINATED_VEIL_ALPHA, ELIMINATED_VEIL_BORDER_WIDTH, SLOT_BORDER_WIDTH } from "@/core/Constants";
import { paletteFill } from "@/game/utils/Palette";
import type { MarkPath } from "@/game/zone/SlotMarkLayout";

type Graphics = Phaser.GameObjects.Graphics;
type Image = Phaser.GameObjects.Image;

const BACKGROUND_ALPHA = 0.45;
const BACKGROUND_BORDER_ALPHA = 0.8;

class ZoneSlotViewRenderer {

  public static render(graphics: Graphics, mark: Image, zoneSlotView: ZoneSlotView) {
    this.renderBackground(graphics, zoneSlotView.corners);
    this.renderMark(mark, zoneSlotView);
  }

  public static renderBackground(
    graphics: Graphics,
    corners: Corners3D,
    backgroundColor = paletteFill('SLOT_FILL'),
    borderColor = paletteFill('SLOT_BORDER'),
    backgroundAlpha = BACKGROUND_ALPHA
  ) {
    graphics.clear();
    graphics.fillStyle(backgroundColor, backgroundAlpha);
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
    graphics.fillStyle(paletteFill('ELIMINATED_VEIL'), ELIMINATED_VEIL_ALPHA);
    graphics.lineStyle(ELIMINATED_VEIL_BORDER_WIDTH, paletteFill('ELIMINATED_VEIL_BORDER'), 1);
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

  /** Strokes separate lines of the second signal of the marks, so they are told apart without color (VIEW-39). */
  public static renderPaths(graphics: Graphics, paths: MarkPath[], color: number, width: number) {
    graphics.clear();
    graphics.lineStyle(width, color, 1);

    for (const path of paths) {
      graphics.beginPath();
      graphics.moveTo(path[0].x, path[0].y);

      for (const point of path.slice(1)) {
        graphics.lineTo(point.x, point.y);
      }

      graphics.strokePath();
    }
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