import type { EquipmentCard } from "@/domain/Card";
import type { CardRender } from "@/game/cards/renders/EquipmentRender";
import equipmentRender from "@/game/cards/renders/EquipmentRender";
import CardView from "@/game/cards/CardView";

class EquipmentView extends CardView {

  public constructor(scene: Phaser.Scene, equipmentCard: EquipmentCard) {
    super(scene, equipmentCard);
  }

  public override get cardRender(): CardRender {
    return equipmentRender;
  }

  public get equipment(): EquipmentCard {
    return this.card as EquipmentCard
  }
}

export default EquipmentView;