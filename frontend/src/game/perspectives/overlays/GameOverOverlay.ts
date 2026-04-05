import Phaser from 'phaser';

const KEY = 'game-over-overlay';

export default class GameOverOverlay extends Phaser.GameObjects.Graphics {
  private static readonly BACKGROUND_COLOR = 0x323232;
  private static readonly MAX_FLICKER_OFFSET = 80;
  private static readonly VERTICAL_SCROLL_SPEED = 2;
  private static readonly COLOR_SHIFT_SPEED = 0.002;
  private static readonly DOT_STARTING_OFFSET = -50;
  private static readonly COLOR_SATURATION = 0.8;
  private static readonly COLOR_VALUE = 0.8;

  private sinTime: number = 0;
  private scrollOffsetX: number = 0;
  private scrollOffsetY: number = 5;
  private dotDiameter: number = 40;
  private gridSpacing: number = 40;
  private isAnimating: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene);
    
    this.setName(KEY);
    this.setDepth(1000);
    this.setVisible(false);
    scene.add.existing(this);

    this.bindAnimationToGameLoop(scene);
  }

  private bindAnimationToGameLoop(scene: Phaser.Scene): void {
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.updateAnimation, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.updateAnimation, this);
    });
  }

  public activate(): void {
    this.setVisible(true);
    this.isAnimating = true;
  }

  public deactivate(): void {
    this.setVisible(false);
    this.isAnimating = false;
  }

  private updateAnimation(): void {
    if (!this.isAnimating) return;

    this.clear();
    this.drawBackground();
    this.drawFlickeringDotGrid();
    this.advanceAnimationProgress();
  }

  private drawBackground(): void {
    this.fillStyle(GameOverOverlay.BACKGROUND_COLOR, 1);
    this.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
  }

  private drawFlickeringDotGrid(): void {
    const activeColor = this.calculateShiftingColor();
    this.fillStyle(activeColor, 1);

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const dotRadius = this.dotDiameter / 2;

    for (let x = GameOverOverlay.DOT_STARTING_OFFSET; x <= width; x += this.gridSpacing) {
      for (let y = GameOverOverlay.DOT_STARTING_OFFSET; y <= height; y += this.gridSpacing) {
        const flickerOffset = Math.random() * GameOverOverlay.MAX_FLICKER_OFFSET;
        this.fillCircle(x + this.scrollOffsetX + flickerOffset, y + this.scrollOffsetY + flickerOffset, dotRadius);
      }
    }
  }

  private calculateShiftingColor(): number {
    const hueOscillation = Phaser.Math.Percent(Math.sin(this.sinTime), -1, 1);
    const rgbColor = Phaser.Display.Color.HSVToRGB(hueOscillation, GameOverOverlay.COLOR_SATURATION, GameOverOverlay.COLOR_VALUE) as Phaser.Types.Display.ColorObject;
    return Phaser.Display.Color.GetColor(rgbColor.r, rgbColor.g, rgbColor.b);
  }

  private advanceAnimationProgress(): void {
    this.scrollOffsetY += GameOverOverlay.VERTICAL_SCROLL_SPEED;
    this.sinTime += GameOverOverlay.COLOR_SHIFT_SPEED;
  }
}