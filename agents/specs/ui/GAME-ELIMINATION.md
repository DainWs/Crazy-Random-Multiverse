# Game: elimination

What every player sees in the zone of a player who is eliminated (`ELIM-1`, `ELIM-2`, `PLAYER_DIE`). The durations and curves are in `MOTION-BASE.md`, and the notices in `GAME-NOTICES.md` (`VIEW-15`). Decided with the product owner and the client on 2026-11-14, from the recordings of the prototypes, the chosen one being `eliminacion-slow-fades.mp4`.

- **VIEW-11** The zone of an eliminated player is shown empty, with every slot tinted a dark red and bordered in a darker one, and the label "Eliminado" over it in red with a black outline and no panel. The cards that leave the board with the elimination (`ELIM-3`) have no animation: they disappear when the board is drawn again. Only a leader killed by an attack plays its death (`VIEW-7`).
  - **Veil.** When the event `PLAYER_DIE` is applied, after the death of the leader if there was one, the dark red of the slots and the label fade in over the empty slots in 800 ms, slowing down at the end.
  - **Notice.** 400 ms after the veil ends, 1200 ms after it starts, a notice is shown on the panel and at the place of the notices of `VIEW-15`: "<name> eliminado" with the name of the eliminated player, or "Has sido eliminado" when it is the local player. It fades in for 1000 ms, slowing down at the end; stays 1000 ms; and fades out for 1000 ms, speeding up.
  - **Timing.** The elimination lasts 4200 ms and is one more animation of the queue of `CON-12`: gameplay stays disabled until it ends (`UI-4`), and a turn or round notice that follows waits for it. It plays once, when its event is applied: a board drawn again afterwards shows the zone with its veil and label, without playing it again. The durations of 800 ms and 1000 ms are an exception to the scale of `VIEW-30`, kept by the product owner and the client.
  - **End of the game.** When the elimination ends the game (`WIN-1`), only the veil plays, without the notice, and then the result is shown (`VIEW-23`, `WIN-4`): the result already says who won.
  - Entering a game in progress (`LOAD-6`) or restoring it from `GAME_SYNC` shows the zone of an eliminated player with its veil and label at once, without animation and without notice.
  - **Effects** (`UI-26`). The veil and the notice are essential: they show which player was eliminated. **[OPEN] [Post-MVP]** Their versions for low quality (`UI-28`) and reduced motion (`UI-29`).

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
