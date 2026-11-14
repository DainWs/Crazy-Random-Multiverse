# Combat: attack

How the local player chooses an attacker and its target. The behavior of the interface is in `../INTERFACE.md` (`UI-4`, `UI-5`, `UI-25`), and the durations and curves in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-4** A card attacks with clicks, while gameplay is enabled (`UI-4`).
  - **Selecting.** A click on an own card that cannot attack now (`attackAvailable`, `CON-15`) does nothing. A click on one that can attack selects it and lifts it.
  - **Lift.** The selected card grows from its center to 112% of its size, and a shadow with the shape of the card appears under it, offset down on the screen by 6% of the height of the card. **[OPEN]** The color and the opacity of the shadow, decided with the product owner looking at it. The lift lasts 150 ms and slows down at the end (`VIEW-30`, `VIEW-31`). The lifted card is drawn above every other card of the board, its slot gets no frame, and its cyan frame of `VIEW-17` is not drawn. While the pointer is over it, it does not get the enlargement of `VIEW-14`.
  - **Pointer over a card.** While a card is selected, every card of the board under the pointer gets the enlargement of `VIEW-14` as at any other moment, and the side panel is shown. Besides, an icon is shown over it, centered on the card: a target over a valid target (`UI-5`), and a crossed circle over a rival card that is not one (`CON-15`), which includes every protected card and a leader that is not exposed (`PROT-6`). An own card shows no icon, because it is never a target. The icon appears when the pointer enters the card and disappears when it leaves, at once, without animation. **[OPEN]** The size of the icon on the screen, decided with the product owner looking at it.
  - **Clicks while a card is selected.**
    - On the selected card: cancels the selection.
    - On another own card that can attack: the selected card lowers, and the clicked one is selected and lifts.
    - On a valid target: attacks.
    - On any other card, own or rival: that card shakes and the selection is kept. It moves horizontally on the screen, from side to side, three times in 250 ms, with an amplitude that goes down from 6 px to 0, and ends exactly where it was. Only the card moves, not its slot nor the camera.
    - With the primary button on a place without a card: cancels the selection.
    - With another button: pans the board (`VIEW-19`) and keeps the selection.
  - **Cancelling.** Escape, a click that cancels, or a change of the game state end the selection without a message (`UI-25`): the selected card lowers.
  - **Lowering.** The card goes back to its size and its shadow disappears in 150 ms, slowing down at the end, and it ends exactly at its rest size (`VIEW-30`, `VIEW-31`).
  - **Attacking.** After the click on a valid target, the icon disappears and the attacker stays lifted while the request is pending (`UI-4`). It lowers when the next event of the queue (`CON-12`) is applied, normally the one of the attack, or when the request is rejected, with the message of `UI-6`.
  - **Effects** (`UI-26`). The lift, the icons and the shake are essential: they show which card is selected, whether a card can be attacked and that a click was refused. **[OPEN] [Post-MVP]** Their versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**Changing the attacker**
- Given an own card A selected and lifted, and an own card B that can attack
- When the player clicks B
- Then A lowers, and B is selected and lifts

**Pointer over a protected card**
- Given an own card selected
- When the pointer enters a rival card that is protected
- Then the card gets the enlargement of `VIEW-14` and shows the crossed circle; a click on it shakes it and keeps the selection

**Waiting for the server**
- Given an own card selected and lifted
- When the player clicks a valid target
- Then the attacker stays lifted until the next event is applied or the request is rejected, and then lowers
