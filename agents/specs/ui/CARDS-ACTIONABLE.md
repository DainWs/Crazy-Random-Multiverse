# Cards: actionable under the pointer

How an own card of the board that can attack now reacts to the pointer, so that the player tells it apart from the cards that cannot act. Its mark at rest is the cyan frame of `GAME-PULSES.md` (`VIEW-17`), and the durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-37** While the board being shown is the local player's turn (`CON-12`), and the pointer is over an own card that can attack now (`attackAvailable`, `CON-15`) and has its cyan frame (`VIEW-17`):
  - The cyan frame stops pulsing and is drawn at its full opacity, at once. When the pointer leaves the card, the pulse goes on at once from the clock of the scene, as `VIEW-17` says.
  - The pointer shows the hand that points, which says that the card can be clicked (`VIEW-4`).
  - The card gets the enlargement and the side panel of `VIEW-14` as any other card.
  - A card that can only be moved (`BOARD-7`) has no reaction of its own, because on the turn of its owner almost every warrior can be moved, to a free slot or in a swap, so the reaction would tell nothing apart: it only gets `VIEW-14`.
  - **Effects** (`UI-26`). It is essential: it shows that a click on the card selects it to attack. **[OPEN] [Post-MVP]** Its versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**A card that can attack**
- Given the local player's turn and an own warrior with `attackAvailable`
- When the pointer enters it
- Then its cyan frame stops pulsing and is fully opaque, and the pointer shows the hand that points

**A card that cannot attack**
- Given the local player's turn and an own warrior without `attackAvailable`
- When the pointer enters it
- Then it only gets the enlargement and the side panel of `VIEW-14`
