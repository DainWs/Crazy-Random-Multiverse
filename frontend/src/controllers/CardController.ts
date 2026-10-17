import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { GameScene } from "@/scenes/Game";

class CardController {
  private readonly scene: GameScene;

  public constructor(scene: GameScene) {
    this.scene = scene;
  }

  public putCardOnZoneSlot(cardView: CombatantView, handView: HandView, zoneSlotView: ZoneSlotView) {
    if (zoneSlotView.getCombatant() !== null) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      return false;
    }

    if (!zoneSlotView.zoneSlot.canPlaceCard(cardView.combatant)) {
      console.warn("Target zone slot does not allow this type of card.");
      return false;
    }

    handView.removeCard(cardView);
    zoneSlotView.setCard(cardView);
    // TODO propagar evento al backend
    return true;
  }

  public moveCardOnZoneSlot(combatantView: CombatantView, fromZoneSlot: ZoneSlotView, toZoneSlot: ZoneSlotView) {
    if (fromZoneSlot.getCombatant() === null) {
      console.warn("Source zone slot does not have a card.");
      return false;
    }

    if (fromZoneSlot.getCombatant() !== combatantView) {
      console.warn("Source zone slot does not have the card to move.");
      return false;
    }

    if (toZoneSlot.getCombatant() !== null) {
      console.warn("Target zone slot already has a card, cannot place another one.");
      return false;
    }

    if (!toZoneSlot.zoneSlot.canPlaceCard(combatantView.combatant)) {
      console.warn("Target zone slot does not allow this type of card.");
      return false;
    }

    fromZoneSlot.removeCard();
    toZoneSlot.setCard(combatantView);
    // TODO propagar evento al backend
    return true;
  }

  public equipCardToCombatant(equipmentView: EquipmentView, combatantView: CombatantView, sourceHandView: HandView, targetSlotView: ZoneSlotView) {
    if (targetSlotView.getCard() === null) {
      console.warn("Target zone slot does not have a card.");
      return false;
    }

    if (combatantView.combatant.isType('EQUIPMENT')) {
      console.warn("Target card is an equipment card, cannot equip another equipment card to it.");
      return false;
    }

    sourceHandView.removeCard(equipmentView);
    combatantView.stack(equipmentView);

    combatantView.combatant.equipment = equipmentView.equipment;
    // TODO propagar evento al backend
    return true;
  }
}

export default CardController;