import type CardView from "@/game/cards/CardView";

interface CardTooltip {
  show(cardView: CardView): void;
  /** The pointer left the card: the panel waits and then closes. */
  hide(): void;
  /** The panel closes without waiting. */
  close(): void;
}

export type { CardTooltip }