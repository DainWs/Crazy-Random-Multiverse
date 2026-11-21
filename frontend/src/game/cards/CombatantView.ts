import type { CardAudioType, CombatantCard } from "@/domain/Card";
import type { CardRender } from "@/game/cards/renders/CombatantRender";
import combatantRender from "@/game/cards/renders/CombatantRender";
import CardView from "@/game/cards/CardView";
import stackLayoutHelper, { calculateOffset, calculateRevealedOffset } from "@/game/cards/CardStackLayoutHelper";
import CardAnimator from "@/core/visual_effects/CardAnimator";
import { waitFor } from "@/core/visual_effects/Motion";
import type { CardQuad } from "@/game/cards/CardWarp";

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
    const warp = this.getWarp();
    if (warp) {
      piece.applyWarp(warp);
    }
    this.scene.input.setDraggable(piece, false);
  }

  public override applyWarp(quad: CardQuad) {
    super.applyWarp(quad);
    this.stackedCards.forEach((piece) => piece.applyWarp(quad));
  }

  public override clearWarp() {
    super.clearWarp();
    this.stackedCards.forEach((piece) => piece.clearWarp());
  }

  /** The newest piece slides out to the place it takes under the pointer, stays there and slides back behind the card (VIEW-36). */
  public async showLatestPiece(scene: Phaser.Scene, shownMs: number): Promise<void> {
    const index = this.stackedCards.length;
    const piece = this.stackedCards[index - 1];
    if (!piece) {
      return;
    }

    const [shownX, shownY] = calculateRevealedOffset(this.width, index);
    const [restX, restY] = calculateOffset(index);

    await CardAnimator.playTween(piece, 'horizontal_slide', shownX, shownY);
    await waitFor(scene, shownMs, 'ESSENTIAL');
    await CardAnimator.playTween(piece, 'horizontal_slide', restX, restY);
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