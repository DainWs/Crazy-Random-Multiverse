# Cards: settle in a slot

What every player sees when a card enters a slot of the board from an event (`PLAYER_PUT_CARD`, `PLAYER_MOVE_CARD`). The durations and curves are in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14.

- **VIEW-35** Every card that enters a slot of the board from an event, own or rival, placed or moved, appears at once at 106% of its size, growing from its center, and settles at exactly its size in 250 ms, slowing down at the end, without going under it (`VIEW-30`, `VIEW-31`). In a swap (`BOARD-7`), both warriors play it at the same time. An own card already drawn in the slot while the server answered (`VIEW-34`) plays it too when its event is applied. A card restored from `GAME_SYNC` does not play it (`VIEW-8`). Gameplay stays disabled until it ends (`UI-4`).
  - A piece of equipment attached to a combatant (`EQUIP-3`) plays `VIEW-36` instead, in `docs/specs/ui/effects/cards-equip.md`, which includes this settle of the combatant.
  - **Effects** (`UI-26`). It is essential: it shows which card a player placed or moved, also to the players who did not do it. **[Post-MVP]** It has no low quality version (`UI-28`), and its reduced motion version is the general one of `UI-29`.

## Scenarios

**A rival places a card**
- Given a game of 4 players
- When a rival places a warrior
- Then it appears in its slot at 106% and settles at its size in 250 ms

**A swap**
- Given two own warriors on the board
- When the event of their swap is applied
- Then both appear in their new slots at 106% and settle at the same time
