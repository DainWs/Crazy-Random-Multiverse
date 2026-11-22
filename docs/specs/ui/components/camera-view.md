# Camera of the board

How the board is seen: from straight above or tilted, as before 2026-11-21. Decided by the product owner on 2026-11-21, after images of the full board with values from 1 to 100000: from above no card shrinks or is deformed for being far, so the card of a rival reads like an own one.

- **VIEW-57** The board is seen with one of two cameras, which the player chooses in the settings screen (`UI-33`). The top-down camera is the default.
  - **Top-down.** The board is seen from straight above: every point of the table has the same scale, so nothing shrinks for being far from the local player. The table is a rectangle with its border, without the thickness of its sides and its legs. The cards of the board are flat, as wide and as tall as their slot, and turn with their zone (`VIEW-1`). At the start, and after the window changes size (`VIEW-24`), the whole table and the labels of its zones (`VIEW-49` to `VIEW-51`) are in view, centered horizontally, between the top edge of the screen and the hand at rest (`VIEW-16`), and no other piece of the HUD overlaps them, apart from the marks of the board, which are drawn on it. The hand at rest is counted because its strip has the same size on the screen at any window: without it, at 1280 by 720 with 10 players, it covered the name and the health bar of the local player's zone (measured on 2026-11-21 with a prototype). At any zoom, the texts of a card of the board are drawn with at least one pixel of the canvas for each pixel of the screen, so a card is sharper when the camera zooms in, not blurrier.
  - **Tilted.** The look of the board before 2026-11-21: the table is seen in perspective, the far side smaller than the near one, with the thickness of its sides and its legs, and the cards are drawn inside the four corners of their slot, deformed like it (`VIEW-1`).
  - **Change.** A change of the camera applies at once: the board is drawn again with the other camera and framed again, as when the window changes size, so a pan or a zoom done by the player is lost (`VIEW-19`, `VIEW-24`). While an animation of the board is playing, the change waits until the animations end (`VIEW-30`). Nothing of the game state changes.

## Scenarios

**First visit**
- Given a player who never chose a camera
- When the game is shown
- Then the board is seen from above, and the cards of the top side are as big as those of the local player

**Smallest window, ten players**
- Given the top-down camera, a window of 1280 by 720 and 10 players
- When the game is shown
- Then the whole table is in view, and the name and the health bar of the local player's zone are above the hand at rest

**Tilted camera**
- Given the tilted camera chosen in the settings
- When the game is shown
- Then the far side of the table is smaller than the near one, and the cards follow the perspective of their slots

**Zoom in from above**
- Given the top-down camera
- When the player zooms in on a card
- Then the texts of the card are sharper than before the zoom

**Change during an animation**
- Given an attack being animated
- When the player chooses the other camera
- Then the attack ends with the camera it started with, and then the board is drawn with the new one
