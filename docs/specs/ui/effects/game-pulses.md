# Game: pulses

The marks that pulse while they last: the frame of an own card that can attack, the frame of the leader with the turn and the end turn button. A pulse goes back and forth by nature (`VIEW-31`) and follows the clock of the scene, so it does not restart when the board is drawn again, and two marks with the same period stay in phase. Decided with the product owner on 2026-11-14, keeping the frames of `VIEW-17` and `VIEW-20` as the interface already drew them.

- **VIEW-17** Protected cards and an exposed leader have no mark of their own: what tells them apart is the red frame and the crossed circle icon they show under the pointer while attacking (`VIEW-4`, `UI-5`, `PROT-6`). The own cards that can attack now (`attackAvailable`, `CON-15`) do have a mark, while the board being shown is the turn of the local player (`CON-12`): a cyan frame, drawn over the card like those of `VIEW-32`.
  - **Pulse.** Its opacity goes from 100% down to 50% and back, as a smooth wave, once every 2400 ms.
  - While a card is selected to attack and lifted (`VIEW-4`), its cyan frame is not drawn. Under the pointer it stops pulsing (`VIEW-37`, `docs/specs/ui/effects/cards-actionable.md`).
- **VIEW-20** The leader of the player with the turn has a gold frame, as thick as the border of a slot and drawn over it, besides the text of the HUD (`UI-3`). It is not a glow filter: see `docs/guides/phaser4-troubleshooting.md`. It follows the turn of the board being shown, not the latest one received (`CON-12`). If that leader is already dead (`CON-32`), nothing glows.
  - **Pulse.** Its opacity goes from 100% down to 45% and back, as a smooth wave, once every 2400 ms.
- **VIEW-38** While the board being shown is the local player's turn (`CON-12`) and they have nothing left to do, the end turn button pulses. Nothing is left to do when no own card has `attackAvailable` (`CON-15`) and no card of the hand has a valid slot or target under `BOARD-5` and `EQUIP-3` (`UI-5`). Moving a card already on the board does not count.
  - **Pulse.** Its background goes from its color to that color mixed 20% with white and back, as a smooth wave, once every 1600 ms. Its text does not change.
  - While the pointer is over the button, the background of `VIEW-28` is drawn instead and the pulse is not seen; when the pointer leaves it, the pulse goes on from the clock of the scene.
- **Reduced motion.** When the operating system asks for reduced motion, none of the three pulses: the frames and the button are drawn at their full opacity and color. This is the exception of `UI-30`.
- **Effects** (`UI-26`). The cyan frame, the gold frame and the mark of the button are essential: they show which cards can attack, whose turn it is and that the turn can be ended. Their pulses are non-essential: without them the marks are still seen.

## Scenarios

**A card ready to attack and the leader with the turn**
- Given the local player's turn and an own warrior with `attackAvailable`
- When the board is shown
- Then the warrior's cyan frame and the leader's gold frame pulse together once every 2400 ms, the cyan one down to 50% and the gold one down to 45%

**Nothing left to do**
- Given the local player's turn, no own card with `attackAvailable` and no card of the hand that can be played
- When the board is shown
- Then the background of the end turn button pulses once every 1600 ms

**Reduced motion**
- Given the operating system asks for reduced motion
- When an own card can attack
- Then its cyan frame is drawn fully opaque and does not pulse
