# Zone labels

What is drawn around each zone of the board so that it is told apart from the others: the health bar of its leader, its name and who plays next (Phase 11.3). Decided by the product owner on 2026-11-20, from images of 2, 6 and 10 players.

- **VIEW-49** Each zone has a label with the name of its player, with "Tú" in the local player's zone. It is drawn outside the zone, centered on the edge of the zone that faces away from the center of the table, which is the edge of its leader row (`VIEW-1`), and beyond the health bar of `VIEW-50`. It is below the zone in the local player's zone, above it in a zone of the top side and to the left or the right of it in the zones of the left and right sides (`VIEW-13`). The text is horizontal on the screen in every zone, 18 px on the screen with the window at 1920 by 1080 and the zoom of the camera at 1, and it keeps that size at any zoom, like the texts of `VIEW-41`. A name wider than 120 px on the screen with the window at 1920 by 1080 is cut and ends with "…", so the labels of zones next to each other do not touch with 10 players. The label never covers a slot, and it is drawn for the zone of an eliminated player too.
- **VIEW-50** The health bar of a leader is always drawn, whatever the options of the settings say (`UI-33`). It is outside its zone, on the same edge as the label of `VIEW-49`, 8 px away from the zone, and its label is beyond it. It is as long as the edge of the zone it is next to and 14 px thick on the screen, so it follows the zoom in length and not in thickness. It is horizontal below the local player's zone and above the zones of the top side, and vertical on the left and right sides. A horizontal bar fills from the left and a vertical one from the bottom. The share filled is the current health of the leader over its maximum (`CON-27`). Its fill is green with more than 60% of the health, yellow with more than 30% and up to 60%, and red with 30% or less, in provisional colors until Phase 11.5. It sits on a dark background with a thin light border. The zone of an eliminated player has no bar.
- **VIEW-51** The player who plays next, which is the first one alive after the player with the turn in the order of the zones (`TURN-1`), has a "▶ " before the name in its label and the text in gold, so only one is marked. It follows the turn of the board being shown (`UI-3`, `CON-12`), so it is also the local player's when they play next. With no player with the turn, such as after the game ends, no label is marked. The order of the rest of the players is not shown. Decided by the product owner on 2026-11-20 over a number in every name.

## Scenarios

**Next player**
- Given four players alive in the order A, B, C, D and the turn of B
- When the board is shown
- Then the label of C has the mark and the other three have not

**Skipped player**
- Given the same four players with C eliminated and the turn of B
- When the board is shown
- Then the label of D has the mark

**Long name**
- Given a name wider than 120 px at 18 px
- When the label is drawn
- Then the name ends with "…" and the label is not wider than 120 px
