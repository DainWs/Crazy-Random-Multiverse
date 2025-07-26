import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";

class HandInteractionManager {
  public attachListeners(handView: HandView, card: CardView) {
    card.on("pointerover", () => handView.onHoverCard(card));
    card.on("pointerout", () => handView.onUnhoverCard(card));
  }

  public deattachListeners(handView: HandView, card: CardView) {
    card.off("pointerover", () => handView.onHoverCard(card));
    card.off("pointerout", () => handView.onUnhoverCard(card));
  }
}

export default HandInteractionManager;