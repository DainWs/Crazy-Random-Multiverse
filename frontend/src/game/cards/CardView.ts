import type { CardRender } from "@/game/cards/renders/CardRender";
import type { OriginalBounds, OriginalPosition, OriginalScale } from "@/game/cards/CardBounds";
import type Card from "@/domain/Card";
import { CARD_WIDTH, CARD_HEIGHT } from "@/game/cards/CardDimensions";
import { createCardArtwork } from "@/game/cards/CardArtwork";
import { buildDisplacementMap } from "@/game/cards/CardWarp";
import type { CardQuad } from "@/game/cards/CardWarp";
import { WARP_DISPLACEMENT_AMOUNT, WARP_PADDING } from "@/core/Constants";
import Phaser from "phaser";

abstract class CardView extends Phaser.GameObjects.Container {

  private originalBounds: OriginalBounds;

  /** Everything the card draws. It is the one that takes the filter of the perspective, because a filter on a rotated container turns out wrong. */
  protected readonly content: Phaser.GameObjects.Container;
  private warpQuad: CardQuad | null = null;
  private background: Phaser.GameObjects.Image;
  private cardImage: Phaser.GameObjects.Image;
  public abstract get cardRender(): CardRender;

  public readonly card: Card;

  protected allowClicks: boolean; // TODO search a way to improve this

  constructor(
    scene: Phaser.Scene,
    card: Card
  ) {
    super(scene);
    this.scale = 1;
    this.depth = 10;
    this.x = 0;
    this.y = 0;
    this.width = CARD_WIDTH;
    this.height = CARD_HEIGHT;
    this.setSize(this.width, this.height);

    this.originalBounds = {
      position: { x: this.x, y: this.y },
      size: { width: this.width, height: this.height },
      scale: { scaleX: this.scaleX, scaleY: this.scaleY },
      depth: this.depth
    };

    this.card = card;
    this.content = scene.add.container(0, 0);
    this.content.setSize(CARD_WIDTH, CARD_HEIGHT);
    this.add(this.content);

    this.initializeView();
    this.setInteractive({ draggable: true, useHandCursor: true });
    this.allowClicks = true;

    scene.input.setDraggable(this);
    scene.add.existing(this);
  }

  protected initializeView() {
    this.initializeBackground();
    this.initializeCardImage();
    this.content.add([this.cardImage, this.background]);
    this.content.add(this.cardRender.render(this.scene, this, this.width, this.height));
  }

  public override getByName<T extends Phaser.GameObjects.GameObject>(name: string): T {
    return this.content.getByName(name);
  }

  /** Draws the card inside `quad`, the corners of its slot in the space of the card (VIEW-1, VIEW-2). */
  public applyWarp(quad: CardQuad) {
    this.warpQuad = quad;
    this.content.enableFilters();
    const filters = this.content.filters;
    if (!filters) {
      return;
    }

    const key = this.ensureWarpTexture(quad);
    const { width, height } = this.scene.textures.get(key).getSourceImage();
    filters.internal.clear();
    const displacement = filters.internal.addDisplacement(key, WARP_DISPLACEMENT_AMOUNT, WARP_DISPLACEMENT_AMOUNT);
    displacement.setPaddingOverride(0, 0, 0, 0);
    this.content.focusFiltersOverride(undefined, undefined, width, height);
  }

  public clearWarp() {
    this.warpQuad = null;
    this.content.filters?.internal.clear();
  }

  public getWarp(): CardQuad | null {
    return this.warpQuad;
  }

  /** One map per quad: the slots of a board do not change, so a map is shared by every card that stands in its slot. */
  private ensureWarpTexture(quad: CardQuad): string {
    const key = `card-warp:${quad.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(":")}`;
    if (this.scene.textures.exists(key)) {
      return key;
    }

    const map = buildDisplacementMap(quad, { width: CARD_WIDTH, height: CARD_HEIGHT }, WARP_PADDING);
    const canvas = document.createElement("canvas");
    canvas.width = map.width;
    canvas.height = map.height;
    canvas.getContext("2d")!.putImageData(new ImageData(map.data, map.width, map.height), 0, 0);
    this.scene.textures.addCanvas(key, canvas);

    return key;
  }

  protected initializeBackground() {
    this.background = this.scene.add.image(0, 0, this.card.getTexture());
    this.background.setScale(this.scaleX, this.scaleY);
    this.background.setDisplaySize(this.width, this.height);
  }

  protected initializeCardImage() {
    const cardImageSize = this.background.displayWidth;
    const cardY = -(cardImageSize - this.background.displayHeight / 2);
    this.cardImage = createCardArtwork(this.scene, this.card.getImage(), 0, cardY, cardImageSize);
  }

  // General

  public canBeClicked(): boolean {
    return this.allowClicks;
  }

  public disableClicks(): void {
    this.allowClicks = false;
  }

  // Bounds modification methods
  public setPosition(x?: number, y?: number, z?: number, w?: number): this {
    return super.setPosition(x, y, z, w);
  }

  public setDepth(depth: number): this {
    return super.setDepth(depth);
  }

  public setScale(scaleX: number, scaleY?: number): this {
    return super.setScale(scaleX, scaleY);
  }

  // Original bounds methods
  public getOriginalBounds(): OriginalBounds {
    return this.originalBounds;
  }

  public setOriginalPosition(originalX: number, originalY: number, originalZ?: number, originalW?: number) {
    this.originalBounds.position = { x: originalX, y: originalY, z: originalZ, w: originalW };
  }

  public getOriginalPosition(): OriginalPosition {
    return this.originalBounds.position;
  }

  public setOriginalDepth(originalDepth: number) {
    this.originalBounds.depth = originalDepth;
  }

  public getOriginalDepth(): number {
    return this.originalBounds.depth;
  }

  public setOriginalScale(originalScaleX: number, originalScaleY?: number) {
    this.originalBounds.scale = { scaleX: originalScaleX, scaleY: originalScaleY };
  }

  public getOriginalScale(): OriginalScale {
    return this.originalBounds.scale;
  }


  // Reset bounds methods
  public reset(): void {
    this.resetPosition();
    this.resetScale();
    this.resetDepth();
  }

  public resetPosition(): void {
    const { x, y, z, w } = this.originalBounds.position;
    this.setPosition(x, y, z, w);
  }

  public resetDepth(): void {
    this.setDepth(this.originalBounds.depth);
  }

  public resetScale(): void {
    const { scaleX, scaleY } = this.originalBounds.scale;
    this.setScale(scaleX, scaleY);
  }

}

export { CardView };
export default CardView;
