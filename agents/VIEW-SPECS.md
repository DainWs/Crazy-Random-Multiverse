# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's zone is at the bottom, with their leader nearest to them. Every other zone is rotated towards its side, with its leader at the edge of the table.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews.
- **VIEW-3** **[Post-MVP]** Rival hands are shown as card backs, a different one for each type and warrior rarity (`CON-13`).
- **VIEW-14** Hovering a card enlarges it slightly and shows a panel on the right side of the screen, a quarter of its width and its full height. The panel shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red. The equipment of a combatant is stacked behind it and slides out while hovering. A card back shows no panel, because the card is private (`HAND-3`).
- **VIEW-12** When the board is first shown after `GAME_START`, the leaders play an animation of being placed in their slots, one after the other in the order of `zones`, each with its `put` audio once sounds exist (`VIEW-9`). The animation of the first cards received (`VIEW-8`) waits for it to end. It is only visual: the leaders are already placed (`SETUP-2`), and events are applied to the state as the queue of `CON-12` delivers them. It does not play when entering a game in progress (`LOAD-6`).
- **VIEW-13** The rivals are distributed over the top, left and right sides in a loop, following the order of `zones` without starting from the local player, so each client sees a different table and the turn does not go around it. To be reviewed when testing the layouts (`ROADMAP.md`, Phase 10).

- **VIEW-20** The leader of the player with the turn has a glow, besides the text of the HUD (`UI-3`). It follows the turn of the board being shown, not the latest one received (`CON-12`). If that leader is already dead (`CON-32`), nothing glows.
- **VIEW-19** The wheel zooms the board, and dragging with the right or middle button pans it. Panning never acts on the cards or on the choice of a target (`VIEW-4`), only the primary button does. The wheel does nothing while a card is being dragged. The pan keeps the center of the screen inside the board, so the board never leaves the screen.

## Combat

- **VIEW-4** A card attacks with clicks. Clicking an own card that can attack selects it, and an arrow goes from it to the pointer, green over a valid target and red elsewhere. Clicking a valid target attacks. Any other click, Escape or a change of the game state cancels the selection. While a card is being dragged, the slot under it is highlighted if the card can go there.
- **VIEW-5** A hit shows feedback, such as a shake or a red flash.
- **VIEW-6** Changes in armor and health are animated: the values count down to the new ones, and a floating text over the target shows the armor and health it lost (`CON-21`).
- **VIEW-7** A dead card plays a death animation before disappearing. A leader has its own.
- **VIEW-17** Protected cards and an exposed leader have no mark of their own: the only highlight is the one of the valid targets while attacking (`UI-5`, `PROT-6`).
- **VIEW-18** The equipment of a combatant is part of its card (`VIEW-14`): when the card dies (`EQUIP-8`) it plays the death animation together with it and has no animation of its own. The board drawn afterwards has neither.

## Other

- **VIEW-16** The hand has no limit (`HAND-1`), so the more cards it holds, the more they overlap, until each one only shows a minimum strip; from then on the hand grows wider. The hovered card shows whole, because the cards after it slide aside. At rest the hand is mostly hidden at the bottom edge, and it rises when hovered.
- **VIEW-8** Newly received cards are animated. Cards restored from `GAME_SYNC` are not. **[Post-MVP]** The back of the card a rival receives is animated too (`VIEW-3`).
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat.
- **VIEW-21** **[Post-MVP]** The rarer a card, the more audio variants each of its actions has: for example 1 for placing a Common card and 2 or 3 for a Mythic one.
- **VIEW-22** **[OPEN]** How many variants each rarity has for each action, and how many leaders and equipment have.
- **VIEW-10** **[Post-MVP]** Particles, special effects, reduced motion, color-blind indicators, and responsive and touch layouts.
- **VIEW-11** The zone of an eliminated player is shown empty and marked as eliminated.
- **VIEW-15** A brief notice announces each turn change, with "Tu turno" or the name of the player whose turn starts, and each new round, with "Ronda N". It is one more animation of the queue of `CON-12`.
