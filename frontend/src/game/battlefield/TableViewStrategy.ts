import Battlefield from "@/domain/Battlefield";
import BattlefieldSkin from "@/domain/BattlefieldSkin";
import BattlefieldViewStrategy from "@/game/battlefield/BattlefieldViewStrategy";
import ProjectionSystem from "@/core/ProjectionSystem";
import { Corner, Corners, Point, Point2D } from "@/domain/Geometry";

type Graphics = Phaser.GameObjects.Graphics

const TABLE_LEG_HEIGHT = 300;
/** Thickness of the lines of the grid of the table (VIEW-26), in px. */
const GRID_LINE_WIDTH = 1;

class TableViewStrategy implements BattlefieldViewStrategy {
  public render(graphics: Graphics, battlefield: Battlefield): void {
    graphics.clear();

    const corners = ProjectionSystem.toCorners3D(battlefield.getCorners());

    // table thickness sides
    graphics.setAlpha(1);
    graphics.fillStyle(battlefield.skin.backgroundColor);
    graphics.lineStyle(2, battlefield.skin.borderColor);
    this.renderSide(graphics, corners.tl, corners.bl, battlefield.skin.thickness);
    this.renderSide(graphics, corners.tr, corners.br, battlefield.skin.thickness);
    this.renderSide(graphics, corners.tl, corners.tr, battlefield.skin.thickness / 2);
    this.renderSide(graphics, corners.bl, corners.br, battlefield.skin.thickness / 2);

    // legs of the table
    this.renderTableLeg(graphics, 'TL', corners.tl, battlefield.skin);
    this.renderTableLeg(graphics, 'TR', corners.tr, battlefield.skin);

    // table surface
    this.renderTableSurface(graphics, corners, battlefield.skin);
    this.renderGridLines(graphics, battlefield);

    // table outline
    this.renderTableOutline(graphics, corners, battlefield.skin);

    // legs of the table
    this.renderTableLeg(graphics, 'BL', corners.bl, battlefield.skin);
    this.renderTableLeg(graphics, 'BR', corners.br, battlefield.skin);
  }

  private renderTableSurface(graphics: Graphics, corners: Corners, skin: BattlefieldSkin) {
    graphics.fillStyle(skin.backgroundColor, skin.borderAlpha);
    graphics.beginPath();
    graphics.moveTo(corners.tl.x, corners.tl.y);
    graphics.lineTo(corners.tr.x, corners.tr.y);
    graphics.lineTo(corners.br.x, corners.br.y);
    graphics.lineTo(corners.bl.x, corners.bl.y);
    graphics.closePath();
    graphics.fillPath();
  }

  private renderGridLines(graphics: Graphics, battlefield: Battlefield) {
    const step = battlefield.skin.gridStep;
    const corners = battlefield.getCorners();

    // Without a path of its own the stroke would draw the table surface and the earlier lines again, piling up their alpha
    graphics.lineStyle(GRID_LINE_WIDTH, battlefield.skin.gridColor, battlefield.skin.gridAlpha);
    graphics.beginPath();
    for (let x = corners.tl.x; x <= corners.tr.x; x += step) {
      this.addGridLine(graphics, { x, y: corners.bl.y }, { x, y: corners.tl.y });
    }

    for (let y = corners.tl.y; y <= corners.bl.y; y += step) {
      this.addGridLine(graphics, { x: corners.tl.x, y }, { x: corners.tr.x, y });
    }
    graphics.strokePath();
  }

  private addGridLine(graphics: Graphics, from: Point2D, to: Point2D) {
    const projectedFrom = ProjectionSystem.toPoint3D(from);
    const projectedTo = ProjectionSystem.toPoint3D(to);

    graphics.moveTo(projectedFrom.x, projectedFrom.y);
    graphics.lineTo(projectedTo.x, projectedTo.y);
  }

  private renderTableOutline(graphics: Graphics, corners: Corners, skin: BattlefieldSkin) {
    graphics.lineStyle(2, skin.borderColor, skin.borderAlpha);
    graphics.beginPath();
    graphics.moveTo(corners.tl.x, corners.tl.y);
    graphics.lineTo(corners.tr.x, corners.tr.y);
    graphics.lineTo(corners.br.x, corners.br.y);
    graphics.lineTo(corners.bl.x, corners.bl.y);
    graphics.closePath();
    graphics.strokePath();
  }

  private renderSide(graphics: Graphics, start: Point, end: Point, sideThickness: number) {
    graphics.beginPath();
    graphics.moveTo(start.x, start.y);
    graphics.lineTo(end.x, end.y);
    graphics.lineTo(end.x, end.y + sideThickness);
    graphics.lineTo(start.x, start.y + sideThickness);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  private renderTableLeg(graphics: Graphics, corner: Corner, point: Point, skin: BattlefieldSkin) { 
    const legThickness = skin.thickness / 2;           
    let offset =legThickness;
    if (corner == 'TR' || corner == 'BR') {
      offset = -offset;
    }

    // body of the leg
    graphics.lineStyle(legThickness, skin.backgroundColor, 1);
    graphics.lineBetween(
      point.x + offset / 2, point.y + legThickness, 
      point.x + offset / 2, point.y + TABLE_LEG_HEIGHT);

    // outline of the leg
    graphics.lineStyle(2, skin.borderColor, skin.borderAlpha);
    graphics.lineBetween(point.x, point.y + legThickness, point.x, point.y + legThickness + TABLE_LEG_HEIGHT);
    graphics.lineBetween(point.x + offset, point.y + legThickness, point.x + offset, point.y + legThickness + TABLE_LEG_HEIGHT);
  }

  
}

export { GRID_LINE_WIDTH };
export default TableViewStrategy