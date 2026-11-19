import type { PaletteColor } from '@/game/utils/Palette';
import * as Constants from '@/core/Constants';

type PanelRole = 'HUD' | 'NOTICE';
type ButtonRole = 'PRIMARY' | 'DESTRUCTIVE' | 'NEUTRAL';
type TextLevel = 'TITLE' | 'BODY' | 'LABEL' | 'NUMBERS';
type AccentRole = 'LOCAL_TURN' | 'POSITIVE' | 'NEGATIVE' | 'DISABLED' | 'FOCUS';

type PanelLook = {
  fill: PaletteColor;
  fillAlpha: number;
  border: PaletteColor | null;
  borderWidth: number;
};

type ButtonLook = {
  fill: PaletteColor;
  fillUnderPointer: PaletteColor;
  border: PaletteColor | null;
  text: PaletteColor;
};

type TextLook = {
  fontFamily: string;
  fontSize: string;
  color: PaletteColor;
};

type AccentLook = {
  color: PaletteColor;
  alpha: number;
};

/** The pieces the whole HUD is drawn with (`FX-17`). A skin is one more object of this type. */
type HudSkin = {
  panels: Map<PanelRole, PanelLook>;
  buttons: Map<ButtonRole, ButtonLook>;
  texts: Map<TextLevel, TextLook>;
  accents: Map<AccentRole, AccentLook>;
};

/** The font Phaser draws a text with when none is set. Phase 11.5 chooses the typeface. */
const DEFAULT_FONT_FAMILY = 'Courier';

const BUTTON_LOOK: ButtonLook = { fill: 'HUD_BUTTON', fillUnderPointer: 'HUD_BUTTON_HOVER', border: null, text: 'HUD_TEXT' };

const DEFAULT_HUD_SKIN: HudSkin = {
  panels: new Map<PanelRole, PanelLook>([
    ['HUD', { fill: 'PANEL_FILL', fillAlpha: 1, border: 'PANEL_BORDER', borderWidth: Constants.CONFIRM_DIALOG_BORDER_WIDTH }],
    ['NOTICE', { fill: 'PANEL_FILL', fillAlpha: Constants.GAME_RESULT_PANEL_ALPHA, border: null, borderWidth: 0 }]
  ]),
  buttons: new Map<ButtonRole, ButtonLook>([
    ['PRIMARY', BUTTON_LOOK],
    ['DESTRUCTIVE', BUTTON_LOOK],
    ['NEUTRAL', BUTTON_LOOK]
  ]),
  texts: new Map<TextLevel, TextLook>([
    ['TITLE', { fontFamily: DEFAULT_FONT_FAMILY, fontSize: Constants.GAME_RESULT_TITLE_FONT_SIZE, color: 'HUD_TEXT' }],
    ['BODY', { fontFamily: DEFAULT_FONT_FAMILY, fontSize: Constants.HUD_FONT_SIZE, color: 'HUD_TEXT' }],
    ['LABEL', { fontFamily: DEFAULT_FONT_FAMILY, fontSize: Constants.HUD_FONT_SIZE, color: 'HUD_SPECTATOR_TEXT' }],
    ['NUMBERS', { fontFamily: DEFAULT_FONT_FAMILY, fontSize: Constants.GAME_RESULT_DETAIL_FONT_SIZE, color: 'HUD_TEXT' }]
  ]),
  accents: new Map<AccentRole, AccentLook>([
    ['LOCAL_TURN', { color: 'HUD_TEXT_LOCAL_TURN', alpha: 1 }],
    ['POSITIVE', { color: 'RESULT_VICTORY', alpha: 1 }],
    ['NEGATIVE', { color: 'RESULT_DEFEAT', alpha: 1 }],
    ['DISABLED', { color: 'HUD_TEXT', alpha: Constants.HUD_DISABLED_ALPHA }],
    ['FOCUS', { color: 'HUD_FOCUS', alpha: 1 }]
  ])
};

export type { AccentLook, AccentRole, ButtonLook, ButtonRole, HudSkin, PanelLook, PanelRole, TextLevel, TextLook };
export { DEFAULT_HUD_SKIN };
