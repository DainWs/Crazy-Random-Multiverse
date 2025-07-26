import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardView from "@/game/cards/CardView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

/** @deprecated */
class CardDragAndDrop {
  private sourceZoneSlot: ZoneSlotView | null;
  private targetZoneSlot: ZoneSlotView | null;

  public constructor() {
    this.sourceZoneSlot = null;
    this.targetZoneSlot = null;
  }

  public onGrabCard(scene: Phaser.Scene, card: CardView) {
    if (!card.canBeClicked()) {
      return;
    }

    scene.input.manager.canvas.style.cursor = "grabbing";

    const interactiveGameObject = getTopGameObjectAtCursor(scene, 'ZoneSlotView') as ZoneSlotView | undefined;
    if (!interactiveGameObject || interactiveGameObject.hasCard()) {
      this.sourceZoneSlot?.applyAnimation('unhighlight');
      this.sourceZoneSlot = interactiveGameObject ?? null;
      this.sourceZoneSlot?.applyAnimation('highlight_as_source');
    }
  }

  public onDragCard(scene: Phaser.Scene, draggedCardView: CardView, dragX: number, dragY: number) {
    draggedCardView.setPosition(dragX, dragY);

    const interactiveGameObject = getTopGameObjectAtCursor(scene, 'ZoneSlotView') as ZoneSlotView | undefined;
    this.targetZoneSlot?.applyAnimation('unhighlight');
    this.targetZoneSlot = interactiveGameObject ?? null;
    if (this.shouldHighlightTargetZoneSlot(draggedCardView)) {
      this.targetZoneSlot?.applyAnimation('highlight_as_target');
    }
  }

  private shouldHighlightTargetZoneSlot(cardView: CardView): boolean {
    if (!this.targetZoneSlot) return false;
    if (this.targetZoneSlot.hasCard()) return false;
    if (this.targetZoneSlot === this.sourceZoneSlot) return false;
    return this.targetZoneSlot.zoneSlot.allowedCombatant === cardView.card.type;
  }

  public onDropCard(scene: Phaser.Scene, droppedCard: CardView) {
    scene.input.manager.canvas.style.cursor = "grab";
    droppedCard.applyAnimation('endDrag');

    if (this.sourceZoneSlot) {
      this.sourceZoneSlot.clearCard();
    }

    const actionSuccess = this.dispatchDroppedCardAction(droppedCard);
    if (!actionSuccess) {
      droppedCard.resetPosition();
    }

    if (!actionSuccess && this.sourceZoneSlot) {
      this.sourceZoneSlot.placeCard(droppedCard);
    }

    if (actionSuccess && !this.sourceZoneSlot) {
      droppedCard.playSoundForAction('put');
    }

    this.sourceZoneSlot?.applyAnimation('unhighlight');
    this.sourceZoneSlot = null;

    this.targetZoneSlot?.applyAnimation('unhighlight');
    this.targetZoneSlot = null;
  }

  private dispatchDroppedCardAction(droppedCardView: CardView) {
    if (droppedCardView.card.isType('EQUIPMENT')) {
      return this.equipCardToCombatantOnTargetZoneSlot(droppedCardView);
    }

    if (droppedCardView.card.isCombatant()) {
      return this.placeDroppedCardOnTargetZoneSlot(droppedCardView);
    }
  
    return false;
  }
  
  private equipCardToCombatantOnTargetZoneSlot(droppedCardView: CardView): boolean {
    if (!this.targetZoneSlot) return false;
  
    const targetCard = this.targetZoneSlot.getCard();
    if (!targetCard || targetCard.hasCardStacked()) return false;

    targetCard.stack(droppedCardView);
    return true;
  }

  private placeDroppedCardOnTargetZoneSlot(droppedCardView: CardView): boolean {
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
}

export default CardDragAndDrop;