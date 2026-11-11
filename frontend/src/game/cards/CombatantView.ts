import type { CardAudioType, CombatantCard } from "@/domain/Card";
import type { CardRender } from "@/game/cards/renders/CombatantRender";
import combatantRender from "@/game/cards/renders/CombatantRender";
import CardView from "@/game/cards/CardView";
import stackLayoutHelper from "@/game/cards/CardStackLayoutHelper";

class CombatantView extends CardView {
  private readonly stackedCards: CardView[] = [];

  public constructor(scene: Phaser.Scene, combatantCard: CombatantCard) {
    super(scene, combatantCard);
  }

  public override get cardRender(): CardRender {
    return combatantRender;
  }

  // Stacking logic

  /** Puts the pieces of equipment behind the card, the first one nearest, and slides them out while hovering (VIEW-14). */
  public stackEquipment(pieces: CardView[]) {
    for (const piece of pieces) {
      this.stackPiece(piece);
    }

    this.on('pointerout', this.hideStackedCards.bind(this));
    this.on('pointerover', this.revealStackedCards.bind(this));
  }

  private stackPiece(piece: CardView) {
    this.stackedCards.push(piece);

    const [xWithOffset, yWithOffset] = stackLayoutHelper.calculateOffset(this.stackedCards.length);
    piece.setOriginalPosition(xWithOffset, yWithOffset);
    piece.reset();
    piece.disableInteractive();
    piece.disableClicks();

    this.addAt(piece, 0);
    this.scene.input.setDraggable(piece, false);
  }

  private revealStackedCards() {
    this.stackedCards.forEach((piece, position) => stackLayoutHelper.revealCard(this, piece, position + 1));
  }

  private hideStackedCards() {
    this.stackedCards.forEach((piece, position) => stackLayoutHelper.hideCard(this, piece, position + 1));
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