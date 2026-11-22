# Palette

The colors of the interface (Phase 11.5): what each one means, so the player learns it once and finds it everywhere. Decided with the product owner on 2026-11-21. The accessible mode (`UI-31`) changes only the colors listed in `docs/specs/ui/contrast-minimums.md`. The colors of the battlefield skins (`FX-10`) are not in this table.

- **VIEW-52** Every color of the interface has one meaning, the one of its row below, and every use of that meaning draws that color. A row can have variants of the same hue, only when a text or a frame needs more contrast over a different background, and a variant keeps the meaning of its row. Red and green have a polarity: red is what is bad for the player and green what is good for them. The zone of an eliminated player is the dark red of its row, a kept exception of the product owner. A new color in the interface needs a row here first. The samples of the legend of the help panel (`VIEW-58`) draw each mark with the colors of its rows, so they are not listed again in the table.

## Table

| Color | Hex | Meaning | Where it is drawn |
|---|---|---|---|
| Green | `#2ecc71` | Good: allowed, gained, healthy or done | Frame of a valid target (`VIEW-4`) and of a valid slot (`VIEW-32`), "+N" of a value that goes up and values that add (`VIEW-6`, `VIEW-14`, `VIEW-36`), "Victoria" (`VIEW-23`), fill of the health bar (`VIEW-50`), fill of the loading bar (`VIEW-29`) |
| Green on light | `#00b800` | Green over a white card | Values that add, on the card (`VIEW-36`) |
| Light green | `#aaffaa` | Fill of the valid slot, at 45% opacity | Slot where the dragged card can go (`VIEW-32`) |
| Red | `#e74c3c` | Bad: harm, refused or lost | Frame and crossed circle of a target that cannot be attacked (`VIEW-4`), flash of a card that lost health (`VIEW-5`), "−N" of health (`VIEW-6`), "Derrota" (`VIEW-23`) |
| Red on dark | `#ff6b6b` | Red as a text over a dark background | Rejection message (`UI-6`), values that subtract in the side panel (`VIEW-14`), label "Eliminado" (`VIEW-11`) |
| Red on light | `#e30000` | Red over a white card | Values that subtract, on the card (`VIEW-36`) |
| Red button | `#c0392b` | Red as a background that keeps a white text at 4.5:1 | Surrender button under the pointer (`VIEW-43`) |
| Dark red | `#3b0a0a` | The zone of an eliminated player, at 80% opacity; its border is `#1a0000`, and `#c04545` in the accessible mode | Veil of the slots (`VIEW-11`) |
| Orange | `#ff9a3c` | Where the dragged card comes from | Frame of the slot of origin, and its fill at 45% opacity (`VIEW-32`) |
| Gold | `#f1c40f` | The turn | Frame and crown of the leader with the turn (`VIEW-20`, `VIEW-39`), the "▶" and the name of the player who plays next (`VIEW-51`), the text of the round and the turn on the turn of the local player (`UI-3`) |
| Cyan | `#00e5ff` | The card can attack now | Frame or L's of an own card that can attack (`VIEW-17`, `VIEW-39`), the line "Puede atacar este turno" of the side panel (`VIEW-59`) |
| Blue | `#9fd8ff` fill and `#3d9bff` border; `#1a4f95` and `#061a3a` in the accessible mode | What is the local player's | Tint of the slots of the own zone (`VIEW-27`) |
| Blue line | `#3d9bff` | The second signal of the own zone | Diagonal lines (`VIEW-39`) |
| Button blue | `#1a5fa8`, `#2674c4` under the pointer | The action of the player that ends the turn | End turn button (`VIEW-43`) |
| Steel grey | `#8a9aa5` | Armor lost | Flash of a card that lost armor (`VIEW-5`), "−N" of armor (`VIEW-6`) |
| Dark grey | `#2b2b2b` | A dead leader | Tint of the leader that dies (`VIEW-7`) |
| White | `#ffffff` | Text and frames over a dark background | Texts of the HUD, notices, dialogs, result, loading screen, side panel and help panel (`VIEW-58`); floating "0" (`VIEW-6`); the frame of the keyboard focus (`VIEW-42`) |
| Light grey | `#bdc3c7` | Secondary text | Label of a spectator (`VIEW-28`), names of the equipment in the side panel (`VIEW-14`) |
| Panel | `#1b2631` | Panels and dialogs | Result, round and turn panel, dialogs, loading screen, help panel (`VIEW-58`) |
| Chrome | `#34495e`, `#46627f` under the pointer | Borders and resting buttons | Border of the panels, buttons of the HUD and of the dialogs (`VIEW-28`), the menu button (`VIEW-60`) |
| Black | `#000000` | What is behind: shadows, veils, outlines and the edge of the marks | Veils of the screen (`VIEW-11`, `VIEW-23`), shadows (`VIEW-4`), outline of the texts over the board, fill of the side panel, near black edge of the frames (`VIEW-40`) |
| Backing | `#111111` | The disc under an icon and the back of a bar | Disc of the crown and of the crossed circle, back of the health bar (`VIEW-39`, `VIEW-4`, `VIEW-50`) |
| Neutral slot | `#ffffff` fill and `#4488cc` border | A slot with no mark | Slots of the rivals (`VIEW-27`) |

## What changed on 2026-11-21

- The slot a dragged card comes from goes from red to orange, so red no longer means "where it comes from".
- The name in the side panel goes from gold to white, and the bright green and red of its values to the green and the red on dark of the table.
- The health bar is green at any share of the health: the length and the number tell how much is left (`VIEW-50`). The yellow and the red of its levels are gone.
- The text of the round and the turn on the turn of the local player goes from green to gold.
- The flash of a card that lost health and the label "Eliminado" take the red of their row.
