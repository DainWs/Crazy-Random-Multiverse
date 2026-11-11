import type { CardRender } from "@/game/cards/renders/CardRender";
import * as TextUtils from "@/game/utils/TextUtils";
import SpellView from "@/game/cards/SpellView";

const render = (scene: Phaser.Scene, cardView: SpellView, width: number, height: number) => {
  return [
    ...defineDescriptionStat(scene, width, height, cardView.spell.description)
  ];
}

function defineDescriptionStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, description: string) {
  const bottomPadding = totalHeight * 0.025;
  const width = totalWidth * 0.85;
  const height = totalHeight * 0.3;
  const x = 0;
  const y = totalHeight / 2 - (height / 2 + bottomPadding) - totalHeight * 0.02;

  const gameObjects: Phaser.GameObjects.GameObject[] = [];
  const descriptionText = scene.add.text(0, 0, description);
  descriptionText.setColor('#000');
  descriptionText.setWordWrapWidth(width, true);
  descriptionText.setFixedSize(width, height);
  descriptionText.setOrigin(0.5, 0.5);
  TextUtils.fitText(descriptionText, width, height);

  const textContainer = scene.add.container(x, y, gameObjects);
  textContainer.setSize(width, height);
  textContainer.add(descriptionText);
  gameObjects.push(textContainer);
  return gameObjects;
}

const update = (_: Phaser.Scene, _1: SpellView, _2: number, _3: number) => {
  return;
}

const spellRender: CardRender = {
  render,
  update
}

export type { CardRender };
export default spellRender;