import { showDebugBoxes } from "@/env";
import { CardView } from "@/game/cards/CardView";
import CardViewStrategy from "@/game/cards/CardViewStrategy";
import * as TextUtils from "@/game/utils/TextUtils";

class SpellViewStrategy implements CardViewStrategy {
  public createTooltip(_: Phaser.Scene, _2: CardView) {
    return undefined;
  }

  public createObjects(scene: Phaser.Scene, card: CardView, totalWidth: number, totalHeight: number) {
    return [
      ...this.defineDamageStat(scene, totalWidth, totalHeight, card.definition.description)
    ];
  }

  private defineDamageStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, description: string) {
    const bottomPadding = totalHeight * 0.025;
    const width = totalWidth * 0.85;
    const height = totalHeight * 0.3;
    const x = 0;
    const y = totalHeight / 2 - (height / 2 + bottomPadding) - totalHeight * 0.02;

    const gameObjects = [];
    if (showDebugBoxes || true) {
      const descriptionBox = scene.add.rectangle(x, y);
      descriptionBox.setSize(width, height);
      descriptionBox.setFillStyle(0xFF0000, 0.5);
      descriptionBox.setStrokeStyle(1, 0x000000);
      gameObjects.push(descriptionBox);
    }

    const descriptionText = scene.add.text(0, 0, description);
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
}

export default SpellViewStrategy;
