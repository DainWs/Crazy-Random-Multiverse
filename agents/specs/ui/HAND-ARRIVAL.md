# Hand: arrival

What the local player sees when a card is dealt to their hand (`PLAYER_RECEIVE_CARD`, `ROUND-3`). The hand is in `HAND-MOTION.md` (`VIEW-16`, `VIEW-25`), and the durations and curves in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-8** A card dealt to the local player enters the hand:
  - **Path.** It enters from outside the left edge of the screen, flat and at the size of the cards of the hand, and slides to its slot in the hand in 250 ms, slowing down at the end (`VIEW-31`). It travels at the height of its slot and is drawn above every other card of the hand. Its slot is the one it has in the hand as the hand is at that moment, risen or folded.
  - **The rest of the hand.** While it slides, the cards already in the hand move to their new slots as `VIEW-25` says.
  - **The hand.** It does not rise nor fold for the arrival: it stays as the pointer leaves it (`VIEW-16`).
  - **Several cards.** When several cards are dealt to the local player one after the other, each one starts 150 ms after the previous one, so two cards take 400 ms.
  - Cards restored from `GAME_SYNC` are not animated. The cards dealt to a rival have no animation, because rival hands are not shown (`UI-7`). **[Post-MVP]** The back of the card a rival receives is animated too (`VIEW-3`). The arrival of the first cards waits for the placement of the leaders (`VIEW-12`).
  - **Effects** (`UI-26`). The arrival is essential: it shows that the hand has a new card. **[Post-MVP]** It has no low quality version (`UI-28`), and its reduced motion version is the general one of `UI-29`.

## Scenarios

**One card**
- Given a hand of three cards, folded
- When a card is dealt to the local player
- Then it slides in from the left edge to its slot in the folded hand in 250 ms, while the other three move to their new slots

**Two cards**
- Given the start of round 1
- When two cards are dealt to the local player
- Then the second one starts 150 ms after the first, and both are in the hand 400 ms after the first started

**A rival receives a card**
- Given a game of 4 players
- When a card is dealt to a rival
- Then nothing is animated
