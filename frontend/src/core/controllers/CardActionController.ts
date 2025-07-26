import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";


let sourceZoneSlot: ZoneSlotView | null = null;

function onPutCard(scene: Phaser.Scene, card: CardView, target: ZoneSlotView) {
  
}

function onMoveCard(scene: Phaser.Scene, card: CardView, source: ZoneSlotView,  target: ZoneSlotView) {
  
}

function equipCardToCombatantOnTargetZoneSlot(droppedCardView: CardView): boolean {
  if (!this.targetZoneSlot) return false;

  const targetCard = this.targetZoneSlot.getCard();
  if (!targetCard || targetCard.hasCardStacked()) return false;

  targetCard.equip(droppedCardView);
  return true;
}

function placeDroppedCardOnTargetZoneSlot(droppedCardView: CardView): boolean {
  if (!this.targetZoneSlot) return false;

  if (this.targetZoneSlot.hasCard()) {
    console.warn("Target zone slot already has a card, cannot place another one.");
    // show message: that slot already has a card
    return false;
  }

  if (this.targetZoneSlot.zoneSlot.allowedCombatant !== droppedCardView.card.type) {
    console.warn("Target zone slot does not allow this type of card.");
    // show message: that slot type is not the same
    return false;
  }

  this.targetZoneSlot.placeCard(droppedCardView);
  return true;
}

export default CardDragAndDrop;