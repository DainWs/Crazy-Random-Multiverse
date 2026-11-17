# Game: turn and round notices

What every player sees when the turn or the round changes. The durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-15** A brief notice announces each turn change, with "Tu turno" or the name of the player whose turn starts, and each new round, with "Ronda N".
  - **Look.** A notice is a text on a dark panel, centered horizontally and vertically on the screen, over the center of the table, so it does not hide the zone of the rival at the top. Decided with the product owner on 2026-11-17, after the recordings of 2026-11-14 showed that a fifth of the screen height below its top edge covered part of that zone.
  - **Timing.** It fades in, in its place and without moving, in 250 ms, slowing down at the end; it stays for 1000 ms; and it fades out in 250 ms, speeding up (`VIEW-30`, `VIEW-31`). A notice lasts 1.5 s.
  - When the round and the turn change together, the round is announced first and then the turn.
  - It is one more animation of the queue of `CON-12`, so the first turn and round of a game are announced too, and entering a game in progress (`LOAD-6`) announces nothing.
  - **Effects** (`UI-26`). It is essential: it shows whose turn starts and which round. **[OPEN] [Post-MVP]** Its versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**Turn of the local player**
- Given the turn of a rival
- When the turn passes to the local player
- Then "Tu turno" fades in for 250 ms, stays for 1000 ms and fades out for 250 ms

**New round**
- Given the last turn of a round
- When the round and the turn change together
- Then "Ronda N" is announced, and then the turn
