import CardStackHelper, { BEHIND_CARD_OFFSET } from "@/game/cards/CardStackHelper";
import CardView from "@/game/cards/CardView";

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

  private calculateShowPosition() {
    if (this.combatant.angle === 90) return [0, this.offset + CardView.WIDTH];
    if (this.combatant.angle === 180) return [this.offset + CardView.WIDTH, 0];
    if (this.combatant.angle === -90) return [0, -(this.offset + CardView.WIDTH)];
    return [-(this.offset + CardView.WIDTH), 0];
  }

  private calculateOffsetPosition() {
    if (this.combatant.angle === 90) return [0, this.offset];
    if (this.combatant.angle === 180) return [this.offset, 0];
    if (this.combatant.angle === -90) return [0, -this.offset];
    return [-this.offset, 0];
  }

  public hasCardStacked(): boolean {
    return this.cardBehind !== undefined;
  }

  public getCardBehind(): CardView | undefined {
    return this.cardBehind;
  }
}

export default CombatantStackHelper;