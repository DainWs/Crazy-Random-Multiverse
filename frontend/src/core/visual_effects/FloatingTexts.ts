import type { DamageIcon } from '@/game/cards/DamageIcons';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import type { PaletteColor } from '@/game/utils/Palette';
import type { GameScene } from '@/scenes/Game';
import { boxOfSlot, damageTextSize } from '@/game/cards/CombatLayout';
import { damageIconOutline } from '@/game/cards/DamageIcons';
import { playMotion } from '@/core/visual_effects/Motion';
import * as Constants from '@/core/Constants';
import { paletteFill, paletteText } from '@/game/utils/Palette';

/** A text that rises from a card with what it lost or gained, and the icon of that value, if it has one (VIEW-6, VIEW-36). */
type FloatingText = {
  text: string;
  icon: DamageIcon | null;
  color: PaletteColor;
};

/**
 * The texts rise from the top edge of the card, the first one at the bottom and the next ones stacked above it, and fade out.
 * They are placed in the world, not in the slot, because the slot is rotated with its zone and the text would turn upside down.
 */
async function showFloatingTexts(scene: GameScene, slot: ZoneSlotView, texts: FloatingText[]): Promise<void> {
  const unitsPerPixel = scene.cardValueUnitsPerPixel();
  const world = slot.getWorldTransformMatrix();
  const box = boxOfSlot(slot.corners, { x: world.tx, y: world.ty }, world.scaleX);
  const size = damageTextSize(Math.max(box.width, box.height) / unitsPerPixel, Constants.DAMAGE_TEXT_SIZE_FRACTION, Constants.DAMAGE_TEXT_MIN_SIZE);
  const stackStep = size * (1 + Constants.FLOATING_TEXT_STACK_GAP_FRACTION) * unitsPerPixel;

  await Promise.all(texts.map((content, index) => {
    const label = createLabel(scene, content, size);
    label.setScale(unitsPerPixel);
    label.setPosition(box.center.x, box.center.y - box.height / 2 - index * stackStep);
    label.setDepth(Constants.DAMAGE_TEXT_DEPTH);

    return rise(scene, label, unitsPerPixel);
  }));
}

/** It rises 40 px in 400 ms, slowing down at the end, and then fades out in 250 ms, speeding up, so it lasts 650 ms (VIEW-6). */
async function rise(scene: GameScene, label: Phaser.GameObjects.Container, unitsPerPixel: number): Promise<void> {
  await playMotion(scene, {
    targets: label,
    to: { y: label.y - Constants.DAMAGE_TEXT_RISE * unitsPerPixel },
    duration: 'SLOW',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  });
  await playMotion(scene, { targets: label, to: { alpha: 0 }, duration: 'MEDIUM', curve: 'LEAVE', kind: 'ESSENTIAL' });

  label.destroy();
}

/** The icon and the number side by side, `size` pixels tall, with the bottom edge and the middle of the whole at the origin. */
function createLabel(scene: GameScene, content: FloatingText, size: number): Phaser.GameObjects.Container {
  const outline = size * Constants.DAMAGE_TEXT_OUTLINE_FRACTION;
  const text = scene.add.text(0, 0, content.text, {
    fontSize: `${size}px`,
    color: paletteText(content.color),
    stroke: paletteText('TEXT_OUTLINE'),
    strokeThickness: outline
  });
  text.setOrigin(0, 1);

  const iconWidth = content.icon ? size + size * Constants.DAMAGE_TEXT_ICON_GAP_FRACTION : 0;
  const left = -(iconWidth + text.width) / 2;
  text.setX(left + iconWidth);

  const label = scene.add.container(0, 0, [text]);
  if (content.icon) {
    label.add(createIcon(scene, content, size, outline, left));
  }

  return label;
}

function createIcon(scene: GameScene, content: FloatingText, size: number, outline: number, left: number): Phaser.GameObjects.Graphics {
  const icon = scene.add.graphics();
  const points = damageIconOutline(content.icon!, size);

  icon.fillStyle(paletteFill(content.color), 1);
  icon.lineStyle(outline, paletteFill('TEXT_OUTLINE'), 1);
  icon.beginPath();
  icon.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    icon.lineTo(point.x, point.y);
  }
  icon.closePath();
  icon.fillPath();
  icon.strokePath();
  icon.setPosition(left + size / 2, -size / 2);

  return icon;
}

export type { FloatingText };
export { showFloatingTexts };
