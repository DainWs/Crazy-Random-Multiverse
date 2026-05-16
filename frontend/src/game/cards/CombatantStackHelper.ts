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

    const originalBounds = this.combatant.getOriginalBounds();
    const { x, y, z, w } = originalBounds.position;
    const { width, height } = originalBounds.size;
    const { scaleX, scaleY } = originalBounds.scale;

    equipment.setOriginalPosition(x - this.offset, y - this.offset, z, w);
    equipment.setOriginalDepth(originalBounds.depth - 1);
    equipment.setOriginalSize(width, height);
    equipment.setOriginalScale(scaleX, scaleY);
    equipment.reset();

    this.combatant.scene.input.setDraggable(equipment, false);
    equipment.setInteractive({ useHandCursor: false });
  }

  public hasCardStacked(): boolean {
    return this.cardBehind !== undefined;
  }

  public getCardBehind(): CardView | undefined {
    return this.cardBehind;
  }


  // Propagations
  public propagatePosition(x?: number, y?: number, z?: number, w?: number): void {
    const xWithOffset = x ? x - this.offset : undefined;
    const yWithOffset = y ? y - this.offset : undefined;
    this.cardBehind?.setPosition(xWithOffset, yWithOffset, z, w);
  }

  public propagateSize(width: number, height: number): void {
    this.cardBehind?.setSize(width, height);
  }

  public propagateScale(scaleX: number, scaleY: number): void {
    this.cardBehind?.setScale(scaleX, scaleY);
  }

  public propagateDepth(depth: number): void {
    this.cardBehind?.setDepth(depth - 1);
  }


  // Original propagations
  public propagateOriginalPosition(x: number, y: number): void {
    this.cardBehind?.setOriginalPosition(x - this.offset, y - this.offset);
  }

  public propagateOriginalSize(width: number, height: number): void {
    this.cardBehind?.setOriginalSize(width, height);
  }

  public propagateOriginalScale(scale: number): void {
    this.cardBehind?.setOriginalScale(scale);
  }

  public propagateOriginalDepth(depth: number): void {
    this.cardBehind?.setOriginalDepth(depth - 1);
  }


  // Reset propagations
  public propagatePositionReset(): void {
    this.cardBehind?.resetPosition();
  }

  public propagateSizeReset(): void {
    this.cardBehind?.resetSize();
  }

  public propagateScaleReset(): void {
    this.cardBehind?.resetScale();
  }

  public propagateDepthReset(): void {
    this.cardBehind?.resetDepth();
  }

  public propagateReset(): void {
    this.cardBehind?.reset();
  }
}

export default CombatantStackHelper;