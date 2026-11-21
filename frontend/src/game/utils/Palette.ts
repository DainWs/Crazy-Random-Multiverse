import EffectSettings from '@/core/EffectSettings';

/** Every color of `game/`, `core/` and `scenes/`, named by what it means. The values live only in `PALETTE` and `ACCESSIBLE_PALETTE`. */
type PaletteColor =
  | 'REJECTION_TEXT'
  | 'NOTICE_TEXT'
  | 'PANEL_FILL'
  | 'PANEL_BORDER'
  | 'SCREEN_VEIL'
  | 'TEXT_OUTLINE'
  | 'MARK_VALID'
  | 'MARK_INVALID'
  | 'MARK_SOURCE'
  | 'MARK_READY'
  | 'MARK_TURN_GLOW'
  | 'TURN_CROWN_DISC'
  | 'FORBIDDEN_ICON_DISC'
  | 'LIFT_SHADOW'
  | 'MARK_EDGE'
  | 'OWN_ZONE_LINES'
  | 'SLOT_FILL'
  | 'SLOT_BORDER'
  | 'SLOT_OWN_TINT'
  | 'SLOT_OWN_BORDER'
  | 'SLOT_SOURCE_FILL'
  | 'SLOT_VALID_FILL'
  | 'HUD_TEXT'
  | 'HUD_TEXT_LOCAL_TURN'
  | 'HUD_SPECTATOR_TEXT'
  | 'HUD_BUTTON'
  | 'HUD_BUTTON_HOVER'
  | 'HUD_BUTTON_PRIMARY'
  | 'HUD_BUTTON_PRIMARY_HOVER'
  | 'HUD_BUTTON_DESTRUCTIVE_HOVER'
  | 'HUD_FOCUS'
  | 'RESULT_VICTORY'
  | 'RESULT_DEFEAT'
  | 'HIT_FLASH'
  | 'HIT_FLASH_ARMOR'
  | 'LEADER_DEATH_TINT'
  | 'ELIMINATED_VEIL'
  | 'ELIMINATED_VEIL_BORDER'
  | 'ELIMINATED_LABEL'
  | 'LOAD_TEXT'
  | 'LOAD_BAR_FILL'
  | 'PRELOADER_BAR'
  | 'CARD_TEXT'
  | 'CARD_VALUE_POSITIVE'
  | 'CARD_VALUE_NEGATIVE'
  | 'CARD_VALUE_LABEL_DAMAGE'
  | 'CARD_VALUE_LABEL_ARMOR'
  | 'CARD_VALUE_LABEL_HEALTH'
  | 'ZONE_BAR_BACK'
  | 'ZONE_BAR_BORDER'
  | 'ZONE_BAR_HIGH'
  | 'ZONE_BAR_MEDIUM'
  | 'ZONE_BAR_LOW'
  | 'ZONE_NEXT_LABEL'
  | 'TOOLTIP_FILL'
  | 'TOOLTIP_NAME'
  | 'TOOLTIP_DESCRIPTION'
  | 'TOOLTIP_POSITIVE'
  | 'TOOLTIP_NEGATIVE'
  | 'TOOLTIP_EQUIPMENT_NAME'
  | 'TARGETING_VIGNETTE_CLEAR'
  | 'TARGETING_VIGNETTE_EDGE'
  | 'TABLE_CLASSIC_BACKGROUND'
  | 'TABLE_CLASSIC_BORDER'
  | 'TABLE_CLASSIC_GRID'
  | 'TABLE_EMERALD_BACKGROUND'
  | 'TABLE_EMERALD_BORDER'
  | 'TABLE_EMERALD_GRID'
  | 'TABLE_LAVA_BACKGROUND'
  | 'TABLE_LAVA_BORDER'
  | 'TABLE_LAVA_GRID';

const PALETTE = new Map<PaletteColor, number>([
  ['REJECTION_TEXT', 0xff6b6b],
  ['NOTICE_TEXT', 0xffffff],
  ['PANEL_FILL', 0x1b2631],
  ['PANEL_BORDER', 0x34495e],
  ['SCREEN_VEIL', 0x000000],
  ['TEXT_OUTLINE', 0x000000],
  ['MARK_VALID', 0x2ecc71],
  ['MARK_INVALID', 0xe74c3c],
  ['MARK_SOURCE', 0xe74c3c],
  ['MARK_READY', 0x00e5ff],
  ['MARK_TURN_GLOW', 0xf1c40f],
  ['TURN_CROWN_DISC', 0x111111],
  ['FORBIDDEN_ICON_DISC', 0x111111],
  ['LIFT_SHADOW', 0x000000],
  ['MARK_EDGE', 0x000000],
  ['OWN_ZONE_LINES', 0x3d9bff],
  ['SLOT_FILL', 0xffffff],
  ['SLOT_BORDER', 0x4488cc],
  ['SLOT_OWN_TINT', 0x9fd8ff],
  ['SLOT_OWN_BORDER', 0x3d9bff],
  ['SLOT_SOURCE_FILL', 0xd40000],
  ['SLOT_VALID_FILL', 0xaaffaa],
  ['HUD_TEXT', 0xffffff],
  ['HUD_TEXT_LOCAL_TURN', 0x2ecc71],
  ['HUD_SPECTATOR_TEXT', 0xbdc3c7],
  ['HUD_BUTTON', 0x34495e],
  ['HUD_BUTTON_HOVER', 0x46627f],
  ['HUD_BUTTON_PRIMARY', 0x1a5fa8],
  ['HUD_BUTTON_PRIMARY_HOVER', 0x2674c4],
  ['HUD_BUTTON_DESTRUCTIVE_HOVER', 0xc0392b],
  ['HUD_FOCUS', 0xffffff],
  ['RESULT_VICTORY', 0x2ecc71],
  ['RESULT_DEFEAT', 0xe74c3c],
  ['HIT_FLASH', 0xff0000],
  ['HIT_FLASH_ARMOR', 0x8a9aa5],
  ['LEADER_DEATH_TINT', 0x2b2b2b],
  ['ELIMINATED_VEIL', 0x3b0a0a],
  ['ELIMINATED_VEIL_BORDER', 0x1a0000],
  ['ELIMINATED_LABEL', 0xff5a4d],
  ['LOAD_TEXT', 0xffffff],
  ['LOAD_BAR_FILL', 0x2ecc71],
  ['PRELOADER_BAR', 0xffffff],
  ['CARD_TEXT', 0x000000],
  ['CARD_VALUE_POSITIVE', 0x00b800],
  ['CARD_VALUE_NEGATIVE', 0xe30000],
  ['CARD_VALUE_LABEL_DAMAGE', 0xff9a3c],
  ['CARD_VALUE_LABEL_ARMOR', 0x6ab7ff],
  ['CARD_VALUE_LABEL_HEALTH', 0x5fe08a],
  ['ZONE_BAR_BACK', 0x111111],
  ['ZONE_BAR_BORDER', 0xcccccc],
  ['ZONE_BAR_HIGH', 0x2ecc71],
  ['ZONE_BAR_MEDIUM', 0xf1c40f],
  ['ZONE_BAR_LOW', 0xe74c3c],
  ['ZONE_NEXT_LABEL', 0xf1c40f],
  ['TOOLTIP_FILL', 0x000000],
  ['TOOLTIP_NAME', 0xffd700],
  ['TOOLTIP_DESCRIPTION', 0xeeeeee],
  ['TOOLTIP_POSITIVE', 0x00ff00],
  ['TOOLTIP_NEGATIVE', 0xff0000],
  ['TOOLTIP_EQUIPMENT_NAME', 0xaaaaaa],
  ['TARGETING_VIGNETTE_CLEAR', 0xff0000],
  ['TARGETING_VIGNETTE_EDGE', 0x1a619b],
  ['TABLE_CLASSIC_BACKGROUND', 0x1a1a2e],
  ['TABLE_CLASSIC_BORDER', 0x4488cc],
  ['TABLE_CLASSIC_GRID', 0x3355aa],
  ['TABLE_EMERALD_BACKGROUND', 0x062c1e],
  ['TABLE_EMERALD_BORDER', 0x2ecc71],
  ['TABLE_EMERALD_GRID', 0x27ae60],
  ['TABLE_LAVA_BACKGROUND', 0x2c0606],
  ['TABLE_LAVA_BORDER', 0xe67e22],
  ['TABLE_LAVA_GRID', 0xc0392b]
]);

/** The colors that change in the accessible mode, so the marks reach the minimum contrasts (VIEW-40, UI-31). The others do not change. */
const ACCESSIBLE_PALETTE = new Map<PaletteColor, number>([
  ['SLOT_OWN_TINT', 0x1a4f95],
  ['SLOT_OWN_BORDER', 0x061a3a],
  ['ELIMINATED_VEIL_BORDER', 0xc04545]
]);

const RGB_CHANNEL_MASK = 0xff;
const HEX_DIGITS = 6;

/** The color as a number, for the fills, the lines and the tints of Phaser. */
function paletteFill(color: PaletteColor): number {
  const accessible = EffectSettings.accessibleModeIsOn() ? ACCESSIBLE_PALETTE.get(color) : undefined;

  return accessible ?? PALETTE.get(color)!;
}

/** The color as `#rrggbb`, for the texts and their backgrounds. */
function paletteText(color: PaletteColor): string {
  return `#${paletteFill(color).toString(16).padStart(HEX_DIGITS, '0')}`;
}

/** The color as `rgba(r, g, b, a)`, for the gradients of a canvas texture, which have no number form with alpha. */
function paletteRgba(color: PaletteColor, alpha: number): string {
  const value = paletteFill(color);
  const red = (value >> 16) & RGB_CHANNEL_MASK;
  const green = (value >> 8) & RGB_CHANNEL_MASK;
  const blue = value & RGB_CHANNEL_MASK;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/** The color as `#rrggbb` mixed with white: `whiteShare` is 0 for the color itself and 1 for white. */
function paletteMixedWithWhite(color: PaletteColor, whiteShare: number): string {
  const value = paletteFill(color);
  const mixChannel = (shift: number) => Math.round(((value >> shift) & RGB_CHANNEL_MASK) * (1 - whiteShare) + RGB_CHANNEL_MASK * whiteShare);

  return `#${[16, 8, 0].map((shift) => mixChannel(shift).toString(16).padStart(2, '0')).join('')}`;
}

export type { PaletteColor };
export { paletteFill, paletteMixedWithWhite, paletteRgba, paletteText, ACCESSIBLE_PALETTE, PALETTE };
