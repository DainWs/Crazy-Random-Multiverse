import { GameScene } from "@/game/scenes/Game";
import { CardView } from "@/game/cards/CardView"
import ZoneSlot from "@/game/zone/ZoneSlot"
import CardInputManager from "@/core/interactions/CardInputManager";

class InteractionSystem {
  private readonly scene: GameScene;
  private readonly cards: Set<CardView>;

  private cardInputManager: CardInputManager;

  public constructor(scene: GameScene) {
    this.scene = scene;
    this.cards = new Set<CardView>();

    this.cardInputManager = new CardInputManager(scene);
  }

  public registerCard(card: CardView): void {
    this.cards.add(card)
    this.cardInputManager.handler.handleCardInputs(this.scene, card);
  }

  public unregisterCard(card: CardView): void {
    this.cards.delete(card)
    this.cardInputManager.handler.removeHandledCard(this.scene, card);
  }

  public registerSlot(zoneSlot: ZoneSlot): void {
    this.cardInputManager.registerSlot(zoneSlot);
  }

  public unregisterSlot(zoneSlot: ZoneSlot): void {
    this.cardInputManager.unregisterSlot(zoneSlot);
  }
}

export default InteractionSystem;