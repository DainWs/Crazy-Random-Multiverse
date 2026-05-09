import BattlefieldSkin from "@/domain/BattlefieldSkin";
import GameConfiguration from "@/domain/GameConfiguration";
import { Corners2D, Point2D } from "@/domain/Geometry";
import Zone from "@/domain/Zone";

const BASE_BOARD_SIDE = 3200;
const PLAYER_SPACING = 900;
const MAX_PLAYERS_PER_BATTLEFIELD_SIDE = 3;

enum BattlefieldSide {
  BOTTOM = 'bottom',
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right'
}

class Battlefield {
  public readonly sideSize: number;
  public readonly playerSpacing: number;
  public readonly maxPlayersPerSide: number;

  public readonly skin: BattlefieldSkin;
  public readonly gameConfiguration: GameConfiguration;

  public readonly myZone: Zone;
  public readonly friendlyZones: Zone[];
  public readonly enemyZones: Zone[];

  constructor(skin: BattlefieldSkin, gameConfiguration: GameConfiguration, myZone: Zone) {
    this.maxPlayersPerSide = MAX_PLAYERS_PER_BATTLEFIELD_SIDE;
    this.playerSpacing = PLAYER_SPACING;
    this.sideSize = BASE_BOARD_SIDE + (this.maxPlayersPerSide - 1) * this.playerSpacing;

    this.skin = skin;
    this.gameConfiguration = gameConfiguration;
    this.myZone = myZone;
    this.friendlyZones = [];
    this.enemyZones = [];
  }

  public addZones(zones: Zone[]) {
    const notMyZones = zones.filter(z => z.owner.code !== this.myZone.owner.code);

    for (const zone of notMyZones) {
      if (zone.team === 'enemy') this.enemyZones.push(zone);
      if (zone.team === 'friendly') this.friendlyZones.push(zone);
    }
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
}

export default Battlefield;