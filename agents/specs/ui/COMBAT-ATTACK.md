# Combat: attack

How the local player chooses an attacker and its target. The behavior of the interface is in `../INTERFACE.md` (`UI-4`, `UI-5`, `UI-25`), and the durations and curves in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-4** A card attacks with clicks, while gameplay is enabled (`UI-4`).
  - **Selecting.** A click on an own card that cannot attack now (`attackAvailable`, `CON-15`) does nothing. A click on one that can attack selects it and lifts it.
  - **Lifting the attacker.** The selected card grows from its center to 112% of its size, and a shadow with the shape of the card appears under it, offset down on the screen by 6% of the height of the card. It is drawn above every other card of the board, its slot gets no frame, and its cyan frame of `VIEW-17` is not drawn. While the pointer is over it, it does not get the enlargement of `VIEW-14`.
  - **Pointer over a rival card.** While a card is selected, a rival card under the pointer lifts: it grows from its center to 106% of its size, in place of the enlargement of `VIEW-14`, with a shadow offset down on the screen by 3% of its height, and is drawn above every other card of the board except the attacker. Besides:
    - If it is a valid target (`UI-5`): a green frame.
    - If it is not (`CON-15`), which includes every protected card and a leader that is not exposed (`PROT-6`): a red frame, and a crossed circle icon centered on the card.

    The frame is drawn like the marks of `VIEW-32`: a solid frame over the card and over the border of its slot, as thick as that border. The frame and the icon appear at once when the card starts to lift, and disappear at once when it starts to lower. The card lowers when the pointer leaves it. The side panel of `VIEW-14` is shown as at any other moment.
  - **Pointer over an own card.** While a card is selected, an own card under the pointer gets the enlargement of `VIEW-14` as at any other moment, with no frame and no icon.
  - **Clicks while a card is selected.**
    - On the selected card: cancels the selection.
    - On another own card that can attack: the selected card lowers, and the clicked one is selected and lifts.
    - On a valid target: attacks.
    - On any other card, own or rival: nothing happens and the selection is kept. **[Post-MVP]** A sound says that the click was refused (`VIEW-9`).
    - With the primary button on a place without a card: cancels the selection.
    - With another button: pans the board (`VIEW-19`) and keeps the selection.
  - **Cancelling.** Escape, a click that cancels, or a change of the game state end the selection without a message (`UI-25`): the lifted cards lower.
  - **Timing.** Lifting lasts 150 ms and slows down at the end. Lowering lasts 150 ms, slows down at the end, and ends exactly at the rest size, with the shadow gone (`VIEW-30`, `VIEW-31`).
  - **Attacking.** After the click on a valid target, the attacker and the target stay lifted, the target with its green frame, while the request is pending (`UI-4`). When the event of the attack is applied, both go back to their rest size as `VIEW-5` says. If another event of the queue (`CON-12`) is applied first, or the request is rejected, both lower, and a rejection shows the message of `UI-6`.
  - **[OPEN]** The color and the opacity of the shadows, and the size of the icon on the screen, decided with the product owner looking at them.
  - **Attack applied.** The lunge and the hit are in `VIEW-5`.
  - **Effects** (`UI-26`). The lifts, the frames and the icon are essential: they show which card is selected and whether a card can be attacked. **[OPEN] [Post-MVP]** Their versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**Changing the attacker**
- Given an own card A selected and lifted, and an own card B that can attack
- When the player clicks B
- Then A lowers, and B is selected and lifts

**Pointer over a protected card**
- Given an own card selected
- When the pointer enters a rival card that is protected
- Then that card lifts to 106% with a red frame and the crossed circle; a click on it does nothing and keeps the selection

**Pointer over a valid target**
- Given an own card selected
- When the pointer enters a rival card that is a valid target
- Then that card lifts to 106% with a green frame and no icon

**Waiting for the server**
- Given an own card selected and lifted
- When the player clicks a valid target
- Then the attacker and the target stay lifted until the event of the attack is applied, and then the attacker lunges from its lifted size (`VIEW-5`)
