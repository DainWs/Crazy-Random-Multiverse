import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { CardView } from "@/game/cards/CardView";

interface CardViewStrategy {
  createTooltip(scene: Phaser.Scene, cardView: CardView): CardTooltipView | undefined;

  createObjects(scene: Phaser.Scene, cardView: CardView, totalCardWidth: number, totalCardHeight: number): Phaser.GameObjects.GameObject[];
}

export default CardViewStrategy;
