import type CardView from "@/game/cards/CardView";
import type HandView from "@/game/hand/HandView";

type InteractionHandler = {
  over: () => void;
  out: () => void;
}

class HandInteractionManager {
  private handlers = new Map<CardView, InteractionHandler>();

  public attachListeners(handView: HandView, card: CardView) {
    const over = () => handView.onHoverCard(card);
    const out = () => handView.onUnhoverCard(card);

    card.on("pointerover", over);
    card.on("pointerout", out);

    this.handlers.set(card, { over, out });
  }

  public deattachListeners(_: HandView, card: CardView) {
    const cardHandlers = this.handlers.get(card);
    if (cardHandlers) {
      card.off("pointerover", cardHandlers.over);
      card.off("pointerout", cardHandlers.out);
      this.handlers.delete(card);
    }
  }
}

export default HandInteractionManager;