import { SourceGameObject, TargetGameObject } from "@/core/interactions/DragAndDrop";
import CardView from "@/game/cards/CardView";
import HandView from "@/game/hand/HandView";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import { GameScene } from "@/scenes/Game";

function dispatchAction(scene: Phaser.Scene, card: CardView, source?: SourceGameObject, target?: TargetGameObject) {
  if (scene instanceof GameScene) {
    return internalActionDispatch(scene, card, source, target);
  } else {
    console.log("You must be playing a game to perform this action.");
    return false;
  }
}

function internalActionDispatch(scene: GameScene, cardView: CardView, source?: SourceGameObject, target?: TargetGameObject) {
  if (source instanceof HandView && target instanceof ZoneSlotView && cardView.card.isCombatant()) {
    return scene.cardController.putCardOnZoneSlot(cardView, target);
  }

  if (source instanceof HandView && target instanceof ZoneSlotView && cardView.card.isType('EQUIPMENT')) {
    return scene.cardController.equipCardToCombatant(cardView, target.getCard()!, target);
  }

  if (source instanceof ZoneSlotView && target instanceof ZoneSlotView && cardView.card.isCombatant()) {
    return scene.cardController.moveCardOnZoneSlot(cardView, source, target);
  }

  return false;
}

export { dispatchAction };