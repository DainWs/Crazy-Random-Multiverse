import type { SpellCard } from "@/domain/Card";
import type { CardRender } from "@/game/cards/renders/SpellRender";
import spellRender from "@/game/cards/renders/SpellRender";
import CardView from "@/game/cards/CardView";

class SpellView extends CardView {

  public constructor(scene: Phaser.Scene, spellCard: SpellCard) {
    super(scene, spellCard);
  }

  public override get cardRender(): CardRender {
    return spellRender;
  }

  public get spell(): SpellCard {
    return this.card as SpellCard
  }
}

export default SpellView;