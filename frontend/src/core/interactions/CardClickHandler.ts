import type CardView from "@/game/cards/CardView";
import CardActionPerspective from "@/game/perspectives/CardActionPerspective";
import ZoneView from "@/game/zone/ZoneView";
import * as Constants from "@/core/Constants";

class CardClickHandler {
  public onPointerDown(_1: Phaser.Scene, _2: CardView, _3: Phaser.Input.Pointer): void {
    // No action is performed on pointerdown to allow Phaser to decide
    // if the movement will result in a "drag" or a click.
  }

  public onPointerUp(scene: Phaser.Scene, card: CardView, pointer: Phaser.Input.Pointer): void {
    if (!card.canBeClicked()) return;
  
    if (
      pointer.getDuration() < Constants.DRAG_TIME_THRESHOLD &&
      pointer.getDistance() < Constants.DRAG_DISTANCE_THRESHOLD
    ) {
      this.onSimpleClickCard(scene, card);
    }
  }

  // TODO completely incomplete, tasks:
  // BUG: It should only work on cards that are located in a zone
  // BUG: When clicking and activating the perspective, it is disabled after a short time
  private onSimpleClickCard(scene: Phaser.Scene, card: CardView) {
    const zones = scene.children.list.filter(child => child instanceof ZoneView) as ZoneView[];
    new CardActionPerspective(scene, card, zones).enter();
  }
}

export default CardClickHandler;
