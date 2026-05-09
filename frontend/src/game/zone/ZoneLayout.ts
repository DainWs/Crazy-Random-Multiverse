import Battlefield, { BattlefieldSide } from "@/domain/Battlefield";
import { Point2D } from "@/domain/Geometry";

const PLAYER_ZONE_HALF_HEIGHT = 470;

class ZoneLayout {
  private battlefield: Battlefield;
  private playerCount: number;
  private playerSpacing: number;
  private halfWidth: number;
  private offset: number;
  
  private enemySideIterator: BattlefieldSide[];

  public constructor(battlefield: Battlefield, enemySideIterator: BattlefieldSide[]) {
    this.battlefield = battlefield;
    this.enemySideIterator = enemySideIterator;
    this.playerCount = battlefield.maxPlayersPerSide;
    this.playerSpacing = battlefield.playerSpacing;
    this.halfWidth = battlefield.sideSize / 2;
    this.offset = battlefield.skin.gridStep * 2 + PLAYER_ZONE_HALF_HEIGHT;
  }

  public getNextBottomZonePosition(index: number, playerIndex: number): Point2D {
    const slotIndex = index >= playerIndex ? index + 1 : index;    
    return this.getPlayerZonePosition(BattlefieldSide.BOTTOM, slotIndex);
  }

  public getNextEnemyZonePosition(index: number): Point2D {
    const sideIndex = index % this.enemySideIterator.length;
    const innerIndex = Math.floor(index / this.enemySideIterator.length);
    return this.getPlayerZonePosition(this.enemySideIterator[sideIndex], innerIndex);
  }

  public getPlayerZonePosition(side: BattlefieldSide, zoneIndex: number): Point2D {
    const linearOffset = (zoneIndex - (this.playerCount - 1) / 2) * this.playerSpacing;
    const progressiveOffset = this.calculateProgressiveOffset(side, zoneIndex);

    if (side === BattlefieldSide.BOTTOM) return { x: linearOffset, y: this.halfWidth - this.offset };
    if (side === BattlefieldSide.TOP) return { x: -linearOffset, y: -this.halfWidth + this.offset };
    if (side === BattlefieldSide.LEFT) return { x: -this.halfWidth + this.offset, y: progressiveOffset };
    if (side === BattlefieldSide.RIGHT) return { x: this.halfWidth - this.offset, y: progressiveOffset };
    return { x: 0, y: 0 };
  }

  private calculateProgressiveOffset(side: BattlefieldSide, zoneIndex: number): number {
    const maxPlayers = this.battlefield.maxPlayersPerSide;
    const playerSpacing = this.battlefield.playerSpacing;
    const linearOffset = (zoneIndex - (maxPlayers - 1) / 2) * playerSpacing;

    if (maxPlayers <= 2) return linearOffset;
    if (side !== BattlefieldSide.LEFT && side !== BattlefieldSide.RIGHT) return linearOffset;

    const totalSpace = (maxPlayers - 1) * playerSpacing;
    const minGap = 0.95 * playerSpacing;
    const distance = 2 * (playerSpacing - minGap) / (maxPlayers - 2);
    
    let progressiveIndex = zoneIndex;
    if (side === BattlefieldSide.RIGHT) {
      progressiveIndex = maxPlayers - 1 - zoneIndex;
    }

    let currentOffset = -totalSpace / 2;
    for (let i = 0; i < progressiveIndex; i++) {
      currentOffset += minGap + i * distance;
    }
    return currentOffset;
  }
}

export default ZoneLayout;