import type { Point2D } from '@/domain/Geometry';
import * as Constants from '@/core/Constants';

/** Pure layout of the floating texts with the damage a card received: where each one starts and where it rises to (VIEW-6). */
class DamageTextLayout {
  private readonly center: Point2D;

  /** `center` is the center of the slot of the card, in the world. */
  public constructor(center: Point2D) {
    this.center = center;
  }

  /** The texts are stacked upwards, so the armor and the health lost do not overlap. */
  public startPosition(index: number): Point2D {
    return { x: this.center.x, y: this.center.y - index * Constants.DAMAGE_TEXT_GAP };
  }

  public riseTargetY(index: number): number {
    return this.startPosition(index).y - Constants.DAMAGE_TEXT_RISE;
  }
}

export default DamageTextLayout;
