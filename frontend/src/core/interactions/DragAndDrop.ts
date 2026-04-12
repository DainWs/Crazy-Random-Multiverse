import { dispatchAction } from "@/core/interactions/CardInteractionDispatcher";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

type SourceGameObject = HandView | ZoneSlotView;
type TargetGameObject = ZoneSlotView | CardView;

class CardDragAndDropManager {
  private sourceGameObject: SourceGameObject | undefined;

  public onGrabCard(scene: Phaser.Scene, card: CardView) {
    if (!card.canBeClicked()) return false;
    card.stopTweens();

    scene.input.manager.canvas.style.cursor = "grabbing";
    card.applyAnimation('startDrag');

    // TODO no se hasta que punto sale rentable hacer esto (1), pero es necesario para que el drag and drop funcione correctamente
    // (1) const worldMatrix = card.getWorldTransformMatrix();
    // (1) this.originalParent = card.parentContainer || scene;
    // (1) this.originalPositionInParent = { x: card.x, y: card.y };

    // TODO: no se si esto (2) es necesario, pero es necesario para que el drag and drop funcione correctamente
    // (2) scene.add.existing(card);
    // (1) card.setPosition(worldMatrix.getX(), worldMatrix.getY());

    this.setSource(getSourceGameObjectAtCursor(scene));

    if (this.sourceGameObject instanceof HandView) {
      this.sourceGameObject.disableCardListeners();
    }
    // (1) this.setSource(this.getInteractableSourceFromParent(scene));
    return true;
  }

  /* (1)
  private getInteractableSourceFromParent(parent: Phaser.GameObjects.Container | Phaser.Scene): SourceGameObject | undefined {
    let current: any = parent;
    while (current) {
      if (current instanceof HandView || current instanceof ZoneSlotView) {
        return current as SourceGameObject;
      }
      current = current.parentContainer;
    }
    return undefined;
  }
    */

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
    if (targetGameObject.zoneSlot.canPlaceCard(cardView.card)) {
      targetGameObject?.applyAnimation('highlight_as_target');
    }
  }

  public onDragLeave(_1: Phaser.Scene, _2: CardView, targetGameObject: TargetGameObject) {
    if (targetGameObject instanceof ZoneSlotView) {
      targetGameObject?.applyAnimation('unhighlight');
    }
  }

  public onDragCard(_: Phaser.Scene, draggedCardView: CardView, dragX: number, dragY: number) {
    draggedCardView.stopTweens();
    draggedCardView.setPosition(dragX, dragY);
    console.log("card drag", draggedCardView.x, draggedCardView.y);
  }

  public onDropCard(scene: Phaser.Scene, droppedCard: CardView, targetGameObject: TargetGameObject | undefined) {
    console.log("drop ", this.sourceGameObject, " -> ", targetGameObject)

    let success = false;
    if (targetGameObject instanceof ZoneSlotView) {
      success = dispatchAction(scene, droppedCard, this.sourceGameObject, targetGameObject);
      targetGameObject.applyAnimation('unhighlight');
    }

    return success;
  }

  public onDragEnd(scene: Phaser.Scene, card: CardView) {
    scene.input.manager.canvas.style.cursor = "grab";
    
    card.resetPosition();
    card.applyAnimation('endDrag');

    if (this.sourceGameObject instanceof ZoneSlotView) {
      this.sourceGameObject?.applyAnimation('unhighlight');
    }

    if (this.sourceGameObject instanceof HandView) {
      this.sourceGameObject.enableCardListeners();
    }

    this.sourceGameObject = undefined;
  }
}

function getSourceGameObjectAtCursor(scene: Phaser.Scene): SourceGameObject | undefined {
  return getTopGameObjectAtCursor(scene, "HandView", "ZoneSlotView") as SourceGameObject | undefined;
}

export type { SourceGameObject, TargetGameObject };
export default CardDragAndDropManager;