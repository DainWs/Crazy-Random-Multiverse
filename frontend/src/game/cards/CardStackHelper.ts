import CardView from "@/game/cards/CardView";

const BEHIND_CARD_OFFSET = 20;

interface CardStackHelper {
  canStackMore(): boolean;
  stack(card: CardView): void;
  hasCardStacked(): boolean;
  getCardBehind(): CardView | undefined;
  propagatePosition(x?: number, y?: number, z?: number, w?: number): void;
  propagateDepth(depth: number): void;
  propagateOriginalPosition(x: number, y: number): void;
  propagateOriginalDepth(depth: number): void;
  propagatePositionReset(): void;
  propagateDepthReset(): void;
  propagateReset(): void;
}

export {BEHIND_CARD_OFFSET};
export default CardStackHelper;