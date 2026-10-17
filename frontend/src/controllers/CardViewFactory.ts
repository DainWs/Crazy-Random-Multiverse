import type CardView from "@/game/cards/CardView";
import type Card from "@/domain/Card";
import { CombatantCard, EquipmentCard, SpellCard } from "@/domain/Card";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import SpellView from "@/game/cards/SpellView";

const createCardView = (scene: Phaser.Scene, card: Card): CardView => {
  if (card.isType('EQUIPMENT')) {
    return new EquipmentView(scene, card as EquipmentCard);
  }

  if (card.isType('SPELL')) {
    return new SpellView(scene, card as SpellCard);
  }

  return new CombatantView(scene, card as CombatantCard);
}

const CardViewFactory = {
  createCardView
}

export default CardViewFactory;