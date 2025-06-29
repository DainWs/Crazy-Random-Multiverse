import CardInputHandler from "@/core/interactions/CardInputHandler";
import { CardView } from "@/game/cards/CardView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

type InteractiveGameObject = ZoneSlotView;

class CardInputManager {
  
  public readonly handler: CardInputHandler;

  private readonly interactableObjects: Set<InteractiveGameObject>;
  private sourceZoneSlot: ZoneSlotView | null;
  private targetZoneSlot: ZoneSlotView | null;

  public constructor(scene: Phaser.Scene) {
    this.interactableObjects = new Set<InteractiveGameObject>();
    this.sourceZoneSlot = null;
    this.targetZoneSlot = null;

    this.handler = new CardInputHandler();
    this.handler.onGrabCallback = (card) => this.onGrabCard(scene, card);
    this.handler.onDragCallback = (card) => this.onDragCard(scene, card);
    this.handler.onDropCallback = (card) => this.onDropCard(scene, card);
  }

  public onGrabCard(scene: Phaser.Scene, _: CardView) {
    const interactiveGameObject = getInteractiveGameObjectAtCursor(scene, [...this.interactableObjects]);
    if (!interactiveGameObject || interactiveGameObject.hasCard()) {
      this.sourceZoneSlot?.applyAnimation('unhighlight');
      this.sourceZoneSlot = interactiveGameObject ?? null;
      this.sourceZoneSlot?.applyAnimation('highlight_as_source');
    }
  }

  public onDragCard(scene: Phaser.Scene, draggedCardView: CardView) {
    const interactiveGameObject = getInteractiveGameObjectAtCursor(scene, [...this.interactableObjects]);

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

  public onDropCard(_: Phaser.Scene, droppedCard: CardView) {
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
    if (!targetCard || targetCard.hasCardBehind()) return false;

    targetCard.equip(droppedCardView);
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

  public registerGameObject(gameObject: InteractiveGameObject): void {
    this.interactableObjects.add(gameObject);
  }

  public unregisterGameObject(gameObject: InteractiveGameObject): void {
    this.interactableObjects.delete(gameObject);
  }
}

function getInteractiveGameObjectAtCursor(
  scene: Phaser.Scene, 
  objects: InteractiveGameObject[], 
  exclude?: InteractiveGameObject[]
): InteractiveGameObject | undefined {
  const pointer = scene.input.activePointer;
  const camera = scene.cameras.main;
  const results: InteractiveGameObject[] = [];

  const gameObjects = objects.filter(obj => !exclude || !exclude.includes(obj));
  scene.input.manager.hitTest(pointer, gameObjects, camera, results);
  console.log(results)
  return results.find(isAInteractiveGameObject);
}

function isAInteractiveGameObject(gameObject: Phaser.GameObjects.GameObject) {
  return (
    gameObject instanceof ZoneSlotView ||
    gameObject instanceof CardView
  );
}

export default CardInputManager;