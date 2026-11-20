# Card values on the board

The damage, armor and health of the cards of the board, drawn outside the card so that they can be read without hovering (Phase 11.3). Decided by the product owner on 2026-11-20, after measuring that none of the three reaches 18 px on the card from 4 players on (`ROADMAP.md`, Phase 11.3).

- **VIEW-46** Each value that the player has turned on in the settings (`UI-33`) is drawn outside every card of the board, leaders included, one label per value, 18 px or more on the screen with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`). A label keeps its size on the screen at any zoom and any count of players, like the texts of `VIEW-41`. With the three off, the cards are drawn as before. The label shows the value of the card with its equipment included (`CON-27`). The cards, and the values of the side panel (`VIEW-14`), do not change.
- **[OPEN]** Where each label is drawn and how the three of one card and the labels of neighboring cards are arranged so that they never overlap, with 10 players; the color of each label (the colors are decided in Phase 11.5); and whether the labels of a rotated zone (`VIEW-1`) turn with it or stay horizontal; and whether the health shows only the current value or also the maximum. They are decided with the product owner, with images, and written here.

## Scenarios

**One value on**
- Given the health turned on and the other two off
- When the board is shown
- Then every card of the board has a label with its health, and none has damage or armor

**All off**
- Given the three off
- When the board is shown
- Then no card has a label
