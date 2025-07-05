import { GameScene } from "@/scenes/Game";
import { CardView } from "@/game/cards/CardView"
import ZoneSlotView from "@/game/zone/ZoneSlotView"
import CardInputManager from "@/core/interactions/CardInputManager";

class InteractionSystem {
  private readonly scene: GameScene;
  private cardInputManager: CardInputManager;

  public constructor(scene: GameScene) {
    this.scene = scene;
    this.cardInputManager = new CardInputManager(scene);
  }

  public registerCard(card: CardView): void {
    //this.cardInputManager.registerGameObject(card);
    this.cardInputManager.handler.handleCardInputs(this.scene, card);
  }

  public unregisterCard(card: CardView): void {
    //this.cardInputManager.unregisterGameObject(card);
    this.cardInputManager.handler.removeHandledCard(this.scene, card);
  }

  public registerSlot(zoneSlot: ZoneSlotView): void {
    this.cardInputManager.registerGameObject(zoneSlot);
  }

  public unregisterSlot(zoneSlot: ZoneSlotView): void {
    this.cardInputManager.unregisterGameObject(zoneSlot);
  }
}

export default InteractionSystem;