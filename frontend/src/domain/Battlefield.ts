import BattlefieldSkin from "@/domain/BattlefieldSkin";
import GameConfiguration from "@/domain/GameConfiguration";
import { Corners2D, Point2D } from "@/domain/Geometry";
import Zone from "@/domain/Zone";

const BASE_BOARD_SIDE = 3200;
const PLAYER_SPACING = 900;

enum BattlefieldSide {
  BOTTOM = 'bottom',
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right'
}

class Battlefield {
  private sideSize: number;
  private maxPlayersPerSide: number;
  public readonly playerSpacing: number;

  public readonly skin: BattlefieldSkin;
  public readonly gameConfiguration: GameConfiguration;

  public readonly myZone: Zone;
  public readonly friendlyZones: Zone[];
  public readonly enemyZones: Zone[];

  constructor(skin: BattlefieldSkin, gameConfiguration: GameConfiguration, myZone: Zone) {
    this.playerSpacing = PLAYER_SPACING;
    this.skin = skin;
    this.gameConfiguration = gameConfiguration;
    this.myZone = myZone;
    this.friendlyZones = [];
    this.enemyZones = [];
    
    this.recalculateDimensions();
  }

  public addZones(zones: Zone[]) {
    const notMyZones = zones.filter(z => z.owner.code !== this.myZone.owner.code);

    for (const zone of notMyZones) {
      if (zone.team === 'ENEMY') this.enemyZones.push(zone);
      if (zone.team === 'FRIENDLY') this.friendlyZones.push(zone);
    }

    this.recalculateDimensions();
  }

  private recalculateDimensions() {
    const friendlyCount = this.friendlyZones.length + 1;
    const enemyCountPerSide = Math.ceil(this.enemyZones.length / 3);
    
    this.maxPlayersPerSide = Math.max(friendlyCount, enemyCountPerSide, 1);
    this.sideSize = Battlefield.sideSizeForPlayerCount(this.maxPlayersPerSide, this.playerSpacing);
  }

  public getSideSize(): number {
    return this.sideSize;
  }

  public getMaxPlayersPerSide(): number {
    return this.maxPlayersPerSide;
  }

  public getCenter(): Point2D {
    const half = this.sideSize / 2;
    return { x: half, y: half };
  }

  public getCorners(): Corners2D {
    const w = this.sideSize / 2;
    return {
      tl: { x: -w, y: -w }, // Top-left
      tr: { x:  w, y: -w }, // Top-right
      bl: { x: -w, y:  w }, // Bottom-left
      br: { x:  w, y:  w } // Bottom-right
    };
  }

  public static sideSizeForPlayerCount(playerCount: number, playerSpacing: number = PLAYER_SPACING): number {
    return BASE_BOARD_SIDE + (playerCount - 1) * playerSpacing;
  }
}

export {BattlefieldSide}
export default Battlefield;