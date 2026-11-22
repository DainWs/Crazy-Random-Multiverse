# Hand: motion

How the hand of the local player (`VIEW-16`, `VIEW-25`) rises, folds and moves its cards. The arrival of a dealt card is in `docs/specs/ui/effects/hand-arrival.md` (`VIEW-8`), and the durations and curves in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14, keeping what the interface already did. Split from `VIEW-16` and `VIEW-25` on 2026-11-22 without changing what is seen.

- **VIEW-66** The hand follows the pointer.
  - **Rise and fold.** When the pointer enters a card of the hand, the hand rises from its rest (`VIEW-16`) until it is whole on the screen, in 250 ms, slowing down at the end. When the pointer leaves the hand, also when it leaves the window, the hand folds back to its rest in 250 ms, slowing down at the end. Each rise or fold starts from where the hand is, so a fold requested while the hand is still rising is not dropped.
  - **The card under the pointer.** It shows whole, because the cards after it slide aside, in 250 ms, slowing down at the end. When the pointer leaves it, they slide back in the same way.
  - **Effects** (`UI-26`). The rise, the fold and the sliding aside are essential: they show the cards the player can play.
- **VIEW-67** When a card arrives in the hand or leaves it, the cards move to their new slots (`VIEW-25`) in 250 ms, slowing down at the end. It is essential (`UI-26`): it shows that the hand changed.
- **[Post-MVP]** `VIEW-66` and `VIEW-67` have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**Rising and folding**
- Given the hand at rest
- When the pointer enters a card of the hand and leaves it before the hand is whole
- Then the hand folds back to its rest from where it was, in 250 ms

**A card leaves the hand**
- Given a hand of four cards
- When the event of a placed card is applied
- Then the other three move to their new slots, centered, in 250 ms
