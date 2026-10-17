import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import type { TargetGameObject } from "@/core/interactions/DragAndDrop";
import mouseOver from "@/core/interactions/CardMouseOver";
import dragAndDrop from "@/core/interactions/DragAndDrop";
import clickHandler from "@/core/interactions/CardClickHandler";

type Pointer = Phaser.Input.Pointer;

type CardEventListenerMap = Map<string, (...args: any[]) => void>;
const cardListeners = new WeakMap<CardView, CardEventListenerMap>();

function handleCardInputs(scene: GameScene, card: CardView): void {
  const listeners: CardEventListenerMap = new Map();

  const onPointerOver = () => mouseOver.onPointerOver(scene, card);
  const onPointerOut = () => mouseOver.onPointerOut(scene, card);
  const onPointerUp = (pointer: Pointer) => clickHandler.onPointerUp(scene, card, pointer);
  const onPointerDown = (pointer: Pointer) => clickHandler.onPointerDown(scene, card, pointer);

  const onDragStart = () => dragAndDrop.onGrabCard(scene, card);
  const onDragEnd = () => dragAndDrop.onDragEnd(scene, card);
  const onDragEnter = createDragEnterWrapper(scene, card);
  const onDragLeave = createDragLeaveWrapper(scene, card);
  const onDrag = createDragWrapper(scene, card);
  const onDrop = createDropWrapper(scene, card);

  listeners.set("pointerover", onPointerOver);
  listeners.set("pointerout", onPointerOut);
  listeners.set("pointerup", onPointerUp);
  listeners.set("pointerdown", onPointerDown);
  listeners.set("dragstart", onDragStart);
  listeners.set("dragend", onDragEnd);
  listeners.set("dragenter", onDragEnter);
  listeners.set("dragleave", onDragLeave);
  listeners.set("drag", onDrag);
  listeners.set("drop", onDrop);

  cardListeners.set(card, listeners);

  for (const [event, fn] of listeners) {
    card.on(event, fn);
  }
}

function removeHandledCard(_scene: GameScene, card: CardView): void {
  const listeners = cardListeners.get(card);
  if (!listeners) return;

  for (const [event, fn] of listeners) {
    card.off(event, fn);
  }

  cardListeners.delete(card);
}

function createDragEnterWrapper(scene: GameScene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDragEnter(scene, card, target);
}

function createDragLeaveWrapper(scene: GameScene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDragLeave(scene, card, target);
}

function createDragWrapper(scene: GameScene, card: CardView) {
  return (_: Pointer, dragX: number, dragY: number) => dragAndDrop.onDragCard(scene, card, dragX, dragY);
}

function createDropWrapper(scene: GameScene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDropCard(scene, card, target);
}

const CardInputManager = {
  handleCardInputs,
  removeHandledCard
}

export default CardInputManager;
