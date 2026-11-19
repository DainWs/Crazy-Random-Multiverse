# Marks: second signal

A second signal for the marks of the board that are told apart only by color (Phase 11.1), so a player who does not tell red from green, or any color, still tells them apart. It is off by default and is turned on with `UI-31`. Chosen by the product owner on 2026-11-18 among the sketches of that day, seen also with the simulation of deuteranopia and achromatopsia.

- **VIEW-39** While the extra signals are on (`UI-31`), each mark below is drawn with its own signal besides its color, the same one wherever the mark appears. With them off, every mark is drawn as `VIEW-27`, `VIEW-17`, `VIEW-20`, `VIEW-32` and `VIEW-11` say.
  - **Own zone** (`VIEW-27`). Diagonal lines over the tint of every slot of the zone, parallel to the diagonal that goes from the top right corner to the bottom left corner of the slot, nine per slot, 4 board units thick, of the color `#3d9bff` (`VIEW-40`). They are drawn under the cards, so they are seen in the empty slots.
  - **Card that can attack** (`VIEW-17`). The cyan frame is not drawn whole: an L at each corner, each arm 30% of the edge it follows, 8 board units thick, drawn over the card. The L's pulse as the frame does.
  - **Leader with the turn** (`VIEW-20`). A gold crown of three peaks on a dark disc with a gold ring, besides the gold frame. The disc is 44 board units in diameter, which is 44 px on the screen at 1920 by 1080 and zoom 1, and is centered on the middle of the top edge of the leader's slot. It is drawn over the leader's card, flat and horizontal on the screen, without the perspective of the slot (`VIEW-1`). Size chosen by the product owner on 2026-11-19 among 32, 44, 56 and 72 px.
  - **Slot where the dragged card can go** (`VIEW-32`). The fill of the slot is the green of the mark at 100% opacity, instead of the translucent fill it has now, besides the green frame. A dragged warrior covers the slot (`VIEW-1`), so it is seen mostly in a slot that has no preview, such as the one of a piece of equipment.
  - **Slot the dragged card comes from** (`VIEW-32`). The red frame is dashed: 5 dashes on each horizontal edge and 7 on each vertical edge, each dash 60% of its stretch and centered in it, 8 board units thick.
  - **Eliminated zone** (`VIEW-11`). No new signal: its second signal is the label "Eliminado", which is text.
  - **Pairs.** No signal is used for two meanings: the diagonal lines are only of the own zone, the L's only of the attack, the crown only of the turn, the solid fill only of the valid slot and the dashes only of the origin of a drag. The marks of the attack of `VIEW-4` already carry an icon the green one does not, and keep it.
  - **Effects** (`UI-26`). The signals are essential, as the marks they accompany. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**Extra signals on**
- Given the page opened with `extraMarks=1` (`UI-31`)
- When an own warrior can attack and the leader has the turn
- Then the warrior shows cyan L's at its corners, the leader shows its gold frame and a crown, and the empty slots of the own zone show the diagonal lines

**Extra signals off**
- Given the page opened without the parameter
- When the same board is shown
- Then every mark looks as `VIEW-17`, `VIEW-20` and `VIEW-27` say, with no L's, no crown and no diagonal lines
