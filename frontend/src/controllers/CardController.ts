import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { GameScene } from "@/scenes/Game";


class CardController {
  private readonly scene: GameScene;

  public constructor(scene: GameScene) {
    this.scene = scene;
  }

  public putCardOnZoneSlot(cardView: CardView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (zoneSlotView.getCard() !== null) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      return false;
    }

    if (!zoneSlotView.zoneSlot.canPlaceCard(cardView.card)) {
      console.warn("Target zone slot does not allow this type of card.");
      return false;
    }

    handView.removeCard(cardView);
    zoneSlotView.setCard(cardView);
    // TODO propagar evento al backend
    return true;
  }

  public moveCardOnZoneSlot(card: CardView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (fromZoneSlot.getCard() === null) {
      console.warn("Source zone slot does not have a card.");
      return false;
    }

    if (fromZoneSlot.getCard() !== card) {
      console.warn("Source zone slot does not have the card to move.");
      return false;
    }

    if (toZoneSlot.getCard() !== null) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      return false;
    }

    if (!toZoneSlot.zoneSlot.canPlaceCard(card.card)) {
      console.warn("Target zone slot does not allow this type of card.");
      return false;
    }

    fromZoneSlot.setCard(null);
    toZoneSlot.setCard(card);
    // TODO propagar evento al backend
    return true;
  }

  public equipCardToCombatant(equipmentCardView: CardView, targetCardView: CardView, sourceHandView: HandView, targetZoneSlotView: ZoneSlotView) {
    if (targetZoneSlotView.getCard() === null) {
      console.warn("Target zone slot does not have a card.");
      return false;
    }

    if (targetCardView.card.isType('EQUIPMENT')) {
      console.warn("Target card is an equipment card, cannot equip another equipment card to it.");
      return false;
    }

    sourceHandView.removeCard(equipmentCardView);
    targetCardView.stack(equipmentCardView);
    // TODO propagar evento al backend
    return true;
  }
}

export default CardController;