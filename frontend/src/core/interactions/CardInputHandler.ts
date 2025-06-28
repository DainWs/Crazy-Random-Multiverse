import { GameScene } from "@/game/scenes/Game";
import { CardView } from "@/game/cards/CardView";
import EventBus from "@/game/EventBus";

type Pointer = Phaser.Input.Pointer;
type PhaserGameObject = Phaser.GameObjects.GameObject;

type CardCallback = (card: CardView) => void;

class CardInputHandler {
  public onGrabCallback: CardCallback;
  public onDragCallback: CardCallback;
  public onDropCallback: CardCallback;

  // For context resolution
  private scene: GameScene;
  private card: CardView;
  private callback: CardCallback;

  public constructor() {
    this.onGrabCallback = () => {};
    this.onDragCallback = () => {};
    this.onDropCallback = () => {};
  }

  public handleCardInputs(scene: GameScene, card: CardView): void {
    const context = { scene, card };

    card.on("pointerover", this.onPointerOver, context);
    card.on("pointerout", this.onPointerOut, context);

    scene.input.on("dragstart", this.onGrab, { ...context, callback: this.onGrabCallback });
    scene.input.on("drag", this.onDrag, { ...context, callback: this.onDragCallback });
    scene.input.on("dragend", this.onDrop, { ...context, callback: this.onDropCallback });
  }

  public removeHandledCard(scene: GameScene, card: CardView): void {
    if (card) {
      const context = { scene, card };
      card.off("pointerover", this.onPointerOver, context);
      card.off("pointerout", this.onPointerOut, context);

      scene.input.off("dragstart", this.onGrab, { ...context, callback: this.onGrabCallback });
      scene.input.off("drag", this.onDrag, { ...context, callback: this.onDragCallback });
      scene.input.off("dragend", this.onDrop, { ...context, callback: this.onDropCallback });
    }
  }

  private onPointerOver(): void {
    if (this.card.canBeGrabbed()) {
      this.scene.input.manager.canvas.style.cursor = "grab";
    }
    this.scene.visualEffectSystem.applyTweenToCard(this.card, 'hover');
  
    this.card.showTooltip();
  }

  private onPointerOut(): void {
    this.scene.input.manager.canvas.style.cursor = "default";
    this.scene.visualEffectSystem.applyTweenToCard(this.card, 'unhover');
  
    this.card.hideTooltip();
  }

  private onGrab(_: Pointer, target: PhaserGameObject): void {
    if (target === this.card && this.card.canBeGrabbed()) {
      this.scene.input.manager.canvas.style.cursor = "grab";
      this.scene.visualEffectSystem.applyAnimationToCard(this.card, 'startDrag');
      this.callback(this.card);
      EventBus.emit('card.grab', this.card);
    }
  }

  private onDrag(_: Pointer, target: PhaserGameObject, dragX: number, dragY: number): void {
    if (target === this.card && this.card.canBeGrabbed()) {
      this.card.setPosition(dragX, dragY);
      this.callback(this.card);
      EventBus.emit('card.drag', this.card);
    }
  }
  
  private onDrop(_: Pointer, target: PhaserGameObject): void {
    if (target === this.card && this.card.canBeGrabbed()) {
      this.scene.input.manager.canvas.style.cursor = "default";
      this.scene.visualEffectSystem.applyAnimationToCard(this.card, 'endDrag');
      this.callback(this.card);
      EventBus.emit('card.drop', this.card);
    }
  }
}

export default CardInputHandler;