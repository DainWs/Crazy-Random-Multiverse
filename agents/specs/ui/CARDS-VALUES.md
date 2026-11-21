# Card values on the board

The damage, armor and health of the cards of the board, drawn outside the card so that they can be read without hovering (Phase 11.3). Decided by the product owner on 2026-11-20, after measuring that none of the three reaches 18 px on the card with 2 to 10 players (`ROADMAP.md`, Phase 11.3).

- **VIEW-46** Each value that the player has turned on in the settings (`UI-33`) is drawn outside every card of the board, leaders included, one label per value, 18 px or more on the screen with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`). A label keeps its size on the screen at any zoom and any count of players, like the texts of `VIEW-41`. With the three off, the cards are drawn as before. The label shows the value of the card with its equipment included (`CON-27`). The cards, and the values of the side panel (`VIEW-14`), do not change.
- **VIEW-47** The values of a card that are on are drawn together in one group, in a row, in the order damage, armor and health, centered on the edge of the card that faces away from the center of its own zone's table side, that is, the edge that is its bottom in the frame of its zone (`VIEW-1`), and just outside it. In the local player's zone it is the lower edge of the card, below it. In a rival's zone it is the edge towards the edge of the table the zone sits at: above the card in a zone of the top side, to the left in a zone of the left side and to the right in a zone of the right side (`VIEW-13`). The text stays horizontal on the screen in every zone, and it does not turn with a rotated zone. Decided by the product owner on 2026-11-20, from the variant A of the images shown.
- **VIEW-48** The groups are never moved, so those of neighboring cards can overlap, which happens from 6 players on with several values on (a group of three values is about 80 px wide on the screen at 18 px). Where two overlap, the one of the card closest to the local player's leader is drawn on top, measured in a straight line between the centers of the cards on the screen. A group is drawn over the slots and the cards of the board. The health shows only its current value, not the maximum. Decided by the product owner on 2026-11-20.
- **VIEW-56** The three values are drawn in white, with the icon of each one beside the number: the icon tells which value it is, and the colors of the interface are kept for one meaning each (`VIEW-52`). Decided with the product owner on 2026-11-21.

## Scenarios

**One value on**
- Given the health turned on and the other two off
- When the board is shown
- Then every card of the board has a label with its health, and none has damage or armor

**All off**
- Given the three off
- When the board is shown
- Then no card has a label
