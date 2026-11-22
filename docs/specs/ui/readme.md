# VIEW

Appearance of the interface: layout, animation and sound. This file keeps the `VIEW` rules not moved yet to a file of their own; the index of the files of `docs/specs/ui/` is the Appearance section of `docs/index.md`. Behavior is in `docs/specs/interface.md`. These rules gather what is already known and are expected to change as the game takes shape.

## HUD

- **VIEW-62** The HUD is what Phaser draws over the game while it is played, apart from the cards, and a rule that says "the HUD" means all of this. It is only the look and the place of each of its parts: the animations, the sounds and the effects are not part of the HUD, also those of its parts, so each card can have its own (`FX-22`). Nothing drawn by Vue is part of the HUD, so no skin reaches it (`FX-10`). Decided with the product owner on 2026-11-22.
  - **Part of the HUD:** the buttons (`VIEW-43`, the leave button of a spectator and the button of the game menu), the label of a spectator (`VIEW-28`), the round and the turn (`VIEW-44`), the side panel of a card (`VIEW-14`), the notices of turn, round and elimination (`VIEW-15`, `VIEW-11`), the message of a rejected action (`UI-6`), the confirmation dialog (`UI-15`), the names of the zones, the health bars of the leaders and the mark of who plays next (`VIEW-49` to `VIEW-51`), and the marks of the board of the legend of the help panel (`VIEW-58`: `VIEW-4`, `VIEW-11`, `VIEW-17`, `VIEW-20`, `VIEW-27`, `VIEW-32`).
  - **Not part of the HUD:** the board (table, zones, slots, cards and equipment) and the hand (`VIEW-16`); the animations, the sounds and the effects of every part of the game, those of combat included; the result (`VIEW-23`), which follows the skin of the HUD all the same (`FX-10`); the loading screen (`VIEW-29`); and everything drawn by Vue: the notices of the session and the connection (`UI-9`, `UI-10`, `UI-24`), the main menu and the party, the game menu, the settings screen and the help panel (`UI-33`, `UI-34`, `UI-36`).

## Other

- **VIEW-3** **[Post-MVP]** Rival hands are shown as card backs, a different one for each type and warrior rarity (`CON-13`).
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat, and for a click refused while attacking (`VIEW-4`).
- **VIEW-21** **[Post-MVP]** The rarer a card, the more audio variants each of its actions has: for example 1 for placing a Common card and 2 or 3 for a Mythic one.
- **VIEW-22** **[Post-MVP]** Leaders have one variant for each action, like a Common warrior. A piece of equipment has the variants of the rarity of the warrior it is attached to, and one while it has none (`FX-16`). Decided by the product owner on 2026-11-17. **[OPEN]** How many variants each rarity has for each action.
- **VIEW-10** **[Post-MVP]** Particles, special effects, a color-blind palette chosen in a settings screen (`UI-13`), the graphics quality and reduced motion options (`UI-27`), and responsive and touch layouts.
