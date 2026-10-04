import Card from "@/domain/Card";
import baseCardStackLayoutHelper from "@/game/cards/CardStackLayoutHelper";
import CardViewStrategy from "@/game/cards/CardViewStrategy";
import combatantRender from "@/game/cards/renders/CombatantRender";
import equipmentRender from "@/game/cards/renders/EquipmentRender";
import spellRender from "@/game/cards/renders/SpellRender";
import { GameScene } from "@/scenes/Game";

const combatantViewStrategy: CardViewStrategy = {
  createStackLayoutHelper: () => baseCardStackLayoutHelper,
  createTooltip: (scene) => (scene as GameScene).getCardTooltipView(),
  createRender: () => combatantRender,
}

const spellViewStrategy: CardViewStrategy = {
  createStackLayoutHelper: () => undefined,
  createTooltip: (scene) => (scene as GameScene).getCardTooltipView(),
  createRender: () => spellRender,
}

const equipmentViewStrategy: CardViewStrategy = {
  createStackLayoutHelper: () => undefined,
  createTooltip: (scene) => (scene as GameScene).getCardTooltipView(),
  createRender: () => equipmentRender,
}

function dispatchCardViewStrategy(card: Card) {
  if (card.isType("EQUIPMENT")) return equipmentViewStrategy;
  if (card.isType("SPELL")) return spellViewStrategy;
  return combatantViewStrategy;
}

export { dispatchCardViewStrategy }