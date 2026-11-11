import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import StoreSystem from "@/core/StoreSystem";
import AttackTargetingPerspective from "@/game/perspectives/AttackTargetingPerspective";
import ZoneSlotView from "@/game/zone/ZoneSlotView";
import * as Constants from "@/core/Constants";

let targeting: AttackTargetingPerspective | null = null;

const onPointerUp = (scene: GameScene, card: CardView, pointer: Phaser.Input.Pointer): void => {
  if (pointer.button !== Constants.PRIMARY_BUTTON) return;
  if (!card.canBeClicked()) return;

  if (
    pointer.getDuration() < Constants.DRAG_TIME_THRESHOLD &&
    pointer.getDistance() < Constants.DRAG_DISTANCE_THRESHOLD
  ) {
    onSimpleClickCard(scene, card);
  }
}

/** A click on a card of the board that can attack selects the attacker, and a second click on a card of another player attacks it (VIEW-4). */
function onSimpleClickCard(scene: GameScene, card: CardView) {
  const slot = card.parentContainer;
  if (!(slot instanceof ZoneSlotView)) return;

  if (targeting) {
    attackFromSelected(scene, slot);
  } else if (slot.zone.isPlayerOwner(StoreSystem.getPlayer()) && scene.cardController.canAct() && card.card.isAttackAvailable) {
    selectAttacker(scene, slot);
  }
}

function selectAttacker(scene: GameScene, slot: ZoneSlotView) {
  targeting = new AttackTargetingPerspective(scene, slot, cancelTargeting);
  targeting.enter();
}

function attackFromSelected(scene: GameScene, targetSlot: ZoneSlotView) {
  const sourceSlot = targeting?.sourceSlot;
  cancelTargeting();

  if (sourceSlot) {
    scene.cardController.attackCardOnZoneSlot(sourceSlot, targetSlot);
  }
}

/** The selection ends with an action, a click elsewhere, Escape, and with every state change, such as a new turn (VIEW-4). */
function cancelTargeting() {
  targeting?.exit();
  targeting = null;
}

const CardClickHandler = {
  onPointerUp,
  cancelTargeting
}

export default CardClickHandler;
