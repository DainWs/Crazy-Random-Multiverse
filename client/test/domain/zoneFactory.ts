import playerFactory from "@test/domain/playerFactory";
import cardFactory from "@test/domain/cardFactory";

import Player from "@/domain/models/Player";
import Zone from "@/domain/models/Zone"
import Combatant from '@/domain/models/Card';

const createZone = (owner?: Player, combatants?: Combatant[][], health?: number, maxHealth?: number): Zone => {
  if (!owner) owner = playerFactory.createPlayer();
  if (!combatants) combatants = generateCombatants();
  if (!health) health = Math.floor(Math.random() * 1000);
  if (!maxHealth) maxHealth = Math.floor(Math.random() * 100) + health;
  const zone = new Zone(owner);
  zone.combatants = combatants;
  zone.health = health;
  zone.maxHealth = maxHealth;
  return zone;
}

function generateCombatants(): Combatant[][] {
  const combatants = new Array(3);
  for (let rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
    const combatantsCells = new Array(3);
    for (let cellIndex = 0; cellIndex < combatantsCells.length; cellIndex++) {
      const generateCombatant = Math.random() < 0.5;
      if (generateCombatant) {
        combatantsCells[cellIndex] = cardFactory.createWarriorCard();
      }
    }
    combatants[rowIndex] = combatantsCells;
  }
  return combatants;
}

export default {
  createZone
};