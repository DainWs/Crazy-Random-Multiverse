import Card from "@/domain/Card";
import CombatantViewStrategy from "@/game/cards/CombatantViewStategy";
import EquipmentViewStrategy from "@/game/cards/EquipmentViewStrategy";
import SpellViewStrategy from "@/game/cards/SpellViewStrategy";

const combatantViewStrategy = new CombatantViewStrategy();
const spellViewStrategy = new SpellViewStrategy();
const equipmentViewStrategy = new EquipmentViewStrategy();

function dispatchCardViewStrategy(card: Card) {
  if (card.isType("EQUIPMENT")) return equipmentViewStrategy;
  if (card.isType("SPELL")) return spellViewStrategy;
  return combatantViewStrategy;
}

export { dispatchCardViewStrategy }