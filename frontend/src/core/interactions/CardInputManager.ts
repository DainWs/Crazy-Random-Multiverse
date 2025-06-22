import CardInputHandler from "@/core/interactions/CardInputHandler";
import { CardView } from "@/game/cards/CardView";
import ZoneSlot from "@/game/zone/ZoneSlot";

type InteractiveGameObject = ZoneSlot;

class CardInputManager {
  
  public readonly handler: CardInputHandler;

  private readonly zoneSlots: Set<ZoneSlot>;
  private sourceZoneSlot: ZoneSlot | null;
  private targetZoneSlot: ZoneSlot | null;

  public constructor(scene: Phaser.Scene) {
    this.zoneSlots = new Set<ZoneSlot>();
    this.sourceZoneSlot = null;
    this.targetZoneSlot = null;

    this.handler = new CardInputHandler();
    this.handler.onGrabCallback = (card) => this.onGrabCard(scene, card);
    this.handler.onDragCallback = (card) => this.onDragCard(scene, card);
    this.handler.onDropCallback = (card) => this.onDropCard(scene, card);
  }

  public onGrabCard(scene: Phaser.Scene, card: CardView) {
    console.log("changed dragged card to " + card);
    const interactiveGameObject = getInteractiveGameObjectAtCursor(scene, [...this.zoneSlots]);
    console.log(interactiveGameObject);

    if (!interactiveGameObject || interactiveGameObject.hasCard()) {
      this.sourceZoneSlot?.clearHighlight();
      this.sourceZoneSlot = interactiveGameObject as ZoneSlot ?? null;
    }

    if (this.targetZoneSlot && !this.targetZoneSlot.hasCard()) {
      this.targetZoneSlot.highlight(); // TODO change to leaveHighligth or something
    }
  }

  public onDragCard(scene: Phaser.Scene, a: CardView) {
    console.log(a)
    const interactiveGameObject = getInteractiveGameObjectAtCursor(scene, [...this.zoneSlots]);
    console.log(interactiveGameObject);

    if (!interactiveGameObject || !interactiveGameObject.hasCard()) {
      this.targetZoneSlot?.clearHighlight();
      this.targetZoneSlot = interactiveGameObject as ZoneSlot ?? null;
    }

    if (this.targetZoneSlot && !this.targetZoneSlot.hasCard()) {
      this.targetZoneSlot.highlight();
    }
  }

  public onDropCard(_: Phaser.Scene, droppedCard: CardView) {
    if (this.sourceZoneSlot) {
      this.sourceZoneSlot.clearCard();
    }

    const successfullyPlaced = this.placeDroppedCardInTargetZoneSlot(droppedCard);
    if (!successfullyPlaced) {
      droppedCard.resetPosition();
    }

    if (!successfullyPlaced && this.sourceZoneSlot) {
      this.sourceZoneSlot.placeCard(droppedCard);
    }

    this.sourceZoneSlot?.clearHighlight();
    this.sourceZoneSlot = null;

    this.targetZoneSlot?.clearHighlight();
    this.targetZoneSlot = null;
  }

  private placeDroppedCardInTargetZoneSlot(droppedCard: CardView) {
    if (!this.targetZoneSlot) {
      return false;
    }

    if (this.targetZoneSlot.hasCard()) {
      // show message: that slot already has a card
      return false;
    }

    this.targetZoneSlot.placeCard(droppedCard);
    return true;
  }

  public registerSlot(slot: ZoneSlot): void {
    this.zoneSlots.add(slot)
  }

  public unregisterSlot(slot: ZoneSlot): void {
    this.zoneSlots.delete(slot)
  }
}

function getInteractiveGameObjectAtCursor(scene: Phaser.Scene, gameObjects: Phaser.GameObjects.GameObject[]) {
  const pointer = scene.input.activePointer;
  const camera = scene.cameras.main;
  const results: Phaser.GameObjects.GameObject[] = [];

  scene.input.manager.hitTest(pointer, gameObjects, camera, results);
  console.log(results)
  return results.find(isAInteractiveGameObject) as InteractiveGameObject ?? null;
}

function isAInteractiveGameObject(gameObject: Phaser.GameObjects.GameObject) {
  return (
    gameObject instanceof ZoneSlot
  );
}

export default CardInputManager;