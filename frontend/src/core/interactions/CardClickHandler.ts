import CardView from "@/game/cards/CardView";
import mouseClickDispatcher from "@/core/interactions/MouseClickDispatcher";
import CardActionPerspective from "@/game/perspectives/CardActionPerspective";
import ZoneView from "@/game/zone/ZoneView";

class CardClickHandler {
  public async onPointerDown(scene: Phaser.Scene, card: CardView): Promise<void> {
    if (!card.canBeClicked()) return;

    const clickType = await mouseClickDispatcher.dispatch('mousedown');
    if (clickType === 'SimpleClick' || clickType === 'DoubleClick') {
      this.onSimpleClickCard(scene, card);
    }
  }

  public onPointerUp(_: Phaser.Scene, __: CardView): void {
    mouseClickDispatcher.dispatch('mouseup');
  }

  private onSimpleClickCard(scene: Phaser.Scene, card: CardView) {
    const zones = scene.children.list.filter(child => child instanceof ZoneView) as ZoneView[];
    new CardActionPerspective(scene, card, zones).enter();
  }
}

export default CardClickHandler;
