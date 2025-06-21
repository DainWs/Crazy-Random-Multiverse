import resolveCardAnimation, { CardAnimation } from "@/core/visual_effects/CardAnimations";
import resolveCardTween, { CardTween } from "@/core/visual_effects/CardTweens";
import { CardView } from "@/game/cards/CardView";
import { GameScene } from "@/game/scenes/Game";

class VisualEffectSystem {
  private readonly scene: GameScene;

  public constructor(scene: GameScene) {
    this.scene = scene;
  }

  public applyAnimationToCard(card: CardView, animation: CardAnimation) {
    const animationApplier = resolveCardAnimation(animation);
    animationApplier(card);
  }

  public applyTweenToCard(card: CardView, tween: CardTween) {
    const tweenProvider = resolveCardTween(tween);
    this.scene.tweens.add(tweenProvider(card));
  }
  
}

export default VisualEffectSystem;