# Game: result

What every player sees when the game ends (`WIN-1`, `WIN-4`, `GAME_END`). The durations and curves are in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-15.

- **VIEW-23** The result covers the board with a veil, and its texts, victory or defeat, the winner and the countdown, sit on a panel, so the slots of the board do not show through them.
  - **Look.** The veil is black at 70% opacity and covers the whole screen. The panel is `#1b2631` at 95% opacity, 760 by 240 px on the screen, centered on the screen. Its texts are three centered lines: "Victoria" in `#2ecc71` or "Derrota" in `#e74c3c`; "Ganador: <name>" and "Volviendo a la party en N", in white. The colors are those of `docs/specs/ui/palette.md` (`VIEW-52`), and the sizes of `docs/specs/ui/typography.md` (`VIEW-55`): the title is 40 px bold and the two lines, 24 px. Decided on 2026-11-21.
  - **Veil.** When the result is shown, after the animations of the last events (`WIN-4`), the veil fades in over the board in 800 ms, slowing down at the end. When the last event is an elimination, this is after its veil (`VIEW-11`).
  - **Panel.** When the veil has faded in, the panel and its texts fade in together in 400 ms, slowing down at the end.
  - **Countdown.** It starts when the panel has faded in, 1200 ms after the veil starts: until then it shows the first value, 15, without counting. So it is behind the server by those 1200 ms plus the animations of `WIN-4`.
  - **Timing.** The result takes 1200 ms to appear. Gameplay is already disabled (`UI-4`), and the veil takes the clicks on the board from the start of its fade. The whole HUD (`VIEW-62`) is not drawn from the start of the veil, at once, the marks of the board included, so the slots show their neutral look and an eliminated zone loses its veil (`VIEW-11`). What stays under the veil is the board with its cards, and the hand (`VIEW-16`). Escape does nothing: the player waits for the countdown. A game menu, a settings screen or a help panel that is open closes at that moment, and so does the confirmation dialog (`UI-15`), without answering it. The result plays once: a text that arrives later, such as the winner, changes at once, without fading in again. The fade of 800 ms is an exception to the scale of `VIEW-30`, kept by the product owner.
  - The `party:info` that unlocks the party (`WIN-5`) takes the client to the party at once, also in the middle of the fades.
  - **Effects** (`UI-26`). The veil, the panel and their texts are essential: they show that the game ended and who won. The fades are non-essential: without them, the result appears at once and the countdown starts with it.

## Scenarios

**Victory**
- Given a game of 2 players
- When the local player kills the leader of the rival
- Then the zone of the rival plays its veil (`VIEW-11`), the veil of the result fades in over the board in 800 ms, and then the panel with "Victoria", the winner and "Volviendo a la party en 15" fades in in 400 ms

**The countdown waits for the panel**
- Given the result appearing
- When 1000 ms have passed since its veil started
- Then the countdown still shows 15, and it shows 14 one second after the panel has faded in

**No buttons during the result**
- Given a spectator whose game ends, with the game menu open or the confirmation dialog to leave open
- When the veil of the result starts
- Then the menu or the dialog closes without leaving, the whole HUD disappears at once (`VIEW-62`), and Escape does nothing

**The party unlocks before the fades end**
- Given the result appearing
- When the `party:info` that unlocks the party arrives
- Then the client goes to the party at once

## Effects

None in `docs/specs/ui/effects/`. The veil, the fade and the count of the result are still part of `VIEW-23`, until they are split.
