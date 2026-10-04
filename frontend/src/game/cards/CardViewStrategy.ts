import type { CardStackLayoutHelper } from "@/game/cards/CardStackLayoutHelper";
import CardView from "@/game/cards/CardView";
import Phaser from "phaser";

interface CardTooltip {
  show(cardView: CardView): void;
  hide(): void;
}

interface CardRender {
  render(scene: Phaser.Scene, cardView: CardView, width: number, height: number): Phaser.GameObjects.GameObject[];
  update(scene: Phaser.Scene, cardView: CardView, width: number, height: number): void;
}

interface CardViewStrategy {
  createStackLayoutHelper(scene: Phaser.Scene, cardView: CardView): CardStackLayoutHelper | undefined;

  createTooltip(scene: Phaser.Scene, cardView: CardView): CardTooltip | undefined;

  createRender(): CardRender;
}

export type { CardStackLayoutHelper, CardTooltip, CardRender }
export default CardViewStrategy;
