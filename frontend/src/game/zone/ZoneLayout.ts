import Battlefield, { BattlefieldSide } from "@/domain/Battlefield";
import { Point2D } from "@/domain/Geometry";

const PLAYER_ZONE_HALF_HEIGHT = 470;

class ZoneLayout {
  private battlefield: Battlefield;
  private playerSpacing: number;
  private halfWidth: number;
  private offset: number;
  
  private enemySideIterator: BattlefieldSide[];
  private playersOnSide: Record<BattlefieldSide, number>;

  public constructor(battlefield: Battlefield, enemySideIterator: BattlefieldSide[]) {
    this.battlefield = battlefield;
    this.enemySideIterator = enemySideIterator;
    this.playerSpacing = battlefield.playerSpacing;
    this.halfWidth = battlefield.getSideSize() / 2;
    this.offset = battlefield.skin.gridStep * 2 + PLAYER_ZONE_HALF_HEIGHT;
    this.playersOnSide = this.calculatePlayersOnSide();
  }

  private calculatePlayersOnSide(): Record<BattlefieldSide, number> {
    const counts: Record<BattlefieldSide, number> = {
      [BattlefieldSide.BOTTOM]: this.battlefield.friendlyZones.length + 1,
      [BattlefieldSide.TOP]: 0,
      [BattlefieldSide.LEFT]: 0,
      [BattlefieldSide.RIGHT]: 0
    };

    const numEnemies = this.battlefield.enemyZones.length;
    for (let i = 0; i < numEnemies; i++) {
      const side = this.enemySideIterator[i % this.enemySideIterator.length];
      counts[side]++;
    }

    return counts;
  }

  public getNextBottomZonePosition(index: number, centerPlayerIndex: number): Point2D {
    const slotIndex = index >= centerPlayerIndex ? index + 1 : index;    
    return this.getPlayerZonePosition(BattlefieldSide.BOTTOM, slotIndex, centerPlayerIndex);
  }

  public getNextEnemyZonePosition(index: number): Point2D {
    const sideIndex = index % this.enemySideIterator.length;
    const innerIndex = Math.floor(index / this.enemySideIterator.length);
    return this.getPlayerZonePosition(this.enemySideIterator[sideIndex], innerIndex);
  }

  public getPlayerZonePosition(side: BattlefieldSide, zoneIndex: number, referenceIndex?: number): Point2D {
    const playersOnSide = this.playersOnSide[side];
    const centerIndex = referenceIndex ?? (playersOnSide - 1) / 2;
    const linearOffset = (zoneIndex - centerIndex) * this.playerSpacing;
    const progressiveOffset = this.calculateVerticalOffset(side, zoneIndex, playersOnSide, linearOffset);

    if (side === BattlefieldSide.BOTTOM) return { x: linearOffset, y: this.halfWidth - this.offset };
    if (side === BattlefieldSide.TOP) return { x: -linearOffset, y: -this.halfWidth + this.offset };
    if (side === BattlefieldSide.LEFT) return { x: -this.halfWidth + this.offset, y: progressiveOffset };
    if (side === BattlefieldSide.RIGHT) return { x: this.halfWidth - this.offset, y: progressiveOffset };
        return { x: 0, y: 0 };
  }

  private calculateVerticalOffset(side: BattlefieldSide, zoneIndex: number, playersOnSide: number, linearOffset: number): number {
    if (playersOnSide <= 2) return linearOffset;
    if (side !== BattlefieldSide.LEFT && side !== BattlefieldSide.RIGHT) return linearOffset;

    const totalSpace = (playersOnSide - 1) * this.playerSpacing;
    const minGap = 0.95 * this.playerSpacing;
    const distance = 2 * (this.playerSpacing - minGap) / (playersOnSide - 2);
    
    let progressiveIndex = zoneIndex;
    if (side === BattlefieldSide.RIGHT) {
      progressiveIndex = playersOnSide - 1 - zoneIndex;
    }

    let currentOffset = -totalSpace / 2;
    for (let i = 0; i < progressiveIndex; i++) {
      currentOffset += minGap + i * distance;
    }
    return currentOffset;
  }
}

export default ZoneLayout;