import CardStackHelper from "@/game/cards/CardStackHelper";
import { CardTooltipView } from "@/game/cards/CardTooltipView";
import { CardView } from "@/game/cards/CardView";

interface CardViewStrategy {
  createStackHelper(scene: Phaser.Scene, cardView: CardView): CardStackHelper | undefined;

  createTooltip(scene: Phaser.Scene, cardView: CardView): CardTooltipView | undefined;

  createObjects(scene: Phaser.Scene, cardView: CardView, totalCardWidth: number, totalCardHeight: number): Phaser.GameObjects.GameObject[];
}

export default CardViewStrategy;
