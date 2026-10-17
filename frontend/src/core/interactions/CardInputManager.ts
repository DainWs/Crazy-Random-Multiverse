import type CardView from "@/game/cards/CardView";
import type { GameScene } from "@/scenes/Game";
import CardMouseOver from "@/core/interactions/CardMouseOver";
import CardDragAndDropManager, { TargetGameObject } from "@/core/interactions/DragAndDrop";
import CardClickHandler from "@/core/interactions/CardClickHandler";

type Pointer = Phaser.Input.Pointer;

const mouseOver = new CardMouseOver();
const dragAndDrop = new CardDragAndDropManager();
const clickHandler = new CardClickHandler();

function handleCardInputs(scene: GameScene, card: CardView): void {
  card.on("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.on("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.on("pointerup", (pointer: Pointer) => clickHandler.onPointerUp(scene, card, pointer));
  card.on("pointerdown", (pointer: Pointer) => clickHandler.onPointerDown(scene, card, pointer));

  card.on("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.on("dragend", () => dragAndDrop.onDragEnd(scene, card));
  card.on("dragenter", createDragEnterWrapper(scene, card));
  card.on("dragleave", createDragLeaveWrapper(scene, card));
  card.on("drag", createDragWrapper(scene, card));
  card.on("drop", createDropWrapper(scene, card));
}

function removeHandledCard(scene: GameScene, card: CardView): void {
  card.off("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.off("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.off("pointerup", (pointer: Pointer) => clickHandler.onPointerUp(scene, card, pointer));
  card.off("pointerdown", (pointer: Pointer) => clickHandler.onPointerDown(scene, card, pointer));

  card.off("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.off("dragend", () => dragAndDrop.onDragEnd(scene, card));
  card.off("dragenter", createDragEnterWrapper(scene, card));
  card.off("dragleave", createDragLeaveWrapper(scene, card));
  card.off("drag", createDragWrapper(scene, card));
  card.off("drop", createDropWrapper(scene, card));
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
