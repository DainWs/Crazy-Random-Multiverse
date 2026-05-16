import { showDebugBoxes } from "@/env";
import { CardStatisticView } from "@/game/cards/CardStatisticView";
import CardView from "@/game/cards/CardView";
import * as TextUtils from "@/game/utils/TextUtils";
import CardViewStrategy from "@/game/cards/CardViewStrategy";
import CombatantStackHelper from "@/game/cards/CombatantStackHelper";
import { GameScene } from "@/scenes/Game";
import Card from "@/domain/Card";
import { StatisticType } from "@/domain/Statistics";

class CombatantViewStrategy implements CardViewStrategy {
  public createStackHelper(_: Phaser.Scene, cardView: CardView) {
    return new CombatantStackHelper(cardView);
  }

  public createTooltip(scene: Phaser.Scene, _: CardView) {
    return (scene as GameScene).getCardTooltipView();
  }

  public createObjects(scene: Phaser.Scene, cardView: CardView, totalCardWidth: number, totalCardHeight: number) {
    return [
      ...this.defineCardName(scene, totalCardWidth, totalCardHeight, cardView.card.name),
      ...this.defineDamageStat(scene, totalCardWidth, totalCardHeight, cardView.card),
      ...this.defineHealthStat(scene, totalCardWidth, totalCardHeight, cardView.card),
      ...this.defineArmorStat(scene, totalCardWidth, totalCardHeight, cardView.card)
    ];
  }

  private defineCardName(scene: Phaser.Scene, totalWidth: number, totalHeight: number, name: string) {
    const horizontalPadding = totalWidth * 0.2;
    const verticalPadding = totalHeight * 0.05;
    const width = totalWidth * 0.70 - horizontalPadding;
    const height = totalHeight * 0.10 - verticalPadding;
    const x = 0;
    const y = -(totalHeight / 2) + height / 2 + verticalPadding;
    const fontSize = Math.floor(totalHeight * 0.08);

    const gameObjects = [];
    if (showDebugBoxes) {
      const nameBox = scene.add.rectangle(x, y);
      nameBox.setSize(width, height);
      nameBox.setFillStyle(0xFF0000, 0.5);
      nameBox.setStrokeStyle(1, 0x000000);
      gameObjects.push(nameBox);
    }

    const cardName = scene.add.text(x, y, name);
    cardName.setOrigin(0.5, 0.5);
    cardName.setSize(width, height);
    cardName.setColor('#000');
    cardName.setFontSize(fontSize);
    TextUtils.fitText(cardName, width, height);
    gameObjects.push(cardName);
    return gameObjects as Phaser.GameObjects.GameObject[];
  }

  private defineDamageStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: Card) {
    const damageStat = card.damage;
    if (!damageStat) return [];

    const horizontalPadding = totalWidth * 0.06;
    const verticalPadding = totalHeight * 0.03;
    const width = totalWidth * 0.4 - horizontalPadding * 2;
    const height = totalHeight * 0.2 - verticalPadding * 2;
    const x = -(width / 2) - horizontalPadding / 2;
    const y = totalHeight / 2 - (height / 2 + verticalPadding * 2) - totalHeight * 0.02;

    const equipmentDamage = card.equipment?.damage.value;
    const damage = new CardStatisticView(scene, damageStat, equipmentDamage);
    damage.setIconPosition('left');
    damage.setPosition(x, y);
    damage.setSize(width, height);
    return [ damage ];
  }

  private defineHealthStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: Card) {
    const healthStat = card.health;
    if (!healthStat) return [];
  
    const horizontalPadding = totalWidth * 0.06;
    const verticalPadding = totalHeight * 0.03;
    const width = totalWidth * 0.4 - horizontalPadding * 2;
    const height = totalHeight * 0.2 - verticalPadding * 2;
    const x = (width / 2) + horizontalPadding / 2;
    const y = totalHeight / 2 - (height / 2 + verticalPadding * 2) - totalHeight * 0.02;

    const equipmentHealth = card.equipment?.health.value;
    const health = new CardStatisticView(scene, healthStat, equipmentHealth);
    health.setIconPosition('right');
    health.setPosition(x, y);
    health.setSize(width, height);
    return [ health ];
  }

  private defineArmorStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: Card) {
    const armorStat = card.armor;
    if (!armorStat) return [];

    const width = totalWidth * 0.40;
    const height = totalHeight * 0.10;
    const x = 0;
    const y = height * 2;

    const equipmentArmor = card.equipment?.armor.value;
    const armor = new CardStatisticView(scene, armorStat, equipmentArmor);
    armor.setIconPosition('top');
    armor.setPosition(x, y);
    armor.setSize(width, height);
    return [ armor ];
  }

  public updateObjects(_: Phaser.Scene, cardView: CardView, _2: number, _3: number) {
    this.updateStatisticView(cardView, 'Damage');
    this.updateStatisticView(cardView, 'Health');
    this.updateStatisticView(cardView, 'Armor');
  }

  private updateStatisticView(cardView: CardView, statisticType: StatisticType) {
    const cardStatisticView = cardView.getByName(statisticType) as CardStatisticView;
    const statistic = cardView.card.getStatistic(statisticType);
    const equipmentStatistic = cardView.card.equipment?.getStatistic(statisticType);

    if (!statistic) return;
    cardStatisticView.update(statistic, equipmentStatistic?.value);
  }
}

export default CombatantViewStrategy;
