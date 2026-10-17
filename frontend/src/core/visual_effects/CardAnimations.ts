import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";

type CardAnimation = 'startDrag' | 'endDrag';
type CardAnimationApplier = ( scene: GameScene, card: CardView) => void;

function noneAnimation() {}

function startDragAnimation(scene: GameScene, cardView: CardView): void {
  scene.getCardTooltipView().hide();
  cardView.setScale(1);
  cardView.setDepth(9000);
  cardView.setAlpha(1);
}

function endDragAnimation(scene: GameScene, cardView: CardView): void {
  cardView.resetScale();
  cardView.resetDepth();
  cardView.setAlpha(1);
  scene.getCardTooltipView().hide();
}

export type { CardAnimation, CardAnimationApplier };
export { noneAnimation, startDragAnimation, endDragAnimation };