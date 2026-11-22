# Game: elimination

What every player sees in the zone of a player who is eliminated (`ELIM-1`, `ELIM-2`, `PLAYER_DIE`). The durations and curves are in `docs/specs/ui/motion-base.md`, and the notices follow `VIEW-15`. Decided with the product owner and the client on 2026-11-14, from the recordings of the prototypes, the chosen one being `eliminacion-slow-fades.mp4`.

- **VIEW-11** The zone of an eliminated player is shown empty, with every slot tinted a dark red and bordered in a darker one, and the label "Eliminado" over it in red with a black outline and no panel. The cards that leave the board with the elimination (`ELIM-3`) have no animation: they disappear when the board is drawn again. Only a leader killed by an attack plays its death (`VIEW-7`).
  - **Look.** Every slot of the zone is covered by a veil of `#3b0a0a` at 80% opacity, drawn over the tint of the slot (`VIEW-27`), with an opaque border of `#1a0000` 3 board units wide. The label is `#ff6b6b` with a black outline as thick as 14% of the height of the text. It is 24 px tall on the screen with the window at 1920 by 1080 and the zoom of the camera at 1, and it scales with the window as the camera (`VIEW-24`) and with the zoom of the player (`VIEW-19`). It is drawn flat and horizontal on the screen, without the perspective of the slots (`VIEW-1`), centered on the zone as drawn on the screen, on every side of the table. These are the colors of the code on 2026-11-14; the table of colors of Phase 11.5 reviews them.
  - **Veil.** When the event `PLAYER_DIE` is applied, after the death of the leader if there was one, the dark red of the slots and the label fade in over the empty slots in 800 ms, slowing down at the end.
  - **Notice.** 400 ms after the veil ends, 1200 ms after it starts, a notice is shown on the panel and at the place of the notices of `VIEW-15`: "<name> eliminado" with the name of the eliminated player, or "Has sido eliminado" when it is the local player. It fades in for 1000 ms, slowing down at the end; stays 1000 ms; and fades out for 1000 ms, speeding up. The panel grows with the text, so the name is always shown whole: a name has at most 20 characters (`USER-4`).
  - **Timing.** The elimination lasts 4200 ms and is one more animation of the queue of `CON-12`: gameplay stays disabled until it ends (`UI-4`), and a turn or round notice that follows waits for it. It plays once, when its event is applied: a board drawn again afterwards shows the zone with its veil and label, without playing it again. The durations of 800 ms and 1000 ms are an exception to the scale of `VIEW-30`, kept by the product owner and the client.
  - **End of the game.** When the elimination ends the game (`WIN-1`), only the veil plays, without the notice, and then the result is shown (`VIEW-23`, `WIN-4`): the result already says who won.
  - Entering a game in progress (`LOAD-6`) or restoring it from `GAME_SYNC` shows the zone of an eliminated player with its veil and label at once, without animation and without notice.
  - **Effects** (`UI-26`). The veil and the notice are essential: they show which player was eliminated. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**A rival eliminated by an attack**
- Given a game of 3 players
- When an attack kills the leader of a rival
- Then the leader plays its death, the zone of the rival fades to dark red with "Eliminado" in 800 ms, and 400 ms later the notice "<name> eliminado" fades in for 1000 ms, stays 1000 ms and fades out for 1000 ms

**The local player is eliminated**
- Given a game of 3 players
- When the local player is eliminated
- Then their zone fades to dark red, and the notice says "Has sido eliminado"

**The last elimination**
- Given a game of 2 players
- When the leader of the rival dies
- Then the zone of the rival fades to dark red in 800 ms, no notice is shown, and then the result appears

**Entering a game in progress**
- Given a game of 3 players where a rival was already eliminated
- When the board is first shown after `GAME_SYNC`
- Then the zone of that rival is dark red with "Eliminado" at once, and no notice is shown
