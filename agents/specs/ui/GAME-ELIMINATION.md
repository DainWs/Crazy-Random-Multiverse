# Game: elimination

What every player sees in the zone of a player who is eliminated (`ELIM-1`, `ELIM-2`, `PLAYER_DIE`). The durations and curves are in `MOTION-BASE.md`, and the notices in `GAME-NOTICES.md` (`VIEW-15`). Decided with the product owner and the client on 2026-11-14, from the recordings of the prototypes, the chosen one being `eliminacion-fade-out-notice.mp4`.

- **VIEW-11** The zone of an eliminated player disappears from the table: its slots are not drawn, and nothing marks where it was. The cards that leave the board with the elimination (`ELIM-3`) have no animation: they disappear when the board is drawn again. Only a leader killed by an attack plays its death (`VIEW-7`).
  - **Fade.** When the event `PLAYER_DIE` is applied, after the death of the leader if there was one, the empty slots of the zone fade out in 800 ms, speeding up.
  - **Notice.** 400 ms after the zone is gone, 1200 ms after the fade starts, a notice like those of `VIEW-15`, on their panel, at their place and with their durations, says "<name> eliminado" with the name of the eliminated player, or "Has sido eliminado" when it is the local player. It fades in for 250 ms, stays 1000 ms and fades out for 250 ms.
  - **Timing.** The elimination lasts 2700 ms and is one more animation of the queue of `CON-12`: gameplay stays disabled until it ends (`UI-4`), and a turn or round notice that follows waits for it. It plays once, when its event is applied: a board drawn again afterwards has no zone for that player, without playing it again. The fade of 800 ms is an exception to the scale of `VIEW-30`, kept by the product owner and the client.
  - **End of the game.** When the elimination ends the game (`WIN-1`), only the fade plays, without the notice, and then the result is shown (`VIEW-23`, `WIN-4`): the result already says who won.
  - Entering a game in progress (`LOAD-6`) or restoring it from `GAME_SYNC` shows no zone for an eliminated player, without animation and without notice.
  - **Effects** (`UI-26`). The fade and the notice are essential: they show which player was eliminated. **[OPEN] [Post-MVP]** Their versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**A rival eliminated by an attack**
- Given a game of 3 players
- When an attack kills the leader of a rival
- Then the leader plays its death, the zone of the rival fades out in 800 ms, and 400 ms later the notice "<name> eliminado" fades in for 250 ms, stays 1000 ms and fades out for 250 ms

**The local player is eliminated**
- Given a game of 3 players
- When the local player is eliminated
- Then their zone fades out, and the notice says "Has sido eliminado"

**The last elimination**
- Given a game of 2 players
- When the leader of the rival dies
- Then the zone of the rival fades out in 800 ms, no notice is shown, and then the result appears

**Entering a game in progress**
- Given a game of 3 players where a rival was already eliminated
- When the board is first shown after `GAME_SYNC`
- Then the table has no zone for that rival, and no notice is shown
