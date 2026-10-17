import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import CardAnimator from "@/core/visual_effects/CardAnimator";

class CardMouseOver {
  public onPointerOver(scene: GameScene, card: CardView): void {
    if (card.canBeClicked()) {
      scene.input.manager.canvas.style.cursor = "grab";
    }

    CardAnimator.playTween(card, 'hover');
    scene.getCardTooltipView().show(card);
  }

  public onPointerOut(scene: GameScene, card: CardView): void {
    scene.input.manager.canvas.style.cursor = "default";

    CardAnimator.playTween(card, 'unhover');
    scene.getCardTooltipView().hide();
  }
}

export default CardMouseOver;
