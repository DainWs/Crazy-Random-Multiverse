import BattlefieldSkin from "@/domain/BattlefieldSkin";

type Point2D = { x: number, y: number };
type Corners2D = { tl: Point2D, tr: Point2D, bl: Point2D, br: Point2D }

const MAX_PLAYERS_PER_BATTLEFIELD_SIDE = 4;
const PLAYER_SPACING = 900;
const EXTRA_BOARD_SPACE_PER_PLAYERS = (MAX_PLAYERS_PER_BATTLEFIELD_SIDE - 1) * PLAYER_SPACING;

const BASE_BOARD_SIDE = 2400;

class Battlefield {
  public readonly sideSize: number;
  public readonly skin: BattlefieldSkin;

  constructor(skin: BattlefieldSkin) {
    this.sideSize = BASE_BOARD_SIDE + EXTRA_BOARD_SPACE_PER_PLAYERS;
    this.skin = skin;
  }

  public getCenter(): Point2D {
    return {
      x: this.sideSize / 2,
      y: this.sideSize / 2
    };
  }

  public getCorners(): Corners2D {
    const w = this.sideSize / 2;
    const thickness = this.skin.thickness;
    return {
      tl: { x: -w + (thickness * 2), y: -w }, // Top-left
      tr: { x: w - (thickness * 2), y: -w }, // Top-right
      bl: { x: -w + (thickness + 10), y: w }, // Bottom-left
      br: { x: w - (thickness + 10), y: w } // Bottom-right
    };
  }
}

export type { Point2D, Corners2D };
export default Battlefield;