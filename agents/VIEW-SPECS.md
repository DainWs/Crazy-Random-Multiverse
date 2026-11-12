# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's zone is at the bottom, with their leader nearest to them. Every other zone is rotated towards its side, with its leader at the edge of the table.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews.
- **VIEW-3** **[Post-MVP]** Rival hands are shown as card backs, a different one for each type and warrior rarity (`CON-13`).
- **VIEW-14** Hovering a card enlarges it slightly and shows a panel on the right side of the screen, a quarter of its width and its full height. The panel shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red. The equipment of a combatant is stacked behind it and slides out while hovering. The panel closes when the hovered card disappears, for example when its owner is eliminated (`ELIM-3`). **[Post-MVP]** A card back (`VIEW-3`) shows no panel, because the card is private (`HAND-3`).
- **VIEW-12** When the board is first shown after `GAME_START`, the leaders play an animation of being placed in their slots, one after the other in the order of `zones`, each with its `put` audio once sounds exist (`VIEW-9`). The animation of the first cards received (`VIEW-8`) waits for it to end. It is only visual: the leaders are already placed (`SETUP-2`), and events are applied to the state as the queue of `CON-12` delivers them. It does not play when entering a game in progress (`LOAD-6`), also for a client that reloaded the page after confirming and receives `GAME_START` during its new load: it only plays on a client that confirmed `/ready` from the page that shows the board.
- **VIEW-13** The rivals are taken in turn order starting with the one who plays after the local player, and are distributed over the left, top and right sides in that order, clockwise, so each client sees a different table and the turn goes around it. The sides take as many rivals as `VIEW-2` allows, the extra ones going first to the top, then to the left and then to the right, and with a single rival it is on the top. Inside a side the order follows the clockwise direction: from the bottom to the top on the left, from the left to the right on the top, and from the top to the bottom on the right.

- **VIEW-20** The leader of the player with the turn has a glow with a discreet pulse, besides the text of the HUD (`UI-3`). The pulse does not restart when the board is drawn again. It follows the turn of the board being shown, not the latest one received (`CON-12`). If that leader is already dead (`CON-32`), nothing glows.
- **VIEW-19** The wheel zooms the board, and dragging with the right or middle button pans it. Panning never acts on the cards or on the choice of a target (`VIEW-4`), only the primary button does. The wheel does nothing while a card is being dragged. The pan keeps the center of the screen inside the board, so the board never leaves the screen.
- **VIEW-24** When the window changes size, the board, the hand and the HUD are placed again, so all of them stay in view and the board stays centered. Only desktop windows: the responsive layouts are **[Post-MVP]** (`VIEW-10`).
- **VIEW-26** The grid of the table is discreet, so it does not compete with the cards.

## Combat

- **VIEW-4** A card attacks with clicks. Clicking an own card that cannot attack does nothing, and clicking one that can attack selects it: its slot is marked in red, the slots of the cards it can attack in green (`UI-5`), and an arrow goes from it to the pointer, green over a valid target and red elsewhere. Clicking a valid target attacks. Any other click with the primary button, Escape or a change of the game state cancels the selection without a message (`UI-25`), and the marks disappear with it; the other buttons pan (`VIEW-19`). While a card is being dragged, the slot under it is marked in green if the card can go there, and the slot it comes from, if it comes from the board, in red.
- **VIEW-5** A hit shows feedback, such as a shake or a red flash.
- **VIEW-6** Changes in armor and health are animated: the values count down to the new ones, and a floating text over the target shows the armor and health it lost (`CON-21`).
- **VIEW-7** A dead card plays a death animation before disappearing. A leader has its own.
- **VIEW-17** Protected cards and an exposed leader have no mark of their own: what tells them apart is the highlight of the valid targets while attacking (`UI-5`, `PROT-6`). The rule only covers protection and does not rule out other marks, such as one for the own cards that can attack.
- **VIEW-18** The equipment of a combatant is part of its card (`VIEW-14`): when the card dies (`EQUIP-8`) it plays the death animation together with it and has no animation of its own. The board drawn afterwards has neither.

## Other

- **VIEW-16** The hand has no limit (`HAND-1`), so the more cards it holds, the more they overlap, until each one only shows a minimum strip; from then on the hand grows wider. The hovered card shows whole, because the cards after it slide aside. At rest the hand is mostly hidden at the bottom edge, and it rises when hovered.
- **VIEW-25** The hand is centered horizontally on the screen according to the cards it holds, not according to the space it could take.
- **VIEW-8** Newly received cards are animated. Cards restored from `GAME_SYNC` are not. **[Post-MVP]** The back of the card a rival receives is animated too (`VIEW-3`).
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat.
- **VIEW-21** **[Post-MVP]** The rarer a card, the more audio variants each of its actions has: for example 1 for placing a Common card and 2 or 3 for a Mythic one.
- **VIEW-22** **[OPEN]** How many variants each rarity has for each action, and how many leaders and equipment have.
- **VIEW-10** **[Post-MVP]** Particles, special effects, reduced motion, color-blind indicators, and responsive and touch layouts.
- **VIEW-11** The zone of an eliminated player is shown empty, under a dark veil and with the label "Eliminado". The cards that leave the board with the elimination (`ELIM-3`) have no animation: they disappear when the board is drawn again. Only a leader killed by an attack plays its death (`VIEW-7`).
- **VIEW-23** The result (`WIN-4`) covers the board with a veil, and its texts, victory or defeat, the winner and the countdown, sit on a panel, so the slots of the board do not show through them.
- **VIEW-15** A brief notice announces each turn change, with "Tu turno" or the name of the player whose turn starts, and each new round, with "Ronda N". It is one more animation of the queue of `CON-12`.
