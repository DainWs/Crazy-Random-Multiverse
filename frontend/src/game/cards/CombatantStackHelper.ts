import CardStackHelper, { BEHIND_CARD_OFFSET } from "@/game/cards/CardStackHelper";
import { CARD_WIDTH } from "@/game/cards/CardDimensions";
import type CardView from "@/game/cards/CardView";

function calculateStackedCardOffset(angle: number, offset: number): [number, number] {
  if (angle === 90) return [0, offset];
  if (angle === 180) return [offset, 0];
  if (angle === -90) return [0, -offset];
  return [-offset, 0];
}

function calculateRevealedCardOffset(angle: number, offset: number, cardWidth: number = CARD_WIDTH): [number, number] {
  const totalOffset = offset + cardWidth;
  if (angle === 90) return [0, totalOffset];
  if (angle === 180) return [totalOffset, 0];
  if (angle === -90) return [0, -totalOffset];
  return [-totalOffset, 0];
}

class CombatantStackHelper implements CardStackHelper {
  private readonly combatant: CardView;
  private readonly offset: number;
  private cardBehind?: CardView;

  public constructor(combatant: CardView, offset = BEHIND_CARD_OFFSET) {
    this.combatant = combatant;
    this.offset = offset;
  }

  public canStackMore(): boolean {
    return this.cardBehind === undefined;
  }

  public stack(equipment: CardView): void {
    if (this.cardBehind) {
      throw new Error("A card is already attached behind.");
    }

    this.cardBehind = equipment;
    const [xWithOffset, yWithOffset] = this.calculateOffsetPosition();
    this.cardBehind.setOriginalPosition(xWithOffset, yWithOffset);
    this.cardBehind.setOriginalDepth(this.combatant.depth - 1);
    this.cardBehind.setAngle(this.combatant.angle);
    this.cardBehind.reset();
    this.cardBehind.disableInteractive();

    this.combatant.addAt(this.cardBehind, 0);
    this.combatant.scene.input.setDraggable(this.cardBehind, false);

    this.combatant.on('pointerout', () => this.hideStackedCards());
    this.combatant.on('pointerover', () => this.showStackedCards());
  }

  public showStackedCards() {
    const [xWithOffset, yWithOffset] = this.calculateShowPosition();
    this.cardBehind?.applyTween('horizontal_slide', xWithOffset, yWithOffset);
  }

  public hideStackedCards() {
    const [xWithOffset, yWithOffset] = this.calculateOffsetPosition();
    this.cardBehind?.applyTween('horizontal_slide', xWithOffset, yWithOffset);
  }

  public calculateShowPosition(): [number, number] {
    return calculateRevealedCardOffset(this.combatant.angle, this.offset, CARD_WIDTH);
  }

  public calculateOffsetPosition(): [number, number] {
    return calculateStackedCardOffset(this.combatant.angle, this.offset);
  }

  public hasCardStacked(): boolean {
    return this.cardBehind !== undefined;
  }

  public getCardBehind(): CardView | undefined {
    return this.cardBehind;
  }
}

export { calculateStackedCardOffset, calculateRevealedCardOffset };
export default CombatantStackHelper;