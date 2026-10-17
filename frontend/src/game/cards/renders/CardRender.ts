import type CardView from "@/game/cards/CardView";

interface CardRender {
  render(scene: Phaser.Scene, cardView: CardView, width: number, height: number): Phaser.GameObjects.GameObject[];
  update(scene: Phaser.Scene, cardView: CardView, width: number, height: number): void;
}

export type { CardRender }