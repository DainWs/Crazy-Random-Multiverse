import CardView from "@/game/cards/CardView";

const BEHIND_CARD_OFFSET = 20;

interface CardStackHelper {
  canStackMore(): boolean;
  stack(card: CardView): void;
  hasCardStacked(): boolean;
  getCardBehind(): CardView | undefined;

  propagatePosition(x?: number, y?: number, z?: number, w?: number): void;
  propagateSize(width: number, height: number): void;
  propagateScale(scaleX: number, scaleY?: number): void;
  propagateDepth(depth: number): void;

  propagateOriginalPosition(x: number, y: number, z?: number, w?: number): void;
  propagateOriginalSize(width: number, height: number): void;
  propagateOriginalScale(scaleX: number, scaleY?: number): void;
  propagateOriginalDepth(depth: number): void;

  propagatePositionReset(): void;
  propagateSizeReset(): void;
  propagateScaleReset(): void;
  propagateDepthReset(): void;

  propagateReset(): void;
}

export {BEHIND_CARD_OFFSET};
export default CardStackHelper;