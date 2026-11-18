import { UNKNOWN_CARD_KEY } from '@/domain/ResourceKeys';
import resolveTween, { APPEAR_DURATION } from '@/core/visual_effects/OverlayTweens';
import { playMotion } from '@/core/visual_effects/Motion';
import Phaser from 'phaser';
import { paletteRgba } from '@/game/utils/Palette';

type TargetArea = {
  x: number,
  y: number,
  width: number,
  height: number
};

type TargetAreaCollector = () => TargetArea[];
const KEY = 'calm-targeting-overlay';

class CalmTargetingOverlay extends Phaser.GameObjects.Image{
  private collector: TargetAreaCollector;
  private targetImages: Phaser.GameObjects.Image[];

  constructor(scene: Phaser.Scene, collector: TargetAreaCollector) {
    super(scene, 0, 0, KEY);
    this.setDisplaySize(scene.cameras.main.width, scene.cameras.main.height);
    this.collector = collector;
    
    this.setOrigin(0, 0)
    this.setDepth(1000);
    this.setVisible(false);
    scene.add.existing(this);
  }

  public activate(): void {
    this.setVisible(true);
  
    const appearMotion = resolveTween(this, 'appear');
    const heartbeatMotion = { ...resolveTween(this, 'heartbeat'), delay: APPEAR_DURATION };

    void playMotion(this.scene, appearMotion);
    void playMotion(this.scene, heartbeatMotion);
    this.drawTargets();
  }

  public deactivate(): void {
    this.setVisible(false);

    this.scene.tweens.killTweensOf(this);
    void playMotion(this.scene, resolveTween(this, 'disappear'));

    for (const targetImage of this.targetImages) {
      targetImage.destroy(false);
    }
    this.targetImages = [];
  }

  private drawTargets(): void {
    for (const targetArea of this.collector()) {
      const centerX = targetArea.x + targetArea.width / 2;
      const centerY = targetArea.y + targetArea.height / 2;
      const targetImage = this.scene.add.image(centerX, centerY, UNKNOWN_CARD_KEY);
      targetImage.setDepth(this.depth);

      targetImage.on("pointerover", () => this.onTargetHover(targetImage));
      targetImage.on("pointerout", () => this.onTargetUnhover(targetImage));
      this.targetImages.push(targetImage);
    }
  }

  private onTargetHover(targetImage: Phaser.GameObjects.Image) {
    void playMotion(this.scene, resolveTween(targetImage, 'hover'));
  }

  private onTargetUnhover(targetImage: Phaser.GameObjects.Image) {
    void playMotion(this.scene, resolveTween(targetImage, 'unhover'));
  }

  public static generateTexture(scene: Phaser.Scene) {
    const baseSize = 500;

    const canvas = scene.textures.createCanvas(KEY, baseSize, baseSize);
    if (!canvas) throw new Error("Failed to generate '"+KEY+"' overlay");
    const context = canvas.getContext()

    const center = baseSize / 2;
    const initialRadius = 0;
    const endRadius = baseSize * 0.8;

    const gradient = context.createRadialGradient(
      center, center, initialRadius,
      center, center, endRadius
    );
    gradient.addColorStop(0, paletteRgba('TARGETING_VIGNETTE_CLEAR', 0))
    gradient.addColorStop(0.5, paletteRgba('TARGETING_VIGNETTE_CLEAR', 0))
    gradient.addColorStop(1, paletteRgba('TARGETING_VIGNETTE_EDGE', 1))

    context.fillStyle = gradient
    context.fillRect(0, 0, baseSize, baseSize)

    canvas.refresh()
  }
}

export type { TargetArea };
export default CalmTargetingOverlay;