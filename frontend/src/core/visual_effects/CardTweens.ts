import type CardView from "@/game/cards/CardView";
import type { Motion } from "@/core/visual_effects/Motion";

type CardTween = 'hover' | 'unhover' | 'horizontal_slide' | 'move_to_hand' | 'preview_in_zone_slot';
type CardTweenProvider = (card: CardView, args: unknown[]) => Motion;

/** How much a card under the pointer grows, relative to its own scale. */
const HOVER_SCALE = 1.035;

const NONE_EASE = { ease: 'Linear' };

function noneTween(card: CardView): Motion {
  const originalScale = card.getOriginalScale();

  return {
    targets: card,
    to: { scaleX: originalScale.scaleX, scaleY: originalScale.scaleY },
    duration: 0,
    curve: NONE_EASE,
    kind: 'ESSENTIAL'
  };
}

function hoverTween(card: CardView): Motion {
  const originalScale = card.getOriginalScale();
  const scaleX = originalScale.scaleX;
  const scaleY = originalScale.scaleY ?? scaleX;

  return {
    targets: card,
    to: { scaleX: scaleX * HOVER_SCALE, scaleY: scaleY * HOVER_SCALE },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function unhoverTween(card: CardView): Motion {
  const originalScale = card.getOriginalScale();

  return {
    targets: card,
    to: { scaleX: originalScale.scaleX, scaleY: originalScale.scaleY },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function slideToTween(card: CardView, [x, y]: unknown[]): Motion {
  return {
    targets: card,
    to: { x, y },
    duration: 'MEDIUM',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function moveToTween(card: CardView, [x, y, delay]: unknown[]): Motion {
  return {
    targets: card,
    to: { x, y },
    delay: delay as number,
    duration: 'MEDIUM',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

function previewInZoneSlotTween(card: CardView, [x, y, scale, rotation]: unknown[]): Motion {
  const targetScale = typeof scale === 'number' ?
    { x: scale, y: scale } :
    scale as { x: number, y: number };

  return {
    targets: card,
    to: { x, y, scaleX: targetScale.x, scaleY: targetScale.y, angle: rotation },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  };
}

export { noneTween,  hoverTween, unhoverTween, slideToTween, moveToTween, previewInZoneSlotTween };
export type { CardTween, CardTweenProvider };
