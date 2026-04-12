import CardView from "@/game/cards/CardView";
import mouseClickDispatcher from "@/core/interactions/MouseClickDispatcher";
import CardActionPerspective from "@/game/perspectives/CardActionPerspective";
import ZoneView from "@/game/zone/ZoneView";

class CardClickHandler {
  public async onPointerDown(scene: Phaser.Scene, card: CardView): Promise<void> {
    if (!card.canBeClicked()) return;

    const clickType = await mouseClickDispatcher.dispatch('mousedown');
    if (clickType === 'SimpleClick') this.onSimpleClickCard(scene, card);
    if (clickType === 'DoubleClick') this.onDoubleClickCard(scene, card);
  }

  public onPointerUp(_: Phaser.Scene, __: CardView): void {
    mouseClickDispatcher.dispatch('mouseup');
  }

  // TODO definir accion en caso de doble click
  private onDoubleClickCard(scene: Phaser.Scene, card: CardView) {
    this.onSimpleClickCard(scene, card);
  }

  // TODO completamente incompleto, tareas:
  // BUG: Solo debe funcionar sobre cartas que se encuentren situadas en una zona
  // BUG: Al hacer click y activarse la perspectiva, se deshabilita despues de poco tiempo
  private onSimpleClickCard(scene: Phaser.Scene, card: CardView) {
    const zones = scene.children.list.filter(child => child instanceof ZoneView) as ZoneView[];
    new CardActionPerspective(scene, card, zones).enter();
  }
}

export default CardClickHandler;
