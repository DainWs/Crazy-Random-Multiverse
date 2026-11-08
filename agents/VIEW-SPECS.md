# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's zone is at the bottom, with their leader nearest to them. Every other zone is rotated towards its side, with its leader at the edge of the table.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews.
- **VIEW-3** Rival hands are shown as card backs.
- **VIEW-14** Hovering a card enlarges it slightly and shows a panel on the right side of the screen, a quarter of its width and its full height. The panel shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red. The equipment of a combatant is stacked behind it and slides out while hovering. A card back shows no panel, because the card is private (`HAND-3`).
- **VIEW-12** When the board is first shown after `GAME_START`, the leaders play an animation of being placed in their slots, one after the other in the order of `zones`, each with its `put` audio once sounds exist (`VIEW-9`). The animation of the first cards received (`VIEW-8`) waits for it to end. It is only visual: the leaders are already placed (`SETUP-2`), and events are applied to the state as the queue of `CON-12` delivers them. It does not play when entering a game in progress (`LOAD-6`).
- **VIEW-13** The rivals are distributed over the top, left and right sides in a loop, following the order of `zones` without starting from the local player, so each client sees a different table and the turn does not go around it. To be reviewed when testing the layouts (`ROADMAP.md`, Phase 10).

## Combat

- **VIEW-4** While choosing a target, an arrow or highlight is shown while dragging.
- **VIEW-5** A hit shows feedback, such as a shake or a red flash.
- **VIEW-6** Changes in armor and health are animated: the values count down to the new ones, and a floating text over the target shows the armor and health it lost (`CON-21`).
- **VIEW-7** A dead card plays a death animation before disappearing. A leader has its own.
- **VIEW-17** Protected cards and an exposed leader have no mark of their own: the only highlight is the one of the valid targets while attacking (`UI-5`, `PROT-6`).
- **VIEW-18** The equipment of a combatant is part of its card (`VIEW-14`): when the card dies (`EQUIP-8`) it plays the death animation together with it and has no animation of its own. The board drawn afterwards has neither.

## Other

- **VIEW-16** **[OPEN]** How a hand that does not fit is shown, since `HAND-1` sets no limit. Probably the cards overlap. To be decided when testing the layouts (`ROADMAP.md`, Phase 10).
- **VIEW-8** Newly received cards are animated, including the card a rival receives, which is not revealed. Cards restored from `GAME_SYNC` are not.
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat.
- **VIEW-10** **[Post-MVP]** Particles, special effects, reduced motion, color-blind indicators, and responsive and touch layouts.
- **VIEW-11** The zone of an eliminated player is shown empty and marked as eliminated.
- **VIEW-15** A brief notice announces each turn change, with "Tu turno" or the name of the player whose turn starts, and each new round, with "Ronda N". It is one more animation of the queue of `CON-12`.
