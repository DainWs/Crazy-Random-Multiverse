import Phaser from 'phaser';

type TargetGameObject = 
  Phaser.GameObjects.Components.ComputedSize & 
  Phaser.GameObjects.Components.Transform & 
  Phaser.GameObjects.Components.Visible;

class CalmTargetingOverlay extends Phaser.GameObjects.Graphics {
  private targets: TargetGameObject[];
  private pulseTimer: number = 0;
  private pulseDuration: number = 2000;
  private baseAlpha: number = 0.3;
  private maxAlpha: number = 0.6;
  private baseRadius: number = 30;
  private color: number = 0x4682b4;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.targets = [];
    this.pulseTimer = 0;
    this.pulseDuration = 2000;
    this.baseRadius = 30;
    this.color = 0x4682b4;
    this.setDepth(1000);

    this.setVisible(false);
    scene.add.existing(this);
  }

  public setTargets(...targets: TargetGameObject[]): void {
    this.targets = targets;
  }

  public activate(): void {
    this.setVisible(true);
    this.pulseTimer = 0;
  }

  public deactivate(): void {
    this.setVisible(false);
  }

  preUpdate(time: number, delta: number): void {
    if (!this.visible) return;

    this.pulseTimer += delta;
    if (this.pulseTimer > this.pulseDuration) {
      this.pulseTimer -= this.pulseDuration;
    }

    const { width, height } = this.scene.sys.game.canvas;
    this.clear();

    this.drawRadialOverlay(width, height);
    this.drawTargets();
  }

  private drawRadialOverlay(width: number, height: number): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width / 1.2;
    const steps = 10;

    for (let i = steps; i >= 1; i--) {
      const radius = (maxRadius / steps) * i;
      const alpha = (i / steps) * 0.5;

      this.fillStyle(this.color, alpha);
      this.fillCircle(centerX, centerY, radius);
    }

    this.fillStyle(this.color, 0);
    this.fillCircle(centerX, centerY, width / 4);
  }

  private drawTargets(): void {
    const normalizedTime = this.pulseTimer / this.pulseDuration;
    const radians = normalizedTime * Math.PI * 2;
    const pulseProgress = (Math.sin(radians) + 1) / 2;
    const radius = this.baseRadius + pulseProgress * 10;
    const alphaStroke = 0.7 * pulseProgress;
    const alphaFill = 0.2 * pulseProgress;

    for (const target of this.targets) {
      const centerX = target.x + target.displayWidth / 2;
      const centerY = target.y + target.displayHeight / 2;

      this.lineStyle(3, 0x4682b4, alphaStroke);
      this.strokeCircle(centerX, centerY, radius);

      this.fillStyle(0x4682b4, alphaFill);
      this.fillCircle(centerX, centerY, radius);
    }
  }
}

export default CalmTargetingOverlay;