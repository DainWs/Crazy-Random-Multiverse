import CardMouseOver from "@/core/interactions/CardMouseOver";
import CardDragAndDropManager, { TargetGameObject } from "@/core/interactions/DragAndDrop";
import CardClickHandler from "@/core/interactions/CardClickHandler";
import { CardView } from "@/game/cards/CardView";

type Pointer = Phaser.Input.Pointer;

const mouseOver = new CardMouseOver();
const dragAndDrop = new CardDragAndDropManager();
const clickHandler = new CardClickHandler();

function handleCardInputs(scene: Phaser.Scene, card: CardView): void {
  card.on("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.on("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.on("pointerup", () => clickHandler.onPointerUp(scene, card));
  card.on("pointerdown", () => clickHandler.onPointerDown(scene, card));

  card.on("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.on("dragenter", createDragEnterWrapper(scene, card));
  card.on("dragleave", createDragLeaveWrapper(scene, card));
  card.on("drag", createDragWrapper(scene, card));
  card.on("drop", createDropWrapper(scene, card));
}

function removeHandledCard(scene: Phaser.Scene, card: CardView): void {
  card.off("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.off("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.off("pointerup", () => clickHandler.onPointerUp(scene, card));
  card.off("pointerdown", () => clickHandler.onPointerDown(scene, card));

  card.off("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.off("dragenter", createDragEnterWrapper(scene, card));
  card.off("dragleave", createDragLeaveWrapper(scene, card));
  card.off("drag", createDragWrapper(scene, card));
  card.off("drop", createDropWrapper(scene, card));
}

function createDragEnterWrapper(scene: Phaser.Scene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDragEnter(scene, card, target);
}

function createDragLeaveWrapper(scene: Phaser.Scene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDragLeave(scene, card, target);
}

function createDragWrapper(scene: Phaser.Scene, card: CardView) {
  return (_: Pointer, dragX: number, dragY: number) => dragAndDrop.onDragCard(scene, card, dragX, dragY);
}

function createDropWrapper(scene: Phaser.Scene, card: CardView) {
  return (_: Pointer, target: TargetGameObject) => dragAndDrop.onDropCard(scene, card, target);
}

const CardInputManager = {
  handleCardInputs,
  removeHandledCard
}

export default CardInputManager;