import type { AccentRole, ButtonLook, ButtonRole, HudSkin, PanelRole, TextLevel } from '@/game/hud/HudSkin';
import type { PaletteColor } from '@/game/utils/Palette';
import * as Constants from '@/core/Constants';
import { DEFAULT_HUD_SKIN } from '@/game/hud/HudSkin';
import { paletteFill, paletteMixed, paletteMixedWithWhite, paletteText } from '@/game/utils/Palette';
import { playMotion } from '@/core/visual_effects/Motion';

/** What a view changes of a text of a level: the size and the color of the few that do not follow the level yet. */
type TextOverrides = {
  fontSize?: string;
  color?: PaletteColor;
};

/** A panel of the skin, not placed nor sized: its place is in the layout of the view that uses it. */
function createPanel(scene: Phaser.Scene, role: PanelRole, skin: HudSkin = DEFAULT_HUD_SKIN): Phaser.GameObjects.Rectangle {
  const look = skin.panels.get(role)!;
  const panel = scene.add.rectangle(0, 0, 0, 0, paletteFill(look.fill), look.fillAlpha);

  if (look.border) {
    panel.setStrokeStyle(look.borderWidth, paletteFill(look.border));
  }

  return panel;
}

/** The fill of a panel as `#rrggbb`, for the texts that draw it as their own background. */
function panelBackground(role: PanelRole, skin: HudSkin = DEFAULT_HUD_SKIN): string {
  return paletteText(skin.panels.get(role)!.fill);
}

/** A text button of the skin with its look under the pointer, not placed: the view sets its origin, place and click. */
function createButton(scene: Phaser.Scene, role: ButtonRole, label: string, skin: HudSkin = DEFAULT_HUD_SKIN): Phaser.GameObjects.Text {
  const look = skin.buttons.get(role)!;
  const button = createText(scene, 'BODY', { color: look.text }, label, skin);
  button.setBackgroundColor(paletteText(look.fill));
  button.setPadding(Constants.HUD_BUTTON_PADDING);
  button.setInteractive({ useHandCursor: true });
  const underPointer = { value: 0 };
  underPointerShares.set(button, underPointer);
  button.on('pointerover', () => changeUnderPointer(scene, button, underPointer, 1, look));
  button.on('pointerout', () => changeUnderPointer(scene, button, underPointer, 0, look));

  return button;
}

/** How much of the way from the fill to the fill under the pointer a button has gone: 0 at rest, 1 under the pointer. */
const underPointerShares = new WeakMap<Phaser.GameObjects.Text, { value: number }>();

function underPointerShare(button: Phaser.GameObjects.Text): number {
  return underPointerShares.get(button)?.value ?? 0;
}

/** The background goes to the one under the pointer, or back, in 150 ms, from the one it has reached (VIEW-28). */
function changeUnderPointer(
  scene: Phaser.Scene,
  button: Phaser.GameObjects.Text,
  share: { value: number },
  target: number,
  look: ButtonLook
) {
  scene.tweens.killTweensOf(share);

  void playMotion(scene, {
    targets: share,
    to: { value: target },
    duration: 'FAST',
    curve: 'ENTER',
    kind: 'NON_ESSENTIAL',
    onUpdate: () => button.setBackgroundColor(paletteMixed(look.fill, look.fillUnderPointer, share.value))
  });
}

/** The fill of a button of the skin as `#rrggbb`, mixed with white by `whiteShare` (0 to 1), for what pulses over it. */
function buttonFill(role: ButtonRole, whiteShare: number, skin: HudSkin = DEFAULT_HUD_SKIN): string {
  return paletteMixedWithWhite(skin.buttons.get(role)!.fill, whiteShare);
}

/** A text of a level of the skin, not placed. */
function createText(
  scene: Phaser.Scene,
  level: TextLevel,
  overrides: TextOverrides = {},
  text: string = '',
  skin: HudSkin = DEFAULT_HUD_SKIN
): Phaser.GameObjects.Text {
  const look = skin.texts.get(level)!;
  const style = {
    fontFamily: look.fontFamily,
    fontSize: overrides.fontSize ?? look.fontSize,
    color: paletteText(overrides.color ?? look.color)
  };

  return scene.add.text(0, 0, text, style);
}

/** The frame that shows which button has the keyboard focus, not placed nor sized (VIEW-42). */
function createFocusFrame(scene: Phaser.Scene, skin: HudSkin = DEFAULT_HUD_SKIN): Phaser.GameObjects.Rectangle {
  const look = skin.accents.get('FOCUS')!;
  const frame = scene.add.rectangle(0, 0, 0, 0);
  frame.setStrokeStyle(Constants.FOCUS_FRAME_WIDTH, paletteFill(look.color), look.alpha);

  return frame;
}

/** The color of an accent as `#rrggbb`. */
function accentColor(role: AccentRole, skin: HudSkin = DEFAULT_HUD_SKIN): string {
  return paletteText(skin.accents.get(role)!.color);
}

/** The alpha of an accent: below 1 for what cannot be used. */
function accentAlpha(role: AccentRole, skin: HudSkin = DEFAULT_HUD_SKIN): number {
  return skin.accents.get(role)!.alpha;
}

export type { TextOverrides };
export { accentAlpha, accentColor, buttonFill, createButton, createFocusFrame, createPanel, createText, panelBackground, underPointerShare };
