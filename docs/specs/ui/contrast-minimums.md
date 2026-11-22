# Minimum contrasts

The minimum contrast of the texts and of the marks of the board (Phase 11.1), so that what the player needs to read or to tell apart is seen against what is directly behind it. Decided by the product owner on 2026-11-19, after measuring the colors of the palette against their backgrounds and seeing sketches of the fixes.

- **VIEW-40** The texts and the panel of the round and the turn are in the base game. The marks are in the accessible mode only (`UI-31`): the base game keeps what it had before Phase 11.1, which is a tint of the own zone with fill `#9fd8ff` and border `#3d9bff`, a border of the slots of an eliminated zone of `#1a0000`, and frames with no near black edge. The tint of the own zone, the border of the eliminated zone and the near black edge below are drawn only in the accessible mode. Decided with the product owner on 2026-11-20. The contrast is the WCAG ratio between the relative luminance of the color of a text or of a mark and the color directly behind it. When what is behind is a panel, a fill or a veil that is translucent, that color is the one the panel, fill or veil gives over what is behind it. A text on the board with no panel is measured against the darkest and the lightest color of what can be behind it.
  - **Texts.** 4.5:1 for the texts of the HUD (`UI-3`, `VIEW-28`), the notices (`VIEW-15`), the side panel (`VIEW-14`), the result (`VIEW-23`), the loading screen (`VIEW-29`), the dialogs (`UI-15`) and the help panel (`VIEW-58`). 3:1 for those of 24 px or more, or of 19 px or more in bold, such as the title of the result, the label "Eliminado" and the name in the side panel. The texts of the cards on the board and the floating texts of the values (`VIEW-6`) are not covered.
  - **Disabled.** A disabled button (`UI-4`) is drawn at 40% opacity, as `VIEW-28` says, and is exempt: it must look disabled.
  - **Round and turn.** The text of the round and the turn (`UI-3`) is drawn on a panel with the fill of the palette of `VIEW-28` and the padding of its buttons, at the same place as before, so it is read against that fill and not against the background of the window. Phase 11.2 may change its place and size.
  - **Marks.** 3:1 for the frames, the tints and the lines of the marks of the board against what is behind them: the frames of `VIEW-17`, `VIEW-20`, `VIEW-32` and `VIEW-4` are drawn with a near black edge, 2 board units thick on each side of the colored line, under it, so they are seen against a light slot, a dark one or a white card. The L's and the dashes of `VIEW-39` are drawn with the same edge.
  - **Tint of the own zone** (`VIEW-27`). Fill `#1a4f95` and border `#061a3a`, with the opacity they have. The diagonal lines of `VIEW-39` are `#3d9bff` instead of the color of the border, so they are seen over the tint.
  - **Veil of an eliminated zone** (`VIEW-11`). The border of its slots is `#c04545`.

## Measured on 2026-11-19

Against the colors that were then in the palette, at their opacity over the table of `TABLE_CLASSIC_BACKGROUND`. What did not reach the minimum is fixed by this rule.

- Round and turn, green over the background of the window (the text of the turn of the local player is gold since 2026-11-21, `docs/specs/ui/palette.md`): 3.15:1 at the worst point, 3.3:1 the median. White, on a rival's turn: 6.6:1.
- Frames against the neutral slot: cyan 2.50, gold 2.32, green 1.83, red 1.01. Against a white card: cyan 1.54, gold 1.66, green 2.10, red 3.82.
- Tint of the own zone against the neutral slot: 1.34 the border, 2.52 the fill. Border of the veil against the veil: 1.18.
- Everything else was above its minimum: the lowest was the title of defeat, 4.05 for a minimum of 3, and the negative values of the side panel, 5.25 for 4.5.

## Scenarios

**Round and turn**
- Given a game on a background of any color
- When the round and the turn are shown
- Then the text is read on a panel, and a text of any color of the HUD reaches 4.5:1 against it

**Marks**
- Given a card that can attack on a white card and on a light slot
- When its frame is drawn
- Then the colored line has a near black edge on each side
