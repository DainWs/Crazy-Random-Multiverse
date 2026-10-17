import type { GameScene } from "@/scenes/Game";
import type CardView from "@/game/cards/CardView";
import { dispatchAction } from "@/core/interactions/CardInteractionDispatcher";
import { getTopGameObjectAtCursor } from "@/core/interactions/InteractiveObjectManager";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import CombatantView from "@/game/cards/CombatantView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

type SourceGameObject = HandView | ZoneSlotView;
type TargetGameObject = ZoneSlotView | CardView;

class CardDragAndDropManager {
  private successfullyDropped: boolean | undefined;
  private sourceGameObject: SourceGameObject | undefined;
  private sourceGameObjectIndex: number | undefined;
  private targetGameObject: TargetGameObject | undefined;

  // On grab card

  public onGrabCard(scene: GameScene, card: CardView) {
    if (!card.canBeClicked()) return false;
    scene.tweens.killTweensOf(card);

    scene.input.manager.canvas.style.cursor = "grabbing";
    CardAnimator.playAnimation(scene, card, 'startDrag');

    this.successfullyDropped = false;

    this.setSource(getSourceGameObjectAtCursor(scene));
    this.targetGameObject = undefined;

    if (this.sourceGameObject) {
      this.sourceGameObjectIndex = this.sourceGameObject.getIndex(card);
      this.sourceGameObject.remove(card);
      scene.add.existing(card);
    }

    if (this.sourceGameObject instanceof HandView) {
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

  // Drag enter

  public onDragEnter(_: GameScene, cardView: CardView, targetGameObject: TargetGameObject) {
    if (!targetGameObject) return false;
    if (targetGameObject === this.sourceGameObject) return false;
  
    if (cardView instanceof CombatantView && targetGameObject instanceof ZoneSlotView) {
      this.onZoneSlotDragEnter(cardView, targetGameObject);
    }
  }

  private onZoneSlotDragEnter(cardView: CombatantView, targetGameObject: ZoneSlotView) {
    if (targetGameObject.zoneSlot.canPlaceCard(cardView.card)) {
      this.targetGameObject = targetGameObject;
      targetGameObject.previewCard(cardView);
      targetGameObject.applyAnimation('highlight_as_target');
    }
  }

  // Drag leave

  public onDragLeave(_1: GameScene, cardView: CardView, targetGameObject: TargetGameObject) {
    if (cardView instanceof CombatantView && targetGameObject instanceof ZoneSlotView) {
      this.onZoneSlotDragLeave(cardView, targetGameObject);
    }
  }

  private onZoneSlotDragLeave(_: CombatantView, targetGameObject: ZoneSlotView) {
    if (this.targetGameObject === targetGameObject) {
      this.targetGameObject = undefined;
      targetGameObject.stopPreviewingCard();
    }
    
    targetGameObject?.applyAnimation('unhighlight');
  }

  // On drag

  public onDragCard(scene: GameScene, draggedCardView: CardView, _dragX: number, _dragY: number) {
    if (this.targetGameObject) return;
    scene.tweens.killTweensOf(draggedCardView);
    draggedCardView.setScale(0.7);
    draggedCardView.setAngle(0);

    const activePointer = scene.input.activePointer;
    draggedCardView.setPosition(activePointer.worldX, activePointer.worldY);
  }

  // On drop

  public onDropCard(scene: GameScene, droppedCard: CardView, targetGameObject: TargetGameObject | undefined) {
    if (!targetGameObject) {
      targetGameObject = getTopGameObjectAtCursor(scene, "ZoneSlotView") as TargetGameObject;
    }

    if (targetGameObject instanceof ZoneSlotView) {
      this.successfullyDropped = dispatchAction(scene, droppedCard, this.sourceGameObject, targetGameObject);
      targetGameObject.applyAnimation('unhighlight');
    }

    return this.successfullyDropped;
  }

  // On drag end

  public onDragEnd(scene: GameScene, card: CardView) {
    scene.input.manager.canvas.style.cursor = "grab";

    if (this.sourceGameObject && !this.successfullyDropped) {
      this.sourceGameObject.addAt(card, this.sourceGameObjectIndex!);
    }

    CardAnimator.playAnimation(scene, card, 'endDrag');
    card.reset();

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

function getSourceGameObjectAtCursor(scene: GameScene): SourceGameObject | undefined {
  return getTopGameObjectAtCursor(scene, "HandView", "ZoneSlotView") as SourceGameObject | undefined;
}

export type { SourceGameObject, TargetGameObject };
export default CardDragAndDropManager;