import type CardView from "@/game/cards/CardView";

interface CardTooltip {
  show(cardView: CardView): void;
  hide(): void;
}

export type { CardTooltip }