import CardView from "@/game/cards/CardView";

// TODO this is probably useless
interface CardPlacementZone {
  placeCard(cardView: CardView): boolean;
  removeCard(): boolean;
  hasCard(card?: CardView): boolean;
  getCard(): CardView | null;
}

export default CardPlacementZone;