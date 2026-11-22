# Hand: motion

How the hand of the local player is laid out, rises, folds and moves its cards. The arrival of a dealt card is in `docs/specs/ui/effects/hand-arrival.md` (`VIEW-8`), and the durations and curves in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14, keeping what the interface already did.

- **VIEW-16** The hand has no limit (`HAND-1`), so the more cards it holds, the more they overlap, until each one only shows a minimum strip; from then on the hand grows wider. Its cards are drawn at 75% of the size of a card (150 by 225 px on the screen, at any window size), so the expanded hand takes about a fifth of the screen height at 1920 by 1080. The expanded hand covers part of the own zone, which is accepted by the product owner (2026-11-21): measured at 1920 by 1080, it covers the lower part of the leader with 2 players and almost all of it with 10, and at 1280 by 720 with 10 players it covers the leader and the front row. It is only open while the pointer is over it, and while a card is dragged it is fully hidden (`VIEW-32`), so every slot where the card can go is seen. The cards of the hand are shown whole in the side panel when the pointer is over them (`VIEW-14`).
  - **Rest and rise.** At rest, 75% of the height of the hand is hidden below the bottom edge of the screen. When the pointer enters a card of the hand, the hand rises until it is whole on the screen, in 250 ms, slowing down at the end. When the pointer leaves the hand, also when it leaves the window, the hand folds back to its rest in 250 ms, slowing down at the end. Each rise or fold starts from where the hand is, so a fold requested while the hand is still rising is not dropped.
  - **The card under the pointer.** It shows whole, because the cards after it slide aside, in 250 ms, slowing down at the end. When the pointer leaves it, they slide back in the same way.
  - **Effects** (`UI-26`). The rise, the fold and the sliding aside are essential: they show the cards the player can play.
- **VIEW-25** The hand is centered horizontally on the screen according to the cards it holds, not according to the space it could take. Its width follows the number of cards, so when one arrives or leaves, the cards move to their new slots in 250 ms, slowing down at the end. It is essential (`UI-26`): it shows that the hand changed.
- **[Post-MVP]** `VIEW-16` and `VIEW-25` have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**Rising and folding**
- Given the hand at rest
- When the pointer enters a card of the hand and leaves it before the hand is whole
- Then the hand folds back to its rest from where it was, in 250 ms

**A card leaves the hand**
- Given a hand of four cards
- When the event of a placed card is applied
- Then the other three move to their new slots, centered, in 250 ms
