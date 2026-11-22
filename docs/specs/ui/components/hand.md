# Hand

How the hand of the local player is laid out and where it is. Decided with the product owner on 2026-11-14, keeping what the interface already did.

- **VIEW-16** The hand has no limit (`HAND-1`), so the more cards it holds, the more they overlap, until each one only shows a minimum strip; from then on the hand grows wider. Its cards are drawn at 75% of the size of a card (150 by 225 px on the screen, at any window size), so the expanded hand takes about a fifth of the screen height at 1920 by 1080. The expanded hand covers part of the own zone, which is accepted by the product owner (2026-11-21): measured at 1920 by 1080, it covers the lower part of the leader with 2 players and almost all of it with 10, and at 1280 by 720 with 10 players it covers the leader and the front row. It is only open while the pointer is over it, and while a card is dragged it is fully hidden (`VIEW-32`), so every slot where the card can go is seen. The cards of the hand are shown whole in the side panel when the pointer is over them (`VIEW-14`).
  - **Rest.** At rest, 75% of the height of the hand is hidden below the bottom edge of the screen.
- **VIEW-25** The hand is centered horizontally on the screen according to the cards it holds, not according to the space it could take. Its width follows the number of cards.

## Effects

- `docs/specs/ui/effects/hand-motion.md` — the hand rises, folds and slides its cards aside (`VIEW-66`), and its cards move to their new slots when one arrives or leaves (`VIEW-67`).
- `docs/specs/ui/effects/hand-arrival.md` — a card dealt to the hand (`VIEW-8`).
- `docs/specs/ui/effects/cards-drag.md` — a card dragged from the hand, which hides it while the drag lasts (`VIEW-32`, `VIEW-34`).
