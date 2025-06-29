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
      this.sourceZoneSlot?.clearHighlight();
      this.sourceZoneSlot = interactiveGameObject ?? null;
      this.sourceZoneSlot?.highlight();
    }
  }

  public onDragCard(scene: Phaser.Scene, draggedCard: CardView) {
    const interactiveGameObject = getInteractiveGameObjectAtCursor(scene, [...this.interactableObjects]);

    this.targetZoneSlot?.clearHighlight();
    this.targetZoneSlot = interactiveGameObject ?? null;
    if (this.shouldHighlightTargetZoneSlot(draggedCard)) {
      this.targetZoneSlot?.highlight();
    }
  }

  private shouldHighlightTargetZoneSlot(card: CardView): boolean {
    if (!this.targetZoneSlot) return false;
    if (this.targetZoneSlot.hasCard()) return false;
    return this.targetZoneSlot.definition.allowedCombatant === card.definition.type;
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

    this.sourceZoneSlot?.clearHighlight();
    this.sourceZoneSlot = null;

    this.targetZoneSlot?.clearHighlight();
    this.targetZoneSlot = null;
  }

  private dispatchDroppedCardAction(droppedCard: CardView) {
    if (droppedCard.definition.isType('EQUIPMENT')) {
      return this.equipCardToCombatantOnTargetZoneSlot(droppedCard);
    }

    if (droppedCard.definition.isCombatant()) {
      return this.placeDroppedCardOnTargetZoneSlot(droppedCard);
    }
  
    return false;
  }
  
  private equipCardToCombatantOnTargetZoneSlot(droppedCard: CardView): boolean {
    if (!this.targetZoneSlot) return false;
  
    const targetCard = this.targetZoneSlot.getCard();
    if (!targetCard || targetCard.hasCardBehind()) return false;

    targetCard.applyCardEffects(droppedCard);
    return true;
  }

  private placeDroppedCardOnTargetZoneSlot(droppedCard: CardView): boolean {
    if (!this.targetZoneSlot) return false;
  
    if (this.targetZoneSlot.hasCard()) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      // show message: that slot already has a card
      return false;
    }

    if (this.targetZoneSlot.definition.allowedCombatant !== droppedCard.definition.type) {
      console.warn("Target zone slot does not allow this type of card.");
      // show message: that slot type is not the same
      return false;
    }

    this.targetZoneSlot.placeCard(droppedCard);
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