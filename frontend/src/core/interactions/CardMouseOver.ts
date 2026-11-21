import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import clickHandler from "@/core/interactions/CardClickHandler";
import ZoneSlotView from "@/game/zone/ZoneSlotView";

/** The slot of an own card that can attack now, which has its cyan frame (VIEW-37). */
function readySlotOf(card: CardView): ZoneSlotView | undefined {
  const slot = card.parentContainer;

  return slot instanceof ZoneSlotView && slot.hasReadyMark() ? slot : undefined;
}

const onPointerOver = (scene: GameScene, card: CardView) => {
  const readySlot = readySlotOf(card);

  if (readySlot) {
    readySlot.holdReadyMark(true);
    scene.input.manager.canvas.style.cursor = "pointer";
  } else if (card.canBeClicked()) {
    scene.input.manager.canvas.style.cursor = "grab";
  }

  if (!clickHandler.onPointerOver(card)) {
    CardAnimator.playTween(card, 'hover');
  }
  scene.getCardTooltipView().show(card);
}

const onPointerOut = (scene: GameScene, card: CardView) => {
  scene.input.manager.canvas.style.cursor = "default";
  readySlotOf(card)?.holdReadyMark(false);

  if (!clickHandler.onPointerOut(card)) {
    CardAnimator.playTween(card, 'unhover');
  }
  scene.getCardTooltipView().hide();
}

const CardMouseOver = {
  onPointerOver,
  onPointerOut
}

export default CardMouseOver;
