import EventSystem from "@/core/EventSystem";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import ActionTrigger from "@/domain/ActionTrigger";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

type SourceGameObject = HandView | ZoneSlotView;
type TargetGameObject = ZoneSlotView | CardView;

class CardDragAndDropManager {
  private sourceGameObject: SourceGameObject | undefined;
  //private targetGameObject: TargetGameObject | undefined;

  public onGrabCard(scene: Phaser.Scene, card: CardView) {
    if (!card.canBeClicked()) return false;
    card.applyAnimation('startDrag');

    this.setSource(getSourceGameObjectAtCursor(scene));
    return true;
  }

  private setSource(source: SourceGameObject | undefined) {
    if (this.sourceGameObject instanceof ZoneSlotView) {
      this.sourceGameObject?.applyAnimation('unhighlight');
    }

    this.sourceGameObject = source;

    if (this.sourceGameObject instanceof ZoneSlotView) {
      this.sourceGameObject?.applyAnimation('highlight_as_source');
    }
  }

  public onDragEnter(_: Phaser.Scene, card: CardView, targetGameObject: TargetGameObject) {
    if (!targetGameObject) return false;
    if (targetGameObject === this.sourceGameObject) return false;
  
    if (targetGameObject instanceof ZoneSlotView) {
      this.onZoneSlotDragEnter(card, targetGameObject);
    }
  }

  private onZoneSlotDragEnter(cardView: CardView, targetGameObject: ZoneSlotView) {
    const hasAlreadyACard = targetGameObject.hasCard();
    const isCardAllowedByZoneSlot = targetGameObject.zoneSlot.allowedCombatant === cardView.card.type;
    if (hasAlreadyACard && isCardAllowedByZoneSlot) {
      targetGameObject?.applyAnimation('highlight_as_target');
    }
  }

  public onDragLeave(_1: Phaser.Scene, _2: CardView, targetGameObject: TargetGameObject) {
    if (targetGameObject instanceof ZoneSlotView) {
      targetGameObject?.applyAnimation('unhighlight');
    }
  }

  public onDragCard(_: Phaser.Scene, draggedCardView: CardView, dragX: number, dragY: number) {
    draggedCardView.setPosition(dragX, dragY);
  }

  public onDropCard(scene: Phaser.Scene, droppedCard: CardView, targetGameObject: TargetGameObject | undefined) {
    scene.input.manager.canvas.style.cursor = "grab";
    droppedCard.applyAnimation('endDrag');

    if (!targetGameObject) return false;
    if (targetGameObject instanceof ZoneSlotView) {
      return this.onZoneSlotDropCard(droppedCard, targetGameObject);
    }
  
    // TODO haz un buen dispatcher para las siguientes acciones: put, move, equip
    // el resultado del dispatcher, es decir, la accion a realizar, es posible que se realize en CardController
    this.sourceGameObject = undefined;
  }

  private onZoneSlotDropCard(droppedCardView: CardView, targetGameObject: ZoneSlotView) {

    if (droppedCardView.card.isType('EQUIPMENT')) {
      //return this.equipCardToCombatantOnTargetZoneSlot(droppedCardView);
    }
  
    if (droppedCardView.card.isCombatant()) {
      //return this.placeDroppedCardOnTargetZoneSlot(droppedCardView);
    }

    if (this.sourceGameObject instanceof ZoneSlotView) {
      this.sourceGameObject?.applyAnimation('unhighlight');
    }
    return false;
  }

  private dispatchDroppedCardAction(droppedCardView: CardView) {
    if (droppedCardView.card.isType('EQUIPMENT')) {
      //return this.equipCardToCombatantOnTargetZoneSlot(droppedCardView);
    }
  
    if (droppedCardView.card.isCombatant()) {
      //return this.placeDroppedCardOnTargetZoneSlot(droppedCardView);
    }
  
    return false;
  }
}

function getSourceGameObjectAtCursor(scene: Phaser.Scene): SourceGameObject | undefined {
  return getTopGameObjectAtCursor(scene, "HandView", "ZoneSlotView") as SourceGameObject | undefined;
}

export type { SourceGameObject, TargetGameObject };
export default CardDragAndDropManager;