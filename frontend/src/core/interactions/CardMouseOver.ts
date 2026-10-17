import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import CardAnimator from "@/core/visual_effects/CardAnimator";

const onPointerOver = (scene: GameScene, card: CardView) => {
  if (card.canBeClicked()) {
    scene.input.manager.canvas.style.cursor = "grab";
  }

  CardAnimator.playTween(card, 'hover');
  scene.getCardTooltipView().show(card);
}

const onPointerOut = (scene: GameScene, card: CardView) => {
  scene.input.manager.canvas.style.cursor = "default";

  CardAnimator.playTween(card, 'unhover');
  scene.getCardTooltipView().hide();
}

const CardMouseOver = {
  onPointerOver,
  onPointerOut
}

export default CardMouseOver;
