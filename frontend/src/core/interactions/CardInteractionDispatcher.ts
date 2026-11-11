import type { GameScene } from "@/scenes/Game";
import { SourceGameObject, TargetGameObject } from "@/core/interactions/DragAndDrop";
import CardView from "@/game/cards/CardView";
import CombatantView from "@/game/cards/CombatantView";
import EquipmentView from "@/game/cards/EquipmentView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

function dispatchAction(scene: GameScene, cardView: CardView, source?: SourceGameObject, target?: TargetGameObject) {
  if (source instanceof HandView && target instanceof ZoneSlotView && cardView instanceof CombatantView) {
    return scene.cardController.putCardOnZoneSlot(cardView, source, target);
  }

  if (source instanceof HandView && target instanceof ZoneSlotView && cardView instanceof EquipmentView) {
    return scene.cardController.equipCardOnZoneSlot(cardView, source, target);
  }

  if (source instanceof ZoneSlotView && target instanceof ZoneSlotView && cardView instanceof CombatantView) {
    return scene.cardController.moveCardOnZoneSlot(cardView, source, target);
  }

  return false;
}

export { dispatchAction };