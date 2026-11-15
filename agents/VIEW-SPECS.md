# VIEW-SPECS

Appearance of the interface: layout, animation and sound. Behavior is in `specs/INTERFACE.md`. These rules gather what is already known and are expected to change as the game takes shape.

## Board

- **VIEW-1** The local player's zone is at the bottom, with their leader nearest to them. Every other zone is rotated towards its side, with its leader at the edge of the table. The cards of a zone turn with its slots and are drawn inside the four corners of their slot, deformed like it, so they follow its perspective. A card is as wide and as tall as the widest and tallest edges of its slot, and its pieces of equipment are deformed in the same way. Cards in the hand, dragged or in the side panel stay flat. See `PHASER4-SPECS.md`.
- **VIEW-2** The layout works for 2 to 10 players, with readable cards and hover previews. When few players share the table, the zones are drawn bigger, as much as the room allows: with two players, 1.25 times their base size, keeping a gap of at least 400 board units between the zones that face each other. The scale is rounded down to a multiple of 0.05, so a tiny gain does not change the layout. It never goes under the base size, and with three or more players there is no room, so it stays at 1. The outer edge of the zones stays where it was, and the zones grow towards the center. No two zones overlap and none leaves the table, for any count from 2 to 10.
- **VIEW-3** **[Post-MVP]** Rival hands are shown as card backs, a different one for each type and warrior rarity (`CON-13`).
- The enlargement of a card under the pointer, the side panel and the equipment sliding out (`VIEW-14`) are in `specs/ui/CARDS-HOVER.md`.
- The placement of the leaders at the start (`VIEW-12`) is in `specs/ui/GAME-PLACEMENT.md`.
- **VIEW-13** The rivals are taken in turn order starting with the one who plays after the local player, and are distributed over the left, top and right sides in that order, clockwise, so each client sees a different table and the turn goes around it. The sides take as many rivals as `VIEW-2` allows, the extra ones going first to the top, then to the left and then to the right, and with a single rival it is on the top. Inside a side the order follows the clockwise direction: from the bottom to the top on the left, from the left to the right on the top, and from the top to the bottom on the right.

- The frame of the leader with the turn (`VIEW-20`), the frame of an own card that can attack (`VIEW-17`) and the pulse of the end turn button (`VIEW-38`) are in `specs/ui/GAME-PULSES.md`.
- **VIEW-19** The wheel zooms the board, and dragging with the right or middle button pans it. Panning never acts on the cards or on the choice of a target (`VIEW-4`), only the primary button does. The wheel does nothing while a card is being dragged. The pan keeps the center of the screen inside the board, so the board never leaves the screen.
- **VIEW-24** When the window changes size, the board, the hand and the HUD are placed again, so all of them stay in view and the board stays centered. The camera zoom scales with the window relative to a reference screen of 1920 by 1080, taking the smaller of the two ratios, so at the reference size nothing changes. The board always sits at the same place of the world, so the composition is the same at any size. A pan or a zoom done by the player is lost when the window changes size. A confirmation dialog that is open is closed. Only desktop windows: the responsive layouts are **[Post-MVP]** (`VIEW-10`).
- **VIEW-27** The slots of the local player's zone are tinted blue, fill and border, so their cards are told apart from the rivals', whose slots keep the neutral look. The tint is the resting look of the slot: the marks of `VIEW-32` and `VIEW-17` are drawn over it and the slot goes back to it when a mark ends. An eliminated player's zone (`VIEW-11`) keeps its tint under the veil.
- **VIEW-28** A spectator or eliminated player (`UI-8`) sees, besides the button to leave, a label "Estás observando la partida" in grey just above it, so it is clear they are watching and cannot act. The buttons of the HUD, the same ones of the confirmation dialog, change their background when the pointer is over them, and the dialog has a border of the color of the buttons.
- **VIEW-29** The loading screen (`UI-12`, `UI-22`) shows its progress bar and its texts on a panel in the palette of the HUD, with the retry button styled like the buttons of the HUD. Everything is centered on the window and placed again when the window changes size, as in `VIEW-24`. When the load ends, the board appears fading in over the loading screen for 0.4 s while the loading screen fades out, and then the loading screen is removed. Nothing is shown about which players have not confirmed.
- The drag of a card, its marks and the dropped card while the server answers (`VIEW-32`, `VIEW-34`) are in `specs/ui/CARDS-DRAG.md`, a card that settles in a slot from an event (`VIEW-35`) in `specs/ui/CARDS-SETTLE.md`, and the equipment attached to a card (`VIEW-36`) in `specs/ui/CARDS-EQUIP.md`.
- **VIEW-26** The grid of the table is discreet, so it does not compete with the cards: thin, translucent lines, drawn once as a single path so that their transparency does not pile up.

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
- **VIEW-22** **[OPEN]** How many variants each rarity has for each action, and how many leaders and equipment have.
- **VIEW-10** **[Post-MVP]** Particles, special effects, a color-blind palette chosen in a settings screen (`UI-13`), the graphics quality and reduced motion options (`UI-27`), and responsive and touch layouts.
- The zone of an eliminated player and its notice (`VIEW-11`) are in `specs/ui/GAME-ELIMINATION.md`.
- The result of the game (`VIEW-23`) is in `specs/ui/GAME-RESULT.md`.
- The turn and round notices (`VIEW-15`) are in `specs/ui/GAME-NOTICES.md`.
