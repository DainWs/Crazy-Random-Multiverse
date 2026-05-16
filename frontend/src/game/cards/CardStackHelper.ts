import CardView from "@/game/cards/CardView";

const BEHIND_CARD_OFFSET = 20;

interface CardStackHelper {
  canStackMore(): boolean;
  stack(card: CardView): void;
  hasCardStacked(): boolean;
  getCardBehind(): CardView | undefined;
}

export {BEHIND_CARD_OFFSET};
export default CardStackHelper;