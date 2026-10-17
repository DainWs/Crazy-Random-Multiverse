import type { CardRender } from "@/game/cards/renders/CardRender";
import type EquipmentView from "@/game/cards/EquipmentView";

const render = (_: Phaser.Scene, _1: EquipmentView, _2: number, _3: number) => {
  return [];
}

const update = (_: Phaser.Scene, _1: EquipmentView, _2: number, _3: number) => {
  return;
}

const equipmentRender: CardRender = {
  render,
  update
}

export type { CardRender };
export default equipmentRender;