# HUD: buttons and spectator label

The buttons of the HUD and of the confirmation dialog (`UI-3`, `UI-15`), and what a spectator sees next to the button to leave (`UI-8`). The durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-15, from the videos `hud-hover-instantaneo.mp4` and `hud-hover-transicion-150ms.mp4`.

- **VIEW-28** A spectator or eliminated player (`UI-8`) sees, besides the button to leave, a label "Estás observando la partida" in grey just above it, so it is clear they are watching and cannot act. The confirmation dialog has a border of the color of the buttons.
  - **Pointer over a button.** The buttons of the HUD, the same ones of the confirmation dialog, change their background when the pointer is over them. When the pointer enters a button, its background changes to the one of the pointer in 150 ms, slowing down at the end; when it leaves, it goes back in 150 ms, slowing down at the end, as the enlargement of `VIEW-14` (`VIEW-30`, `VIEW-31`). A pointer that leaves before the change ends goes back from the background reached.
  - On the end turn button, the background goes back to the one of its pulse (`VIEW-38`).
- **VIEW-42** The button of the confirmation dialog that has the keyboard focus (`UI-32`) is surrounded by a white frame, 3 board units thick and 4 units away from the button, drawn over the panel of the dialog. It is a different mark from the background under the pointer (`VIEW-28`): the two can be seen at once on different buttons or on the same one. The frame appears and moves at once, with no animation. It is essential (`UI-26`): it shows which button Enter presses. **[Post-MVP]** It has no low quality version (`UI-28`) and no reduced motion version, as it does not move smoothly.
  - **Effects** (`UI-26`). The label, the border and the background under the pointer are essential: they show that the player is watching, where the dialog is and which button a click acts on. The change in 150 ms is non-essential: without it, the background changes at once.

## Scenarios

**Pointer over a button**
- Given the end turn button of the local player
- When the pointer enters it
- Then its background changes to the one of the pointer in 150 ms, and goes back in 150 ms when the pointer leaves

**Spectator**
- Given an eliminated player
- When the HUD is drawn
- Then they see the button to leave and, just above it, "Estás observando la partida" in grey
