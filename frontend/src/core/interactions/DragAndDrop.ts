import { dispatchAction } from "@/core/interactions/CardInteractionDispatcher";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

type SourceGameObject = HandView | ZoneSlotView;
type TargetGameObject = ZoneSlotView | CardView;

class CardDragAndDropManager {
  private successfullyDropped: boolean | undefined;
  private sourceGameObject: SourceGameObject | undefined;
  private sourceGameObjectIndex: number | undefined;
  private targetGameObject: TargetGameObject | undefined;

  public onGrabCard(scene: Phaser.Scene, card: CardView) {
    if (!card.canBeClicked()) return false;
    card.stopTweens();

    scene.input.manager.canvas.style.cursor = "grabbing";
    card.applyAnimation('startDrag');

    this.successfullyDropped = false;

    this.setSource(getSourceGameObjectAtCursor(scene));
    this.targetGameObject = undefined;

    if (this.sourceGameObject instanceof HandView) {
      this.sourceGameObjectIndex = this.sourceGameObject.getIndex(card);
      this.sourceGameObject.remove(card);
      scene.add.existing(card);
      this.sourceGameObject.hideCards();
      this.sourceGameObject.disableCardListeners();
    }
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
    if (targetGameObject.zoneSlot.canPlaceCard(cardView.card)) {
      this.targetGameObject = targetGameObject;
      targetGameObject.previewCard(cardView);
      targetGameObject.applyAnimation('highlight_as_target');
    }
  }

  public onDragLeave(_1: Phaser.Scene, cardView: CardView, targetGameObject: TargetGameObject) {
    if (targetGameObject instanceof ZoneSlotView) {
      this.onZoneSlotDragLeave(cardView, targetGameObject);
    }
  }

  private onZoneSlotDragLeave(_: CardView, targetGameObject: ZoneSlotView) {
    if (this.targetGameObject === targetGameObject) {
      this.targetGameObject = undefined;
      targetGameObject.stopPreviewingCard();
    }
    
    targetGameObject?.applyAnimation('unhighlight');
  }

  public onDragCard(_scene: Phaser.Scene, draggedCardView: CardView, dragX: number, dragY: number) {
    if (this.targetGameObject) return;

    draggedCardView.stopTweens();
    draggedCardView.setScale(0.7);
    draggedCardView.setAngle(0);

    const activePointer = _scene.input.activePointer;
    draggedCardView.setPosition(activePointer.worldX, activePointer.worldY);
  }

  public onDropCard(scene: Phaser.Scene, droppedCard: CardView, targetGameObject: TargetGameObject | undefined) {
    if (!targetGameObject) {
      targetGameObject = getTopGameObjectAtCursor(scene, "ZoneSlotView") as TargetGameObject;
    }

    if (targetGameObject instanceof ZoneSlotView) {
      this.successfullyDropped = dispatchAction(scene, droppedCard, this.sourceGameObject, targetGameObject);
      targetGameObject.applyAnimation('unhighlight');
    }

    return this.successfullyDropped;
  }

  public onDragEnd(scene: Phaser.Scene, card: CardView) {
    scene.input.manager.canvas.style.cursor = "grab";

    if (this.sourceGameObject instanceof HandView && !this.successfullyDropped) {
      this.sourceGameObject.addAt(card, this.sourceGameObjectIndex!);
    }

    card.resetPosition();
    card.applyAnimation('endDrag');

    if (this.sourceGameObject instanceof ZoneSlotView) {
      this.sourceGameObject?.applyAnimation('unhighlight');
    }

    if (this.sourceGameObject instanceof HandView) {
      this.sourceGameObject.enableCardListeners();
    }

    this.sourceGameObject = undefined;
    this.sourceGameObjectIndex = undefined;
    this.targetGameObject = undefined;
  }
}

function getSourceGameObjectAtCursor(scene: Phaser.Scene): SourceGameObject | undefined {
  return getTopGameObjectAtCursor(scene, "HandView", "ZoneSlotView") as SourceGameObject | undefined;
}

export type { SourceGameObject, TargetGameObject };
export default CardDragAndDropManager;