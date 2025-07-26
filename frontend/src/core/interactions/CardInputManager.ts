import CardMouseOver from "@/core/interactions/CardMouseOver";
import CardDragAndDropManager, { TargetGameObject } from "@/core/interactions/DragAndDrop";
import mouseClickDispatcher from "@/core/interactions/MouseClickDispatcher";
import { CardView } from "@/game/cards/CardView";
import CardActionPerspective from "@/game/perspectives/CardActionPerspective";
import ZoneView from "@/game/zone/ZoneView";

type Pointer = Phaser.Input.Pointer;

const mouseOver = new CardMouseOver();
const dragAndDrop = new CardDragAndDropManager();


function handleCardInputs(scene: Phaser.Scene, card: CardView): void {
  card.on("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.on("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.on("pointerup", () => onPointerUp(scene, card));
  card.on("pointerdown", () => onPointerDown(scene, card));

  card.on("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.on("dragenter", createDragEnterWrapper(scene, card));
  card.on("dragleave", createDragLeaveWrapper(scene, card));
  card.on("drag", createDragWrapper(scene, card));
  card.on("drop", createDropWrapper(scene, card));
}

function removeHandledCard(scene: Phaser.Scene, card: CardView): void {
  card.off("pointerover", () => mouseOver.onPointerOver(scene, card));
  card.off("pointerout", () => mouseOver.onPointerOut(scene, card));
  card.off("pointerup", () => onPointerUp(scene, card));
  card.off("pointerdown", () => onPointerDown(scene, card));

  card.off("dragstart", () => dragAndDrop.onGrabCard(scene, card));
  card.off("dragenter", createDragEnterWrapper(scene, card));
  card.off("dragleave", createDragLeaveWrapper(scene, card));
  card.off("drag", createDragWrapper(scene, card));
  card.off("drop", createDropWrapper(scene, card));
}

// TODO mover estos tres a clases especializadas como CardMouseOver o CardDragAndDrop
function onPointerUp(_1: Phaser.Scene, _2: CardView): void {
  mouseClickDispatcher.dispatch('mouseup');
}

async function onPointerDown(scene: Phaser.Scene, card: CardView): Promise<void> {
  if (!card.canBeClicked()) return;

  const clickType = await mouseClickDispatcher.dispatch('mousedown');
  if (clickType === 'SimpleClick') onSimpleClickCard(scene, card);
  if (clickType === 'DoubleClick') onSimpleClickCard(scene, card);
}

function onSimpleClickCard(scene: Phaser.Scene, card: CardView) {
  console.log('Card clicked:', card);
  // TODO don't do this at home
  const list = scene.children.list.filter(child => child instanceof ZoneView);

  new CardActionPerspective(scene, card, list).enter();
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