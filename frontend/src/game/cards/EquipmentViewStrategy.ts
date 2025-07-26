import { CardView } from "@/game/cards/CardView";
import CardViewStrategy from "@/game/cards/CardViewStrategy";

class EquipmentViewStrategy implements CardViewStrategy {
  public createStackHelper(_: Phaser.Scene, _2: CardView) {
    return undefined;
  }

  public createTooltip(_: Phaser.Scene, _2: CardView) {
    return undefined;
  }

  public createObjects(_: Phaser.Scene, _1: CardView, _2: number, _3: number) {
    return [];
  }
}

export default EquipmentViewStrategy;
