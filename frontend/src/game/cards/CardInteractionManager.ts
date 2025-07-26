import CardDragAndDropManager, { TargetGameObject } from "@/core/interactions/DragAndDrop";
import mouseClickDispatcher from "@/core/interactions/MouseClickDispatcher";
import CardView from "@/game/cards/CardView";
import CardActionPerspective from "@/game/perspectives/CardActionPerspective";
import ZoneView from "@/game/zone/ZoneView";

type Pointer = Phaser.Input.Pointer;

const dragAndDrop = new CardDragAndDropManager();

class CardInteractionManager {
  public attachListeners(card: CardView) {
    card.on("pointerover", () => card.onPointerOver());
    card.on("pointerout", () => card.onPointerOut());
    card.on("pointerup", () => onPointerUp());
    card.on("pointerdown", () => onPointerDown(card.scene, card));

    card.on("dragstart", () => dragAndDrop.onGrabCard(card.scene, card));
    card.on("dragenter", createDragEnterWrapper(card.scene, card));
    card.on("dragleave", createDragLeaveWrapper(card.scene, card));
    card.on("drag", createDragWrapper(card.scene, card));
    card.on("drop", createDropWrapper(card.scene, card));
  }

  public deattachListeners(card: CardView) {
    card.off("pointerover", () => card.onPointerOver());
    card.off("pointerout", () => card.onPointerOut());
    card.off("pointerup", () => onPointerUp());
    card.off("pointerdown", () => onPointerDown(card.scene, card));
  
    card.off("dragstart", () => dragAndDrop.onGrabCard(card.scene, card));
    card.off("dragenter", createDragEnterWrapper(card.scene, card));
    card.off("dragleave", createDragLeaveWrapper(card.scene, card));
    card.off("drag", createDragWrapper(card.scene, card));
    card.off("drop", createDropWrapper(card.scene, card));
  }
}

// TODO mover estos tres a clases especializadas como CardMouseOver o CardDragAndDrop
function onPointerUp(): void {
  mouseClickDispatcher.dispatch('mouseup');
}

async function onPointerDown(scene: Phaser.Scene, card: CardView): Promise<void> {
  if (!card.canBeClicked()) return;

  const clickType = await mouseClickDispatcher.dispatch('mousedown');
  if (clickType === 'SimpleClick') onSimpleClickCard(scene, card);
  if (clickType === 'DoubleClick') onSimpleClickCard(scene, card);
}

// TODO mover a controller
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
export default CardInteractionManager;