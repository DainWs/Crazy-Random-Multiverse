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

/** Whether the pointer entering `card` is handled by the attack in course, so the card does not get its enlargement too (VIEW-4, VIEW-14). */
const onPointerOver = (card: CardView): boolean => {
  const slot = card.parentContainer;

  return targeting !== null && slot instanceof ZoneSlotView && targeting.hover(slot);
}

const onPointerOut = (card: CardView): boolean => {
  const slot = card.parentContainer;

  return targeting !== null && slot instanceof ZoneSlotView && targeting.unhover(slot);
}

/** A click on a card of the board that can attack selects the attacker, and a click on a valid target attacks it (VIEW-4). */
function onSimpleClickCard(scene: GameScene, card: CardView) {
  const slot = card.parentContainer;
  if (!(slot instanceof ZoneSlotView)) return;

  if (targeting) {
    clickWhileSelected(scene, slot, card);
  } else if (canSelect(scene, slot, card)) {
    selectAttacker(scene, slot);
  }
}

function canSelect(scene: GameScene, slot: ZoneSlotView, card: CardView): boolean {
  return slot.zone.isPlayerOwner(StoreSystem.getPlayer()) && scene.cardController.canAct() && card.card.isAttackAvailable;
}

/** Any click that does nothing keeps the selection (VIEW-4). */
function clickWhileSelected(scene: GameScene, slot: ZoneSlotView, card: CardView) {
  const sourceSlot = targeting!.sourceSlot;
  if (targeting!.isCommitted()) return;

  if (slot === sourceSlot) {
    cancelTargeting();
  } else if (canSelect(scene, slot, card)) {
    cancelTargeting();
    selectAttacker(scene, slot);
  } else if (sourceSlot.canAttack(slot)) {
    attackFromSelected(scene, sourceSlot, slot);
  }
}

function selectAttacker(scene: GameScene, slot: ZoneSlotView) {
  targeting = new AttackTargetingPerspective(scene, slot, cancelTargeting);
  targeting.enter();
}

/** The attacker and the target stay lifted until the event of the attack is applied, which draws the board again, or the server rejects it (VIEW-4). */
function attackFromSelected(scene: GameScene, sourceSlot: ZoneSlotView, targetSlot: ZoneSlotView) {
  const perspective = targeting!;
  perspective.commit(targetSlot);

  const sent = scene.cardController.attackCardOnZoneSlot(sourceSlot, targetSlot, () => {
    if (targeting === perspective) {
      cancelTargeting();
    }
  });
  if (!sent) {
    cancelTargeting();
  }
}

/** The selection ends with a click elsewhere, Escape, a rejection and with every state change, such as a new turn (VIEW-4). */
function cancelTargeting() {
  const perspective = targeting;
  targeting = null;
  perspective?.exit();
}

const CardClickHandler = {
  onPointerUp,
  onPointerOver,
  onPointerOut,
  cancelTargeting
}

export default CardClickHandler;
