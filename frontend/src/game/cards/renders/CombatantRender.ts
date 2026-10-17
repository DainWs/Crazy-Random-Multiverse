import type { StatisticType } from "@/domain/Statistics";
import type { CardRender } from "@/game/cards/renders/CardRender";
import * as TextUtils from "@/game/utils/TextUtils";
import { CardStatisticView } from "@/game/cards/components/CardStatisticView";
import { showDebugBoxes } from "@/env";
import CombatantView from "@/game/cards/CombatantView";
import { CombatantCard } from "@/domain/Card";

const render = (scene: Phaser.Scene, view: CombatantView, width: number, height: number) => {
  const card = view.combatant;
  return [
    ...defineCardName(scene, width, height, card.name),
    ...defineDamageStat(scene, width, height, card),
    ...defineHealthStat(scene, width, height, card),
    ...defineArmorStat(scene, width, height, card)
  ];
}

function defineCardName(scene: Phaser.Scene, totalWidth: number, totalHeight: number, name: string) {
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

function defineDamageStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: CombatantCard) {
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
  return [damage];
}

function defineHealthStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: CombatantCard) {
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
  return [health];
}

function defineArmorStat(scene: Phaser.Scene, totalWidth: number, totalHeight: number, card: CombatantCard) {
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
  return [armor];
}

const update = (_: Phaser.Scene, view: CombatantView, _2: number, _3: number) => {
  updateStatisticView(view, 'Damage');
  updateStatisticView(view, 'Health');
  updateStatisticView(view, 'Armor');
}

function updateStatisticView(view: CombatantView, statisticType: StatisticType) {
  const cardStatisticView = view.getByName(statisticType) as CardStatisticView;
  if (!cardStatisticView) return;

  const statistic = view.combatant.getStatistic(statisticType);
  const equipmentStatistic = view.combatant.equipment?.getStatistic(statisticType);

  if (!statistic) return;
  cardStatisticView.update(statistic, equipmentStatistic?.value);
}

const combatantRender: CardRender = {
  render,
  update
}

export type { CardRender }
export default combatantRender;