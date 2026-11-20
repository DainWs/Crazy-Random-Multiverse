# Card values on the board

The damage, armor and health of the cards of the board, drawn outside the card so that they can be read without hovering (Phase 11.3). Decided by the product owner on 2026-11-20, after measuring that none of the three reaches 18 px on the card from 4 players on (`ROADMAP.md`, Phase 11.3).

- **VIEW-46** Each value that the player has turned on in the settings (`UI-33`) is drawn outside every card of the board, leaders included, one label per value, 18 px or more on the screen with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`). A label keeps its size on the screen at any zoom and any count of players, like the texts of `VIEW-41`. With the three off, the cards are drawn as before. The label shows the value of the card with its equipment included (`CON-27`). The cards, and the values of the side panel (`VIEW-14`), do not change.
- **VIEW-47** The values of a card that are on are drawn together in one group, in a row, in the order damage, armor and health, centered on the edge of the card that faces away from the center of its own zone's table side, that is, the edge that is its bottom in the frame of its zone (`VIEW-1`), and just outside it. In the local player's zone it is the lower edge of the card, below it. In a rival's zone it is the edge towards the edge of the table the zone sits at: above the card in a zone of the top side, to the left in a zone of the left side and to the right in a zone of the right side (`VIEW-13`). The text stays horizontal on the screen in every zone, and it does not turn with a rotated zone. Decided by the product owner on 2026-11-20, from the variant A of the images shown.
- **[OPEN]** What happens when the groups of neighboring cards would overlap, which is the case from 6 players on with several values on (a group of three values is about 80 px wide on the screen at 18 px): which one is drawn on top, or whether they are moved; the color of each value (the colors are decided in Phase 11.5); and whether the health shows only the current value or also the maximum. They are decided with the product owner, with images, and written here.

## Scenarios

**One value on**
- Given the health turned on and the other two off
- When the board is shown
- Then every card of the board has a label with its health, and none has damage or armor

**All off**
- Given the three off
- When the board is shown
- Then no card has a label
