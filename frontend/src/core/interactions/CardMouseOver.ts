import CardAnimator from "@/game/cards/CardAnimator";
import CardView from "@/game/cards/CardView";

class CardMouseOver {
  public onPointerOver(scene: Phaser.Scene, card: CardView): void {
    if (card.canBeClicked()) {
      scene.input.manager.canvas.style.cursor = "grab";
    }

    CardAnimator.playTween(card, 'hover');
    card.showTooltip();
  }

  public onPointerOut(scene: Phaser.Scene, card: CardView): void {
    scene.input.manager.canvas.style.cursor = "default";

    CardAnimator.playTween(card, 'unhover');
    card.hideTooltip();
  }
}

export default CardMouseOver;
