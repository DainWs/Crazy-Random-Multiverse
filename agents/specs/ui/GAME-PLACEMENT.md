# Game: placement of the leaders

What a player sees when the board has first faded in after `GAME_START` (`VIEW-29`). The durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-12** When the board has first faded in over the loading screen after `GAME_START` (`VIEW-29`), the leaders play an animation of being placed in their slots, one after the other in the order of `zones`, each with its `put` audio once sounds exist (`VIEW-9`).
  - **Each leader.** It appears transparent at 150% of its size, centered on its slot, and shrinks to exactly its size while it becomes opaque, slowing down at the end (`VIEW-31`).
  - **Timing.** The whole placement takes 2 seconds shared among the leaders, with a minimum of 120 ms and a maximum of 500 ms per leader, so with 10 players it takes 200 ms each. Each leader starts when the previous one ends. These durations are an exception to the scale of `VIEW-30`, kept by the product owner.
  - The animation of the first cards received (`VIEW-8`) waits for it to end. It is only visual: the leaders are already placed (`SETUP-2`), and events are applied to the state as the queue of `CON-12` delivers them.
  - It does not play when entering a game in progress (`LOAD-6`), also for a client that reloaded the page after confirming and receives `GAME_START` during its new load: it only plays on a client that confirmed `/ready` from the page that shows the board.
  - **Effects** (`UI-26`). It is non-essential: the leaders are already in their slots, and without it the board is the same.

## Scenarios

**Two players**
- Given a game of 2 players
- When the board has first faded in after `GAME_START`
- Then each leader shrinks from 150% into its slot in 500 ms, one after the other

**Ten players**
- Given a game of 10 players
- When the board has first faded in after `GAME_START`
- Then each leader takes 200 ms, and the placement ends after 2 seconds
