import { SourceGameObject, TargetGameObject } from "@/core/interactions/DragAndDrop";
import CardView from "@/game/cards/CardView";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { GameScene } from "@/scenes/Game";

function dispatchAction(scene: GameScene, card: CardView, source?: SourceGameObject, target?: TargetGameObject) {
  console.log("dispatchAction", source, target);
  if (scene instanceof GameScene) {
    return internalActionDispatch(scene, card, source, target);
  } else {
    console.log("You must be playing a game to perform this action.");
    return false;
  }
}

function internalActionDispatch(scene: GameScene, cardView: CardView, source?: SourceGameObject, target?: TargetGameObject) {
  if (source instanceof HandView && target instanceof ZoneSlotView && cardView instanceof CombatantView) {
    return scene.cardController.putCardOnZoneSlot(cardView, source, target);
  }

  if (source instanceof HandView && target instanceof ZoneSlotView && cardView instanceof EquipmentView) {
    return scene.cardController.equipCardToCombatant(cardView, target.getCombatant()!, source, target);
  }

  if (source instanceof ZoneSlotView && target instanceof ZoneSlotView && cardView instanceof CombatantView) {
    return scene.cardController.moveCardOnZoneSlot(cardView, source, target);
  }

  return false;
}

export { dispatchAction };