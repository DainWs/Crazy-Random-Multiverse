import CardDragAndDrop from "@/core/interactions/CardDragAndDrop";
import CardMouseOver from "@/core/interactions/CardMouseOver";
import mouseClickDispatcher from "@/core/interactions/MouseClickDispatcher";
import { CardView } from "@/game/cards/CardView";

type Pointer = Phaser.Input.Pointer;

const mouseOver = new CardMouseOver();
const dragAndDrop = new CardDragAndDrop();

function createDragWrapper(scene: Phaser.Scene, card: CardView) {
  return (_: Pointer, dragX: number, dragY: number) => {
    dragAndDrop.onDragCard(scene, card, dragX, dragY);
  }
}

function onPointerUp(_1: Phaser.Scene, _2: CardView): void {
  mouseClickDispatcher.dispatch('mouseup');
}

async function onPointerDown(scene: Phaser.Scene, card: CardView): Promise<void> {
  if (!card.canBeClicked()) return;

  const clickType = await mouseClickDispatcher.dispatch('mousedown');
  if (clickType === 'SimpleClick') CardInputManager.onSimpleClickCard(scene, card);
  if (clickType === 'DoubleClick') CardInputManager.onSimpleClickCard(scene, card);
}

function onSimpleClickCard(scene: Phaser.Scene, card: CardView) {
  console.log('Card clicked:', card);
}

function handleCardInputs(scene: Phaser.Scene, card: CardView): void {
  card.on("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.on("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.on("pointerup", () => onPointerUp(scene, card));
  card.on("pointerdown", () => onPointerDown(scene, card));
  card.on("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.on("drag", createDragWrapper(scene, card));
  card.on("dragend", () => dragAndDrop.onDropCard(scene, card));
}

function removeHandledCard(scene: Phaser.Scene, card: CardView): void {
  card.off("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.off("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.off("pointerup", () => onPointerUp(scene, card));
  card.off("pointerdown", () => onPointerDown(scene, card));
  card.off("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.off("drag", createDragWrapper(scene, card));
  card.off("dragend", () => dragAndDrop.onDropCard(scene, card));
}

const CardInputManager = {
  onSimpleClickCard,
  handleCardInputs,
  removeHandledCard
}

export default CardInputManager;