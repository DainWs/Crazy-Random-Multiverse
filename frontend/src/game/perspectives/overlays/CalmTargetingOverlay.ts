import resolveTween from '@/core/visual_effects/OverlayTweens';
import Phaser from 'phaser';

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

  private tween: Phaser.Tweens.Tween;

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
  
    const appearTween = resolveTween(this, 'appear');
    const heartbeatTween = resolveTween(this, 'heartbeat');
    heartbeatTween.delay = appearTween.duration;

    this.tween = this.scene.tweens.addMultiple([appearTween, heartbeatTween])[1];
    this.drawTargets();
  }

  public deactivate(): void {
    this.setVisible(false);

    const disappearTween = resolveTween(this, 'disappear');
    this.scene.tweens.remove(this.tween);
    this.scene.tweens.add(disappearTween);

    for (const targetImage of this.targetImages) {
      targetImage.destroy(false);
    }
    this.targetImages = [];
  }

  private drawTargets(): void {
    console.log(this.collector())
    for (const targetArea of this.collector()) {
      const centerX = targetArea.x + targetArea.width / 2;
      const centerY = targetArea.y + targetArea.height / 2;
      console.log(targetArea.x);
      console.log(targetArea.y);
      const targetImage = this.scene.add.image(centerX, centerY, 'unknown');
      targetImage.setDepth(this.depth);

      targetImage.on("pointerover", () => this.onTargetHover(targetImage));
      targetImage.on("pointerout", () => this.onTargetUnhover(targetImage));
      this.targetImages.push(targetImage);
    }
  }

  private onTargetHover(targetImage: Phaser.GameObjects.Image) {
    const tween = resolveTween(targetImage, 'hover');
    this.scene.tweens.add(tween);
  }

  private onTargetUnhover(targetImage: Phaser.GameObjects.Image) {
    const tween = resolveTween(targetImage, 'unhover');
    this.scene.tweens.add(tween);
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
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0)')
    gradient.addColorStop(1, 'rgb(26, 97, 155)')

    context.fillStyle = gradient
    context.fillRect(0, 0, baseSize, baseSize)

    canvas.refresh()
  }
}

export type { TargetArea };
export default CalmTargetingOverlay;