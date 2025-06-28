import { GameScene } from "@/game/scenes/Game";
import { CardView } from "@/game/cards/CardView"
import ZoneSlot from "@/game/zone/ZoneSlot"
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

  public registerSlot(zoneSlot: ZoneSlot): void {
    this.cardInputManager.registerGameObject(zoneSlot);
  }

  public unregisterSlot(zoneSlot: ZoneSlot): void {
    this.cardInputManager.unregisterGameObject(zoneSlot);
  }
}

export default InteractionSystem;