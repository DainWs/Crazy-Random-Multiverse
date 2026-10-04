import type { CardRender } from "@/game/cards/CardViewStrategy";
import type CardView from "@/game/cards/CardView";

const render = (_: Phaser.Scene, _1: CardView, _2: number, _3: number) => {
  return [];
}

const update = (_: Phaser.Scene, _1: CardView, _2: number, _3: number) => {
  return;
}

const equipmentRender: CardRender = {
  render,
  update
}

export default equipmentRender;