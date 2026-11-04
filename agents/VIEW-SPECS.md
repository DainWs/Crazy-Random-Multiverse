# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's leader is shown nearest to them.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews.
- **VIEW-3** Rival hands are shown as card backs.
- **VIEW-12** When the board is first shown after `GAME_START`, the leaders play an animation of being placed in their slots, one after the other in the order of `zones`, each with its `put` audio once sounds exist (`VIEW-9`). The animation of the first cards received (`VIEW-8`) waits for it to end. It is only visual: the leaders are already placed (`SETUP-2`), and events are applied to the state as they arrive. It does not play when entering a game in progress (`LOAD-6`).

## Combat

- **VIEW-4** While choosing a target, an arrow or highlight is shown while dragging.
- **VIEW-5** A hit shows feedback, such as a shake or a red flash.
- **VIEW-6** Changes in armor and health are animated.
- **VIEW-7** A dead card plays a death animation before disappearing. A leader has its own.

## Other

- **VIEW-8** Newly received cards are animated.
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat.
- **VIEW-10** **[Post-MVP]** Particles, special effects, reduced motion, color-blind indicators, and responsive and touch layouts.
- **VIEW-11** The zone of an eliminated player is shown empty and marked as eliminated.
