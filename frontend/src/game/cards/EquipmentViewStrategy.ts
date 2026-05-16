import { CardView } from "@/game/cards/CardView";
import CardViewStrategy from "@/game/cards/CardViewStrategy";
import { GameScene } from "@/scenes/Game";

class EquipmentViewStrategy implements CardViewStrategy {
  public createStackHelper(_: Phaser.Scene, _2: CardView) {
    return undefined;
  }

  public createTooltip(scene: Phaser.Scene, _2: CardView) {
    return (scene as GameScene).getCardTooltipView();
  }

  public createObjects(_: Phaser.Scene, _1: CardView, _2: number, _3: number) {
    return [];
  }

  public updateObjects(_: Phaser.Scene, _1: CardView, _2: number, _3: number) {
    return;
  }
}

export default EquipmentViewStrategy;
