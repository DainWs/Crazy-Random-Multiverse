# HUD: game menu

The look of the menu button and of the menu of the game screen (`UI-36`). The panel of the settings screen is in `UI-33` and the help panel in `docs/specs/ui/components/hud-help.md`. Decided with the product owner on 2026-11-22.

- **VIEW-60** The menu button and the menu:
  - **Button.** A square whose side is the height of every button of the HUD (`VIEW-61`), 16 px from the top edge and 16 px from the right edge of the screen, with the look of the buttons of the HUD: background `#34495e`, `#46627f` under the pointer, a border of `#34495e` 2 px thick and corners rounded 8 px. It shows a white gear, centered, as wide as 60% of the side of the button. It is the only button on the top edge of the game screen: the settings and help buttons it replaces are not drawn on it (`UI-34`).
  - **Menu.** A full-screen view: a black veil at 70% opacity, so the white and gold texts reach the contrast of `VIEW-40` over any card covers the whole window, with no panel, no border and no title. Over it, aligned to the left, the three options one under the other, 12 px apart, in this order: "Reanudar", "Ajustes" and "Ayuda". The column is 64 px from the left edge of the window and centered vertically. Each option is only its text, in white, at the body level of `VIEW-55`, with no background and no border. The veil covers the menu button too, so the button is not seen while the menu is open.
  - **Skins.** The options are the only part of the interface drawn this way, and no skin changes them (`FX-10`): the buttons of the HUD and of the dialogs have their own looks, which a skin can change. The menu button is one of those buttons.
  - **Selected option.** One option is always selected (`UI-36`). It is shown with two white marks: a left-pointing arrow 12 px to the right of its text, as tall as the text, so it points at the option, and an underline under the whole text, 2 px thick and 4 px under it. The other options have neither.
  - **Blink.** The underline of the selected option goes from 100% opacity down to 0% and back, as a smooth wave, once every 1600 ms. When the selection changes it starts again at 100% on the new option. The arrow does not blink. With the operating system asking for reduced motion, the underline does not blink and stays at 100% (`UI-30`).
  - **Chosen option.** When an option is chosen (`UI-36`), its text, its arrow and its underline turn gold `#f1c40f` at once, the underline stops blinking and stays at 100%, and 400 ms later the menu does what the option says. During those 400 ms the selection does not change and no other option can be chosen.
  - **Effects** (`UI-26`). The arrow and the underline are essential: they show which option Enter presses. The blink and the gold wait are non-essential: without them the underline stays at 100% and the option acts at once. The menu has no other animation: it appears and disappears at once.

## Scenarios

**Menu from the keyboard**
- Given the game screen with nothing open
- When the player presses Escape
- Then the menu opens over the board, with its options on the left, and "Reanudar" selected, with its arrow and its blinking underline

**Choosing an option**
- Given the menu open with "Ajustes" selected
- When the player presses Enter
- Then "Ajustes" turns gold with its arrow and its underline steady, and 400 ms later the menu closes and the settings screen opens

**Menu from the button**
- Given the game screen with nothing open
- When the player clicks the menu button
- Then the menu opens, as with Escape

**Opening the settings**
- Given the menu open
- When the player clicks "Ajustes"
- Then the menu closes and the settings screen opens
