import { Statistic } from "@/domain/Statistics";
import * as TextUtils from "@/game/utils/TextUtils";
import { showDebugBoxes } from "@/env";

type IconPosition = 'left' | 'right' | 'top' | 'bottom';

class CardStatisticView extends Phaser.GameObjects.Container {
  private statisticIcon: Phaser.GameObjects.Image;
  private statisticText: Phaser.GameObjects.Text;
  private box: Phaser.GameObjects.Rectangle | undefined;

  private iconPosition: IconPosition;

  public readonly statistic: Statistic;

  constructor(
    scene: Phaser.Scene,
    statistic: Statistic
  ) {
    super(scene);
    this.iconPosition = 'left';

    this.statistic = statistic;

    if (showDebugBoxes) {
      this.box = this.scene.add.rectangle(0, 0);
      this.box.setFillStyle(0x00FF00, 0.5);
      this.box.setStrokeStyle(1, 0x000000);
      this.add(this.box);
    }

    this.statisticIcon = this.scene.add.image(0, 0, this.statistic.icon());
    this.statisticText = this.scene.add.text(0, 0, this.statistic.text());
    this.add([this.statisticIcon, this.statisticText]);

    this.updateChildren();
    scene.add.existing(this);
  }

  private updateChildren() {
    const gap = this.width * 0.03;

    const textWidth = this.displayWidth;
    const textHeight = this.displayHeight * 0.7;
    const fontSize = Math.floor(textHeight * 2);
    this.statisticText.setPosition(0, 0);
    this.statisticText.setSize(textWidth, textHeight);
    this.statisticText.setOrigin(0.5, 0.5);
    this.statisticText.setFontSize(fontSize)
    this.statisticText.setColor('#000000');
    TextUtils.fitText(this.statisticText, textWidth, textHeight);

    const iconSize = this.width * 0.5;
    const iconPosition = this.getIconPosition(iconSize, gap);
    this.statisticIcon.setDisplaySize(iconSize, iconSize);
    this.statisticIcon.setPosition(iconPosition.x, iconPosition.y);
    this.statisticIcon.setOrigin(0.5, 0.5);

    if (showDebugBoxes && this.box) {
      this.box.setSize(textWidth, textHeight);
    }
  }

  private getIconPosition(iconSize: number, gap: number) {
    const xSide = this.width / 2 + iconSize / 2 + gap;
    const ySide = this.height / 2 + iconSize / 2 - gap;

    if (this.iconPosition === 'left') {
      return { x: -xSide, y: 0 };
    }

    if (this.iconPosition === 'right') {
      return { x: xSide, y: 0 };
    }

    if (this.iconPosition === 'top') {
      return { x: 0, y: -ySide };
    }

    return { x: 0, y: ySide };
  }
  
  setPosition(x?: number, y?: number, z?: number, w?: number): this {
    super.setPosition(x, y, z, w);

    if (this.statisticIcon && this.statisticText) {
      this.updateChildren();
    }

    return this;
  }

  setSize(width: number, height: number): this {
    super.setSize(width, height);

    if (this.statisticIcon && this.statisticText) {
      this.updateChildren();
    }

    return this;
  }

  setDisplaySize(width: number, height: number): this {
    super.setDisplaySize(width, height);

    if (this.statisticIcon && this.statisticText) {
      this.updateChildren();
    }

    return this;
  }

  setIconPosition(position: IconPosition): this {
    this.iconPosition = position;
    this.updateChildren();
    return this;
  }

  setTextColor(color: string): this {
    this.statisticText.setColor(color);
    return this;
  }

  setIconVisibility(visible: boolean): this {
    this.statisticIcon.setVisible(visible);
    return this;
  }
    
}


export { CardStatisticView };
