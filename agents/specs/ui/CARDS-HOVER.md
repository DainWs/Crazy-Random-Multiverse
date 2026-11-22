# Cards: hover

What the local player sees when the pointer is over a card: the enlargement, the side panel and the equipment sliding out, and whether an own card can attack (`VIEW-59`). The attack changes the enlargement while a card is selected (`VIEW-4`, `COMBAT-ATTACK.md`), and the durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-14** While the pointer is over a card:
  - **Enlargement.** The card grows from its center to 103.5% of its size in 150 ms, slowing down at the end, and goes back to its size in 150 ms, slowing down at the end, when the pointer leaves it. It stays below the lifts of `VIEW-4`, 106% and 112%, so it is not mistaken for them.
  - **Side panel.** A panel on one side of the screen, a quarter of its width and its full height, shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red. The card and the texts of the panel scale with the window like the camera does (`VIEW-24`), without growing over their size at 1920 by 1080, so they fit its height at the smallest window.
    - **Side.** It is on the right side, unless the card is in the right half of the screen, measured on the center of the card: then it is on the left side, so it never covers the card it shows. A card in the exact middle takes the right side. It is decided when the panel opens or shows another card, and the panel does not change side while it shows the same card.
    - **Over the HUD.** The panel is over the pieces of the HUD that are drawn on the canvas, which are the panel of the round and the turn, the end turn and surrender buttons and the label of a spectator, so it covers them while it is open. The result, the button to leave and the confirmation dialog (`VIEW-23`, `VIEW-28`) are over the panel, and the settings and help buttons, which are part of the page and not of the canvas, stay over it too (`UI-33`, `UI-34`). Decided with the product owner on 2026-11-21.
    - It opens at once when the pointer enters a card: it slides 40 px from its own side while it goes from transparent to opaque, in 250 ms, slowing down at the end. The 40 px are measured with the window at 1920 by 1080 and scale with the window (`VIEW-24`).
    - When the pointer leaves the card, the panel waits 150 ms and then closes the opposite way, sliding 40 px towards its own side while it goes transparent, in 250 ms, speeding up.
    - If the pointer enters another card while the panel is open, waiting or closing, the panel does not close: it shows the new card at once, and is opaque and in its place at once.
    - It closes without the wait when the hovered card disappears, for example when its owner is eliminated (`ELIM-3`), and when a drag starts (`VIEW-32`).
    - **[Post-MVP]** A card back (`VIEW-3`) shows no panel, because the card is private (`HAND-3`).
  - **Equipment.** The equipment of a combatant is stacked behind it: at rest, each piece shows a strip of 10% of the width of the card on the left of the card, turned with its zone (`VIEW-1`), the first piece nearest to the card. While the pointer is over the combatant, every piece slides out towards the left of the card in 250 ms, slowing down at the end, until each one shows whole, side by side. When the pointer leaves it, they slide back in 250 ms, slowing down at the end.
  - **Effects** (`UI-26`). The enlargement, the panel and the equipment sliding out are essential: they show which card is under the pointer and what it is. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.
- **VIEW-59** While the board being shown is the turn of the local player (`CON-12`), the side panel of an own card of the board that can attack now (`attackAvailable`, `CON-15`) has the line "Puede atacar este turno" between its name and its description, in the cyan `#00e5ff` of `VIEW-17`, at the label level of `VIEW-55`. It is the condition of the cyan frame, so the line and the frame are seen together. No other card has the line: an own card that cannot attack, a rival card and a card of the hand show nothing in its place, and neither does any card outside that turn. The contract does not say why a card cannot attack, so the panel gives no reason, as the click on it says nothing (`VIEW-4`, `UI-25`). The line is decided when the panel shows the card. Decided by the product owner on 2026-11-22, who chose to say only when the card can attack.

## Scenarios

**Crossing the board**
- Given the pointer over a card, with the side panel open
- When it crosses the gap to the next card in less than 150 ms
- Then the panel does not close: it shows the next card at once

**A card in the right half**
- Given a rival card in the zone of the right side, with the board zoomed so that the card is in the right half of the screen
- When the pointer enters it
- Then the panel opens on the left side, sliding from the left

**The panel over the HUD**
- Given the panel open
- When the end turn button is under it
- Then the panel covers the button

**Leaving the cards**
- Given the pointer over a card, with the side panel open
- When it leaves the card for an empty place of the board
- Then the panel waits 150 ms and closes sliding to the right while it fades out, in 250 ms

**A card that can attack**
- Given the local player's turn and an own warrior with `attackAvailable`
- When the pointer enters it
- Then the side panel says "Puede atacar este turno" in cyan below the name, and the side panel of a rival card does not

**A combatant with equipment**
- Given a warrior with two pieces of equipment
- When the pointer enters it
- Then it grows to 103.5%, the panel opens, and both pieces slide out to its left until they show whole, side by side
