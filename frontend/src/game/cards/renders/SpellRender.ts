import type { CardRender } from "@/game/cards/CardViewStrategy";
import type CardView from "@/game/cards/CardView";
import { showDebugBoxes } from "@/env";
import * as TextUtils from "@/game/utils/TextUtils";

const render = (scene: Phaser.Scene, cardView: CardView, width: number, height: number) => {
  return [
    ...defineDescriptionStat(scene, width, height, cardView.card.description)
  ];
}

function defineDescriptionStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, description: string) {
  const bottomPadding = totalHeight * 0.025;
  const width = totalWidth * 0.85;
  const height = totalHeight * 0.3;
  const x = 0;
  const y = totalHeight / 2 - (height / 2 + bottomPadding) - totalHeight * 0.02;

  const gameObjects = [];
  if (showDebugBoxes) {
    const descriptionBox = scene.add.rectangle(x, y);
    descriptionBox.setSize(width, height);
    descriptionBox.setFillStyle(0xFF0000, 0.5);
    descriptionBox.setStrokeStyle(1, 0x000000);
    gameObjects.push(descriptionBox);
  }

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

const update = (_: Phaser.Scene, _1: CardView, _2: number, _3: number) => {
  return;
}

const spellRender: CardRender = {
  render,
  update
}

export default spellRender;