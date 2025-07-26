import CardStackHelper from "@/game/cards/CardStackHelper";
import CardView from "@/game/cards/CardView";

class CombatantStackHelper implements CardStackHelper {
  private readonly combatant: CardView;
  private readonly offset: number;
  private cardBehind?: CardView;

  public constructor(combatant: CardView, offset = 20) {
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

    const position = this.combatant.getOriginalPosition();
    const depth = this.combatant.getOriginalDepth();

    equipment.setOriginalPosition(position.x - this.offset, position.y - this.offset);
    equipment.setOriginalDepth(depth - 1);
    equipment.resetPosition();

    this.combatant.scene.input.setDraggable(equipment, false);
    equipment.setInteractive({ useHandCursor: false });
    // card.disableClick(); // TODO deprecated?
  }

  public hasCardStacked(): boolean {
    return this.cardBehind !== undefined;
  }

  public getCardBehind(): CardView | undefined {
    return this.cardBehind;
  }

  public propagatePosition(x?: number, y?: number, z?: number, w?: number): void {
    const xWithOffset = x ? x - this.offset : undefined;
    const yWithOffset = y ? y - this.offset : undefined;
    this.cardBehind?.setPosition(xWithOffset, yWithOffset, z, w);
  }

  public propagateDepth(depth: number): void {
    this.cardBehind?.setDepth(depth - 1);
  }

  public propagateOriginalPosition(x: number, y: number): void {
    this.cardBehind?.setOriginalPosition(x - this.offset, y - this.offset);
  }

  public propagateOriginalDepth(depth: number): void {
    this.cardBehind?.setOriginalDepth(depth - 1);
  }

  public propagatePositionReset(): void {
    this.cardBehind?.resetPosition();
  }

  public propagateDepthReset(): void {
    this.cardBehind?.resetDepth();
  }

  public propagateReset(): void {
    this.cardBehind?.resetPosition();
    this.cardBehind?.resetDepth();
  }
}

export default CombatantStackHelper;