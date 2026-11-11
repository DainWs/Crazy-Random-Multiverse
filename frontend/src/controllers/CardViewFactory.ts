import type CardView from "@/game/cards/CardView";
import type Card from "@/domain/Card";
import { CombatantCard, EquipmentCard, SpellCard } from "@/domain/Card";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import SpellView from "@/game/cards/SpellView";
import InteractiveObjectManager from "@/core/interactions/InteractiveObjectManager";
import Phaser from "phaser";

const instantiateCardView = (scene: Phaser.Scene, card: Card): CardView => {
  if (card.isType('EQUIPMENT')) {
    return new EquipmentView(scene, card as EquipmentCard);
  }

  if (card.isType('SPELL')) {
    return new SpellView(scene, card as SpellCard);
  }

  return new CombatantView(scene, card as CombatantCard);
}

// CardView cannot import InteractiveObjectManager: it would close an import cycle through its subclasses
const createCardView = (scene: Phaser.Scene, card: Card): CardView => {
  const view = instantiateCardView(scene, card);
  InteractiveObjectManager.registerGameObject(scene, view);
  view.once(Phaser.GameObjects.Events.DESTROY, () => InteractiveObjectManager.unregisterGameObject(scene, view));
  return view;
}

/** A combatant with every piece of its equipment stacked behind it (VIEW-14). */
const createCombatantView = (scene: Phaser.Scene, combatant: CombatantCard): CombatantView => {
  const view = createCardView(scene, combatant) as CombatantView;
  const pieceViews: CardView[] = combatant.equipment.map((piece) => createCardView(scene, piece));
  view.stackEquipment(pieceViews);

  return view;
}

const CardViewFactory = {
  createCardView,
  createCombatantView
}

export default CardViewFactory;
