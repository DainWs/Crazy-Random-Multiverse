import BattlefieldSkin from "@/domain/BattlefieldSkin";
import { Corners2D, Point2D, Rotation } from "@/domain/Geometry";

const MAX_PLAYERS_PER_BATTLEFIELD_SIDE = 3;
const PLAYER_SPACING = 900;
const EXTRA_BOARD_SPACE_PER_PLAYERS = (MAX_PLAYERS_PER_BATTLEFIELD_SIDE - 1) * PLAYER_SPACING;

const BASE_BOARD_SIDE = 3200;

enum BattlefieldSide {
  BOTTOM = 'bottom',
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right'
}

const rotationMap = new Map<BattlefieldSide, Rotation>();
rotationMap.set(BattlefieldSide.BOTTOM, 0);
rotationMap.set(BattlefieldSide.TOP, 180);
rotationMap.set(BattlefieldSide.LEFT, 90);
rotationMap.set(BattlefieldSide.RIGHT, -90);

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
    return {
      tl: { x: -w, y: -w }, // Top-left
      tr: { x:  w, y: -w }, // Top-right
      bl: { x: -w, y:  w }, // Bottom-left
      br: { x:  w, y:  w } // Bottom-right
    };
  }

  public getRotationForSide(side: BattlefieldSide): Rotation {
    return rotationMap.get(side) || 0;
  }

  public getPlayerZonePosition(zoneSide: BattlefieldSide, zoneIndex: number): Point2D {
    const playerZoneHalfHeight = 470;
    const maxPlayers = MAX_PLAYERS_PER_BATTLEFIELD_SIDE;

    const linearOffset = (zoneIndex - (maxPlayers - 1) / 2) * PLAYER_SPACING;
    const progressiveOffset = this.calculateProgressiveOffset(zoneSide, zoneIndex);

    const halfWidth = this.sideSize / 2;
    const margin = this.skin.gridStep * 2;
  
    const positionMap = new Map<BattlefieldSide, Point2D>();
    positionMap.set(BattlefieldSide.BOTTOM, { 
      x: linearOffset, 
      y: halfWidth - playerZoneHalfHeight - margin
    });
    
    positionMap.set(BattlefieldSide.TOP, { 
      x: -linearOffset, 
      y: -halfWidth + playerZoneHalfHeight + margin
    });
    
    positionMap.set(BattlefieldSide.LEFT, { 
      x: -halfWidth + playerZoneHalfHeight + margin, 
      y: progressiveOffset
    });
    
    positionMap.set(BattlefieldSide.RIGHT, { 
      x: halfWidth - playerZoneHalfHeight - margin, 
      y: progressiveOffset
    });

    return positionMap.get(zoneSide) || { x: 0, y: 0 };
  }

  
  private calculateProgressiveOffset(zoneSide: BattlefieldSide, zoneIndex: number): number {
    const maxPlayers = MAX_PLAYERS_PER_BATTLEFIELD_SIDE;
    const linearOffset = (zoneIndex - (maxPlayers - 1) / 2) * PLAYER_SPACING;

    if (maxPlayers <= 2) return linearOffset;
    if (zoneSide !== BattlefieldSide.LEFT && zoneSide !== BattlefieldSide.RIGHT) return linearOffset;

    const totalSpace = (maxPlayers - 1) * PLAYER_SPACING;
    const minGap = 0.95 * PLAYER_SPACING;
    const distance = 2 * (PLAYER_SPACING - minGap) / (maxPlayers - 2);
    
    let progressiveIndex = zoneIndex;
    if (zoneSide === BattlefieldSide.RIGHT) {
      progressiveIndex = maxPlayers - 1 - zoneIndex;
    }

    let currentOffset = -totalSpace / 2;
    for (let i = 0; i < progressiveIndex; i++) {
      currentOffset += minGap + i * distance;
    }
    return currentOffset;
  }
}

export { BattlefieldSide, MAX_PLAYERS_PER_BATTLEFIELD_SIDE }
export default Battlefield;