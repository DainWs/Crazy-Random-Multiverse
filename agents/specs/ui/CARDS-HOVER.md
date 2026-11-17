# Cards: hover

What the local player sees when the pointer is over a card: the enlargement, the side panel and the equipment sliding out. The attack changes the enlargement while a card is selected (`VIEW-4`, `COMBAT-ATTACK.md`), and the durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-14** While the pointer is over a card:
  - **Enlargement.** The card grows from its center to 103.5% of its size in 150 ms, slowing down at the end, and goes back to its size in 150 ms, slowing down at the end, when the pointer leaves it. It stays below the lifts of `VIEW-4`, 106% and 112%, so it is not mistaken for them.
  - **Side panel.** A panel on the right side of the screen, a quarter of its width and its full height, shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red.
    - It opens at once when the pointer enters a card: it slides 40 px from the right while it goes from transparent to opaque, in 250 ms, slowing down at the end. The 40 px are measured with the window at 1920 by 1080 and scale with the window (`VIEW-24`).
    - When the pointer leaves the card, the panel waits 150 ms and then closes the opposite way, sliding 40 px to the right while it goes transparent, in 250 ms, speeding up.
    - If the pointer enters another card while the panel is open, waiting or closing, the panel does not close: it shows the new card at once, and is opaque and in its place at once.
    - It closes without the wait when the hovered card disappears, for example when its owner is eliminated (`ELIM-3`), and when a drag starts (`VIEW-32`).
    - **[Post-MVP]** A card back (`VIEW-3`) shows no panel, because the card is private (`HAND-3`).
  - **Equipment.** The equipment of a combatant is stacked behind it: at rest, each piece shows a strip of 10% of the width of the card on the left of the card, turned with its zone (`VIEW-1`), the first piece nearest to the card. While the pointer is over the combatant, every piece slides out towards the left of the card in 250 ms, slowing down at the end, until each one shows whole, side by side. When the pointer leaves it, they slide back in 250 ms, slowing down at the end.
  - **Effects** (`UI-26`). The enlargement, the panel and the equipment sliding out are essential: they show which card is under the pointer and what it is. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**Crossing the board**
- Given the pointer over a card, with the side panel open
- When it crosses the gap to the next card in less than 150 ms
- Then the panel does not close: it shows the next card at once

**Leaving the cards**
- Given the pointer over a card, with the side panel open
- When it leaves the card for an empty place of the board
- Then the panel waits 150 ms and closes sliding to the right while it fades out, in 250 ms

**A combatant with equipment**
- Given a warrior with two pieces of equipment
- When the pointer enters it
- Then it grows to 103.5%, the panel opens, and both pieces slide out to its left until they show whole, side by side
