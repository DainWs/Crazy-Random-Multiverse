# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's zone is at the bottom, with their leader nearest to them. Every other zone is rotated towards its side, with its leader at the edge of the table. The cards of a zone turn with its slots. With the tilted camera (`VIEW-57`) they are drawn inside the four corners of their slot, deformed like it, so they follow its perspective; a card is as wide and as tall as the widest and tallest edges of its slot, and its pieces of equipment are deformed in the same way. With the top-down camera, the default, the slots are not deformed and neither are the cards. Cards in the hand, dragged or in the side panel stay flat. See `PHASER4-SPECS.md`.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews. When few players share the table, the zones are drawn bigger, as much as the room allows: with two players, 1.25 times their base size, keeping a gap of at least 400 board units between the zones that face each other. The scale is rounded down to a multiple of 0.05, so a tiny gain does not change the layout. It never goes under the base size, and with three or more players there is no room, so it stays at 1. The outer edge of the zones stays where it was, and the zones grow towards the center. No two zones overlap and none leaves the table, for any count from 2 to 10.
- **VIEW-3** **[Post-MVP]** Rival hands are shown as card backs, a different one for each type and warrior rarity (`CON-13`).
- The enlargement of a card under the pointer, the side panel and the equipment sliding out (`VIEW-14`), and the line of an own card that can attack (`VIEW-59`), are in `specs/ui/CARDS-HOVER.md`.
- The placement of the leaders at the start (`VIEW-12`) is in `specs/ui/GAME-PLACEMENT.md`.
- **VIEW-13** The rivals are taken in turn order starting with the one who plays after the local player, and are distributed over the left, top and right sides in that order, clockwise, so each client sees a different table and the turn goes around it. The sides take as many rivals as `VIEW-2` allows, the extra ones going first to the top, then to the left and then to the right, and with a single rival it is on the top. Inside a side the order follows the clockwise direction: from the bottom to the top on the left, from the left to the right on the top, and from the top to the bottom on the right.

- The frame of the leader with the turn (`VIEW-20`), the frame of an own card that can attack (`VIEW-17`) and the pulse of the end turn button (`VIEW-38`) are in `specs/ui/GAME-PULSES.md`.
- **VIEW-19** The wheel zooms the board, and dragging with the right or middle button pans it. Panning never acts on the cards or on the choice of a target (`VIEW-4`), only the primary button does. The wheel does nothing while a card is being dragged. The pan keeps the center of the screen inside the board, so the board never leaves the screen.
- **VIEW-24** The smallest supported window is 1280 by 720, decided with the product owner on 2026-11-21, and the largest checked is 1920 by 1080. At every size from the first to the second, with 2 to 10 players, the HUD does not overlap the table, the zones or each other, and the hand at rest only overlaps the bottom edge of the table. Below the smallest size the layout is not guaranteed. When the window changes size, the board, the hand and the HUD are placed again, so all of them stay in view and the board stays centered. The camera zoom scales with the window relative to a reference screen of 1920 by 1080, taking the smaller of the two ratios, so at the reference size nothing changes. The board always sits at the same place of the world, so the composition is the same at any size. A pan or a zoom done by the player is lost when the window changes size. A confirmation dialog that is open is closed. Only desktop windows: the responsive layouts are **[Post-MVP]** (`VIEW-10`).
- **VIEW-27** The slots of the local player's zone are tinted blue, fill and border, so their cards are told apart from the rivals', whose slots keep the neutral look. The tint is the resting look of the slot: the marks of `VIEW-32` and `VIEW-17` are drawn over it and the slot goes back to it when a mark ends. An eliminated player's zone (`VIEW-11`) keeps its tint under the veil.
- The buttons of the HUD under the pointer, the border of the confirmation dialog, the label of a spectator (`VIEW-28`), the look and place of the end turn and surrender buttons (`VIEW-43`) and the panel of the round and the turn (`VIEW-44`) are in `specs/ui/HUD-BUTTONS.md`.
- The loading screen and its change to the board (`VIEW-29`) are in `specs/ui/GAME-LOADING.md`.
- The name of each zone, the health bar of its leader and the mark of who plays next (`VIEW-49` to `VIEW-51`) are in `specs/ui/ZONES-LABELS.md`.
- The two cameras of the board, top-down and tilted (`VIEW-57`), are in `specs/ui/CAMERA-VIEW.md`.
- The help button and its panel, with the legend of the marks of the board (`VIEW-58`), are in `specs/ui/HUD-HELP.md`.
- The drag of a card, its marks and the dropped card while the server answers (`VIEW-32`, `VIEW-34`) are in `specs/ui/CARDS-DRAG.md`, a card that settles in a slot from an event (`VIEW-35`) in `specs/ui/CARDS-SETTLE.md`, and the equipment attached to a card (`VIEW-36`) in `specs/ui/CARDS-EQUIP.md`.
- **VIEW-26** The grid of the table is discreet, so it does not compete with the cards: thin, translucent lines, drawn once as a single path so that their transparency does not pile up.
- **VIEW-45** Only in the accessible mode (`UI-31`), the base game keeps the background as it is. The background of the window around the table is darkened in the game, so the board stands out over it: a black layer at 55% opacity between the background and the board, covering the whole window. The table is translucent, so it is seen a little darker too, but no color of the table, the HUD or the cards changes. It is only in the game, not in the loading screen, the menu or the party. Decided with the product owner on 2026-11-19, and moved to the accessible mode on 2026-11-20.

## Combat

- The attack (`VIEW-4`) is in `specs/ui/COMBAT-ATTACK.md`, and the shared durations and curves of the animations (`VIEW-30`, `VIEW-31`) in `specs/ui/MOTION-BASE.md`.
- The hit (`VIEW-5`) is in `specs/ui/COMBAT-HIT.md`.
- The count of the values and the floating text (`VIEW-6`) are in `specs/ui/COMBAT-VALUES.md`.
- The death of a card and of a leader, the equipment that dies with its card and the total duration of an attack (`VIEW-7`, `VIEW-18`, `VIEW-33`) are in `specs/ui/COMBAT-DEATH.md`.

## Other

- The layout and the motion of the hand (`VIEW-16`, `VIEW-25`) are in `specs/ui/HAND-MOTION.md`.
- The arrival of a card in the hand (`VIEW-8`) is in `specs/ui/HAND-ARRIVAL.md`.
- **VIEW-9** **[Post-MVP]** Sounds exist for placement, attack, death, turn and round changes, victory and defeat, and for a click refused while attacking (`VIEW-4`).
- **VIEW-21** **[Post-MVP]** The rarer a card, the more audio variants each of its actions has: for example 1 for placing a Common card and 2 or 3 for a Mythic one.
- **VIEW-22** **[Post-MVP]** Leaders have one variant for each action, like a Common warrior. A piece of equipment has the variants of the rarity of the warrior it is attached to, and one while it has none (`FX-16`). Decided by the product owner on 2026-11-17. **[OPEN]** How many variants each rarity has for each action.
- **VIEW-10** **[Post-MVP]** Particles, special effects, a color-blind palette chosen in a settings screen (`UI-13`), the graphics quality and reduced motion options (`UI-27`), and responsive and touch layouts.
- The zone of an eliminated player and its notice (`VIEW-11`) are in `specs/ui/GAME-ELIMINATION.md`.
- The result of the game (`VIEW-23`) is in `specs/ui/GAME-RESULT.md`.
- The turn and round notices (`VIEW-15`) are in `specs/ui/GAME-NOTICES.md`.
- The colors of the interface and their meanings (`VIEW-52`) are in `specs/ui/PALETTE.md`, what is drawn when two marks are on the same slot (`VIEW-53`) in `specs/ui/MARKS-PAIRS.md`, and the typefaces and the four sizes of the texts (`VIEW-54`, `VIEW-55`) in `specs/ui/TYPOGRAPHY.md`.
- The second signal of the marks of the board (`VIEW-39`) is in `specs/ui/MARKS-SECOND-SIGNAL.md`.
- The minimum contrasts of the texts and of the marks (`VIEW-40`) are in `specs/ui/CONTRAST-MINIMUMS.md`, and the minimum size of the texts (`VIEW-41`) in `specs/ui/TEXT-MINIMUM-SIZE.md`.
