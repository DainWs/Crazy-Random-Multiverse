# Cards: side panel

The panel that shows the card under the pointer at a larger size, with what it is and what its equipment changes. Decided with the product owner on 2026-11-14.

- **VIEW-14** While the pointer is over a card, a panel on one side of the screen, a quarter of its width and its full height, shows the card at a larger size, its name and its description, and for each piece of equipment its name and the values it adds or subtracts, positive in green and negative in red. The card and the texts of the panel scale with the window like the camera does (`VIEW-24`), without growing over their size at 1920 by 1080, so they fit its height at the smallest window.
  - **Side.** It is on the right side, unless the card is in the right half of the screen, measured on the center of the card: then it is on the left side, so it never covers the card it shows. A card in the exact middle takes the right side. It is decided when the panel opens or shows another card, and the panel does not change side while it shows the same card.
  - **Over the HUD.** The panel is over the pieces of the HUD fixed on the screen, which are the panel of the round and the turn, every button (`VIEW-43`, the button to leave of a spectator and the menu button of `VIEW-60`) and the label of a spectator, so it covers them while it is open. The confirmation dialog and the result (`UI-15`, `VIEW-23`) are over the panel. The game menu, the settings screen and the help panel (`UI-36`, `UI-33`, `UI-34`) are panels of Vue, over the whole canvas. Decided with the product owner on 2026-11-21, and on 2026-11-22 the button to leave and the menu button, which replaced the settings and help buttons, went under the panel with the other buttons (`.claude/skills/frontend-conventions/SKILL.md`).
  - **[Post-MVP]** A card back (`VIEW-3`) shows no panel, because the card is private (`HAND-3`).
  - **Effects** (`UI-26`). The panel is essential: it shows what the card under the pointer is. **[Post-MVP]** It has no low quality version (`UI-28`).
- **VIEW-59** While the board being shown is the turn of the local player (`CON-12`), the side panel of an own card of the board that can attack now (`attackAvailable`, `CON-15`) has the line "Puede atacar este turno" between its name and its description, in the cyan `#00e5ff` of `VIEW-17`, at the label level of `VIEW-55`. It is the condition of the cyan frame, so the line and the frame are seen together. No other card has the line: an own card that cannot attack, a rival card and a card of the hand show nothing in its place, and neither does any card outside that turn. The contract does not say why a card cannot attack, so the panel gives no reason, as the click on it says nothing (`VIEW-4`, `UI-25`). The line is decided when the panel shows the card. Decided by the product owner on 2026-11-22, who chose to say only when the card can attack.

## Scenarios

**A card in the right half**
- Given a rival card in the zone of the right side, with the board zoomed so that the card is in the right half of the screen
- When the pointer enters it
- Then the panel opens on the left side, sliding from the left

**The panel over the HUD**
- Given the panel open
- When the end turn button is under it
- Then the panel covers the button

**A card that can attack**
- Given the local player's turn and an own warrior with `attackAvailable`
- When the pointer enters it
- Then the side panel says "Puede atacar este turno" in cyan below the name, and the side panel of a rival card does not

## Effects

- `docs/specs/ui/effects/cards-hover.md` — how the panel opens, closes and changes card (`VIEW-64`).
