import type { CardAudioType, CombatantCard } from "@/domain/Card";
import type { CardStackLayoutHelper } from "@/game/cards/CardStackLayoutHelper";
import type { CardRender } from "@/game/cards/renders/CombatantRender";
import combatantRender from "@/game/cards/renders/CombatantRender";
import CardView from "@/game/cards/CardView";
import baseCardStackLayoutHelper from "@/game/cards/CardStackLayoutHelper";

class CombatantView extends CardView {
  // TODO when mouse over stacked card, it should show the tooltip of the stacked card, this include to slide the cards to show the stacked card
  private stackHelper?: CardStackLayoutHelper;
  private stackedCard: CardView;

  public constructor(scene: Phaser.Scene, combatantCard: CombatantCard) {
    super(scene, combatantCard);
  }

  protected override initializeView() {
    super.initializeView();

    this.stackHelper = baseCardStackLayoutHelper;
  }

  public override get cardRender(): CardRender {
    return combatantRender;
  }

  // Stacking logic

  public stack(card: CardView) {
    if (this.stackHelper && this.stackedCard === undefined) {
      this.stackedCard = card;

      const [xWithOffset, yWithOffset] = this.stackHelper.calculateOffset(this.angle);
      this.stackedCard.setOriginalPosition(xWithOffset, yWithOffset);
      this.stackedCard.setOriginalDepth(this.depth - 1);
      this.stackedCard.setAngle(this.angle);
      this.stackedCard.reset();
      this.stackedCard.disableInteractive();

      this.addAt(this.stackedCard, 0);
      this.scene.input.setDraggable(this.stackedCard, false);

      this.on('pointerout', () => this.stackHelper?.hideCard(this, this.stackedCard));
      this.on('pointerover', () => this.stackHelper?.revealCard(this, this.stackedCard));

      this.stackedCard.disableClicks(); // TODO deprecated and temporal
    }
  }


  // @deprecated mover fuera
  public playSoundForAction(type: CardAudioType) {
    const audioResource = this.card.getAudio(type);
    if (this.scene.cache.audio.exists(audioResource)) {
      this.scene.sound.play(audioResource, { volume: 0.5 });
    } else {
      console.warn(`Audio key "${audioResource}" not found in cache.`);
    }
  }

  public get combatant(): CombatantCard {
    return this.card as CombatantCard
  }
}

export default CombatantView;