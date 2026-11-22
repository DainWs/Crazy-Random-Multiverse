# Cards: drag

How the local player drags a card from the hand or from the board, and what is seen while the server answers. The behavior is in `docs/specs/interface.md` (`UI-5`, `UI-6`, `UI-25`), the hand in `VIEW-16` and `VIEW-66`, and the durations and curves in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14, keeping what the interface already did except for its durations, moved to the scale of `VIEW-30`.

- **VIEW-32** While a card is being dragged:
  - **Grab.** The side panel of `VIEW-14` closes. If the card comes from the hand, the hand lowers until it is fully hidden below the bottom edge of the screen, in 150 ms, slowing down at the end, and follows `VIEW-66` again when the drag ends.
  - **The dragged card.** It follows the pointer, centered on it, at 70% of the size of a card of the board, 140 by 210 board units, so it grows and shrinks with the zoom (`VIEW-19`). It is flat (`VIEW-1`), without a tilt nor a shadow, opaque, and drawn above everything.
  - **Marks.** The slot under it is marked in green if the card can go there (`UI-5`), and the slot it comes from, if it comes from the board, in orange (`VIEW-52`). In the base game that red mark goes out when the card leaves its slot; only in the accessible mode (`UI-31`) it stays while the card is dragged. A mark is a solid frame drawn over the card and over the border of its slot, as thick as that border, so it stays visible.
  - **Preview in a slot.** Over a slot where a warrior can go, the card stops following the pointer and takes the place, the size and the rotation of the slot in 150 ms, slowing down at the end, without the deformation of its perspective. When the pointer leaves that slot, the card follows the pointer again at once, at 70%. A piece of equipment has no preview: the slot only gets its green mark.
  - **Escape.** It cancels the drag as a drop where nothing is allowed (`UI-25`): nothing is sent to the server, the card goes back to where it was with no message, and the marks of the drag go out. It also opens the game menu (`UI-36`). The release of the button that follows does nothing. Decided by the product owner on 2026-11-22.
  - **Effects** (`UI-26`). The dragged card, its preview, the marks and the hiding of the hand are essential: they show where the card goes and leave the own zone in view. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.
- **VIEW-34** When the card is dropped:
  - **While the server answers** (`UI-6`). A warrior dropped on a valid slot is drawn in it at once, with its perspective (`VIEW-1`), like any card of the board, until its event is applied (`HAND-2`). In a swap (`BOARD-7`), the other warrior is drawn at once in the slot the card left. A piece of equipment disappears from the screen until the server answers.
  - **Return.** When the server rejects the action (`UI-6`), or the interface refuses the drop (`UI-25`), the cards are back at once where they were, in the hand or in their slots, and the message is shown.
  - **Effects** (`UI-26`). Both are essential: they show the action the player made and whether it was undone. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**Dragging from the hand**
- Given the hand risen under the pointer
- When the player grabs a warrior
- Then the side panel closes, the hand hides below the bottom edge in 150 ms, and the warrior follows the pointer at 70% of the size of a card of the board

**Over a valid slot**
- Given a warrior being dragged
- When the pointer enters a slot where it can go
- Then the slot is marked in green, and the warrior takes the place, the size and the rotation of the slot in 150 ms

**Rejected placement**
- Given a warrior dropped on a valid slot and waiting for the server
- When the server rejects the action
- Then the warrior is back in the hand at once, and the message of `UI-6` is shown
