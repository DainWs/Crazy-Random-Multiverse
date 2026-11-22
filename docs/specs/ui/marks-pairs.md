# Marks: pairs

What is drawn when two marks of the board are on the same slot at the same time (Phase 11.5). The marks are the tint of the own zone (`VIEW-27`), the frame of a card that can attack (`VIEW-17`), the frame of the leader with the turn (`VIEW-20`), the frames of a dragged card (`VIEW-32`), the frames of a card under the pointer while attacking (`VIEW-4`) and the veil of an eliminated zone (`VIEW-11`). Decided with the product owner on 2026-11-21, keeping what the interface already drew.

- **VIEW-53** From bottom to top, a slot is drawn in this order: its tint or neutral fill and its border (`VIEW-27`), the diagonal lines of the own zone (`VIEW-39`), the frame of the leader with the turn (`VIEW-20`), the card, the frame of a card that can attack (`VIEW-17`), the frames of `VIEW-32` and `VIEW-4`, and the crossed circle. The crown of `VIEW-39` is over the card. The veil of an eliminated zone is over everything its slots have, which is only the tint, because an eliminated zone has no cards and no marks. A mark above another covers it where they overlap, and the one below is seen again when the upper one ends. Every mark that is on is drawn; the pairs where one hides the other are these:
  - **Tint of the own zone and any other mark.** The tint is the resting look of the slot: the frames of the other marks are drawn over it, and the slot goes back to it when they end (`VIEW-27`). The tint stays under the veil of an eliminated zone.
  - **Frame of a card that can attack and frame of the leader with the turn.** An own leader with the turn that can attack has both. The cyan frame is over the gold one and has its thickness, so in the base game the gold is seen only in the lows of the pulses and in the accessible mode the gold is seen between the L's, with the crown. The turn is also told by the HUD (`UI-3`) and by the label of the next player (`VIEW-51`).
  - **Frame of a card that can attack and the frames of a drag.** The frame of the slot a dragged card comes from (`VIEW-32`) is drawn over the cyan one and covers it. The cyan frame is seen again when that mark ends.
  - **Frame of a card that can attack and the lift of an attack.** The attacker is lifted and its cyan frame is not drawn (`VIEW-4`, `VIEW-17`). A rival card cannot have a cyan frame.
  - **Frame of the leader with the turn and the frames under the pointer while attacking.** A rival leader with the turn that is under the pointer shows the green or red frame over its gold one, and the gold one is seen again when the pointer leaves it. The crown (`VIEW-39`) stays visible over the card, and the crossed circle is over it.
  - **Frames of a drag and the tint of the own zone.** The green frame and the orange frame of a slot of the own zone are over its tint. Their fills (`VIEW-32`, `VIEW-39`) replace the tint while the slot is marked, and the slot goes back to its tint when the mark ends.
  - **The other marks and the veil of an eliminated zone.** They do not happen together: the zone of an eliminated player has no cards, no turn (`CON-32`), no cards that can attack, and nothing can be dropped on it nor attacked in it. The flash of a hit (`VIEW-5`) and the label "Eliminado" are not marks of a slot.
- **Not a pair.** The marks that cannot be on the same slot at the same time need no rule: a cyan frame with a green or red frame of an attack, because the target is a rival card.

## Scenarios

**Leader that has the turn and can attack**
- Given the leader of the local player on their turn, with no cards in front of it
- When the board is shown
- Then the leader has the gold frame under its card and the cyan frame over it, and with the extra signals on, the gold frame, the crown and the cyan L's

**Dragging an own card that can attack**
- Given an own warrior with the cyan frame
- When the player starts to drag it
- Then the slot it comes from shows the orange frame over the cyan one

**Rival leader with the turn under the pointer**
- Given a rival leader with the gold frame and a selected attacker
- When the pointer is over the leader and it is not exposed
- Then it shows the red frame and the crossed circle over the gold frame, and the gold one comes back when the pointer leaves
