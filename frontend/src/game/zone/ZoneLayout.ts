import Battlefield, { BattlefieldSide } from "@/domain/Battlefield";
import { Point2D } from "@/domain/Geometry";

const PLAYER_ZONE_HALF_HEIGHT = 470;
const PLAYER_ZONE_HALF_WIDTH = 320;
/** Space kept between the inner edges of two zones that face each other, in board units. */
const MIN_FACING_ZONES_GAP = 400;
/** Space kept between a zone of a side and the zones of the sides next to it, in board units. */
const MIN_SIDE_CLEARANCE = 100;
/** Space kept between two zones of the same side, in board units. */
const MIN_NEIGHBOR_ZONES_GAP = 100;
const MAX_ZONE_SCALE = 1.5;
/** The scale of the zones is rounded down to a multiple of this, so a tiny gain does not change the layout. */
const ZONE_SCALE_STEP = 0.05;

class ZoneLayout {
  private battlefield: Battlefield;
  private playerSpacing: number;
  private halfWidth: number;
  private offset: number;
  private zoneScale: number;

  private enemySideIterator: BattlefieldSide[];
  private playersOnSide: Record<BattlefieldSide, number>;

  public constructor(battlefield: Battlefield, enemySideIterator: BattlefieldSide[]) {
    this.battlefield = battlefield;
    this.enemySideIterator = enemySideIterator;
    this.playerSpacing = battlefield.playerSpacing;
    this.halfWidth = battlefield.getSideSize() / 2;
    this.playersOnSide = this.calculatePlayersOnSide();
    this.zoneScale = this.calculateZoneScale();
    this.offset = this.calculateEdgeMargin() + PLAYER_ZONE_HALF_HEIGHT * this.zoneScale;
  }

  /** How much bigger than their base size the zones are drawn: with few players the table has room to spare (VIEW-2). */
  public getZoneScale(): number {
    return this.zoneScale;
  }

  private calculateEdgeMargin(): number {
    return this.battlefield.skin.gridStep * 2;
  }

  private calculateZoneScale(): number {
    const hasEnemies = this.battlefield.enemyZones.length > 0;
    const limits = [hasEnemies ? MAX_ZONE_SCALE : 1, this.calculateNeighborsLimit()];
    if (hasEnemies) {
      limits.push(this.calculateFacingLimit(), this.calculateAdjacentSidesLimit());
    }

    const scale = Math.max(1, Math.min(...limits));
    return Math.floor(scale / ZONE_SCALE_STEP) * ZONE_SCALE_STEP;
  }

  /** The zones of opposite sides must leave a gap between them. */
  private calculateFacingLimit(): number {
    const available = this.halfWidth - this.calculateEdgeMargin();
    return (available - MIN_FACING_ZONES_GAP / 2) / (2 * PLAYER_ZONE_HALF_HEIGHT);
  }

  /** The zones of the left and right sides must not reach the zones of the top and bottom ones. */
  private calculateAdjacentSidesLimit(): number {
    const hasSideZones = this.playersOnSide[BattlefieldSide.LEFT] + this.playersOnSide[BattlefieldSide.RIGHT] > 0;
    const widestRow = Math.max(this.playersOnSide[BattlefieldSide.TOP], this.playersOnSide[BattlefieldSide.BOTTOM]);
    const rowSpread = ((widestRow - 1) / 2) * this.playerSpacing;
    const available = this.halfWidth - this.calculateEdgeMargin();

    return hasSideZones ? (available - MIN_SIDE_CLEARANCE - rowSpread) / (2 * PLAYER_ZONE_HALF_HEIGHT + PLAYER_ZONE_HALF_WIDTH) : MAX_ZONE_SCALE;
  }

  /** The zones of one side are `playerSpacing` apart, so they cannot grow past it. */
  private calculateNeighborsLimit(): number {
    const widestSide = Math.max(...Object.values(this.playersOnSide));
    return widestSide > 1 ? (this.playerSpacing - MIN_NEIGHBOR_ZONES_GAP) / (2 * PLAYER_ZONE_HALF_WIDTH) : MAX_ZONE_SCALE;
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