# Visual effects

Effects and skins that go beyond the base appearance of `docs/specs/ui/readme.md`. Proposals of skins, as reference material and not as rules, are in `docs/skins/`. Everything here is **[Post-MVP]**: the MVP only has the effects of `docs/specs/ui/readme.md`, such as the attack (`VIEW-4`), the combat feedback (`VIEW-5` to `VIEW-7`), the veil of an eliminated zone (`VIEW-11`), the placement of the leaders (`VIEW-12`), the turn notices (`VIEW-15`) and the glow of the leader (`VIEW-20`). The effects are drawn by the frontend from confirmed events and never change the game state (`ARCH-2`).

- **FX-1** **[Post-MVP]** The effects grow with the rarity of the card, in the same way as its audio variants (`VIEW-21`): the rarer the card, the more and the stronger the effects it plays.
- **FX-2** **[Post-MVP]** An effect belongs to one of three groups. Every effect of this file is non-essential (`UI-26`):
  - *Card effects*: they stay on the card while it is on the board or in the hand (`FX-7`).
  - *Action effects*: they play once when an action happens (`FX-4`, `FX-8`).
  - *Interface effects*: they belong to the interface, not to a card. None is specified yet.

  A skin (`FX-10`) is not an effect: turning the effects off (`FX-13`) does not change the skin.
- **FX-3** **[Post-MVP]** An effect is described by data (rarity it applies to, trigger, duration, intensity), not by a branch in the code of each card. A new effect is added without changing the cards.
- **FX-22** **[Post-MVP]** The animations, the sounds and the effects are not part of the HUD (`VIEW-62`) nor of any skin (`FX-10`), so each card can have its own: a card can have an animation, a sound or an effect different from those of the rest of the cards, and what it does not define is the one every card has (`docs/specs/ui/readme.md`) and the one of its rarity (`FX-1`, `VIEW-21`). **[OPEN]** Which animations, sounds and effects a card can replace, and who defines them. Decided by the product owner on 2026-11-22.

## Heartbeat

- **FX-4** **[Post-MVP]** Heartbeat: the screen dims with a slow pulse, darker towards the edges, while something important is going on. It is a pulse of the dimming, not of the cards.
- **FX-5** **[Post-MVP]** The heartbeat plays when a Legendary or Mythic warrior attacks, for every player. It starts with the `PLAYER_ATTACK_CARD` event, not with the click of the player, and ends when the animations of the attack (`VIEW-5`, `VIEW-6`) end.
- **FX-6** **[Post-MVP]** The heartbeat also plays while the local player has a Legendary or Mythic warrior selected to attack (`VIEW-4`), only for that player: the selection is not in the contract and the other players do not see it. It starts when the warrior is selected and ends with the selection; if the attack follows, it goes on without restarting into the heartbeat of `FX-5`. Decided by the product owner on 2026-11-17.

## Card border glow

- **FX-7** **[Post-MVP]** Glowing border: a card of a rarity that has this effect shows a light around its frame while it is on the board and in the hand. The color and the strength depend on the rarity.
- **FX-8** **[Post-MVP]** The glow grows briefly when the card attacks or is hit, and goes back to its level afterwards. It does not hide the statistics of the card (`VIEW-2`).
- **FX-9** **[Post-MVP]** Only Epic, Legendary and Mythic warriors glow, stronger the rarer they are. Common, Uncommon and Rare warriors do not glow. Decided by the product owner on 2026-11-17.
- **FX-16** **[Post-MVP]** Only warriors have a rarity (`CARD-4`). A piece of equipment attached to a warrior plays the effects of the rarity of that warrior; in the hand, with no warrior, it has none. Leaders have no effects of rarity: their gold frame (`VIEW-20`) already marks them. The audio follows the same rule (`VIEW-22`). Decided by the product owner on 2026-11-17.

## Battlefield effects

- **FX-23** **[Post-MVP]** An effect of the battlefield is drawn behind the table, over what is seen around it, or over the table, and always under the zones, so the zones, the slots and the cards are always seen over it. Each effect says which of the two places it takes. An effect behind the table is under the darkening of the accessible mode (`VIEW-45`), as the surroundings of the table are. It does not change the skin of the battlefield (`FX-15`): when it ends, the battlefield shows its skin. It starts with the animation of the event that triggers it (`CON-12`) but does not hold the queue: the next events play while it lasts. A new effect of the battlefield while another plays replaces it: the one playing ends at once and the new one starts, so two are never seen over each other. Decided by the product owner on 2026-11-22.
- **FX-24** **[Post-MVP]** When a Legendary warrior is put on the board (`PLAYER_PUT_CARD`), the background of the battlefield changes for some seconds, for every player. It is an action effect (`FX-2`) and follows `FX-23`. **[OPEN]** What the change is, a color, an image or a scene, whether it is behind the table or over it, and how many seconds it lasts. Proposed by the product owner on 2026-11-22.

## Interface skins

- **FX-10** **[Post-MVP]** A skin changes the look of one element of the interface, without changing its layout or behavior. There is no skin of the whole interface: each element has skins of its own. The elements with skins are two:
  - The HUD of `VIEW-62`, all of it: the colors, fonts and frames of its parts, and the look of its buttons under the pointer. Also the result (`VIEW-23`), which is not part of the HUD but is drawn by Phaser with the same pieces (`FX-17`).
  - The battlefield: the surface under the zones, the slots and the cards, and what is seen around it. It can be any surface, such as a table, a floor or a map, and it does not change the zones, the slots or the cards.

  The marks of the board follow the skin of the HUD keeping what the legend of the help panel (`VIEW-58`) says of each one: where it is drawn, what it marks, its second signal (`VIEW-39`) and the color the legend names. A skin changes how a mark is drawn, that is the shade of its color, the thickness and the shape of its frame and its texture, and never which mark it is, so the legend, drawn with the default look, tells every mark with any skin.

  **[OPEN]** Whether the cards, the icons of the statistics and the icons of the slots (`slot.warrior` and `slot.leader` of `CON-30`, which are not marks of `VIEW-58`) become elements with skins of their own.

  **[OPEN]** Whether the loading screen (`VIEW-29`) follows the skin of the HUD: only if Phaser draws it, which the pending task about `GameLoad.ts` of `docs/roadmap/roadmap.md` finds out.

  Nothing drawn by Vue has a skin: the notices of the session and the connection (`UI-9`, `UI-10`, `UI-24`), the main menu and the party, the game menu, the settings screen and the help panel (`UI-33`, `UI-34`, `UI-36`) look the same with every skin. The button that opens the menu is drawn by Phaser and is a button of the HUD like the others, so it follows the skin. A skin does not change the animations, the sounds or the effects (`FX-22`): the colors of a button under the pointer are of the skin, and its transition (`VIEW-30`) is not. Decided by the product owner on 2026-11-22.
- **FX-17** **[Post-MVP]** A skin of the HUD defines a set of base pieces, and every part of the HUD of `FX-10` is drawn with them, so a part added later takes the look of every skin without changing them:
  - Two panels: the one of the HUD, and the one of the notices and the result.
  - Three buttons, each one with its look under the pointer: the primary action, the destructive action and the neutral one.
  - The four levels of text of the interface: title, body, label and numbers (Phase 11.5 of `docs/roadmap/roadmap.md`).
  - The accent colors: the turn of the local player, positive, negative and disabled.
  - The marks of the board, one piece for each mark of the legend of `VIEW-58`, inside the limits of `FX-10`.
- **FX-11** **[Post-MVP]** Each element has its own catalog of skins, each one with a name. A skin replaces the look of its element as a whole. What it does not define of its element falls back to the default look of that element, so a skin can change a single thing.
- **FX-12** **[Post-MVP]** The player chooses one skin for each element in the settings screen, each one on its own: any skin of the HUD goes with any skin of the battlefield. An element without a skin chosen keeps its default look. The choices are a preference of that player only, the other players do not see them, and they are not part of the game state or of the contract with the backend.
- **FX-13** **[Post-MVP]** The effects of this file follow the settings of `UI-27`: being non-essential, they do not happen with low quality (`UI-28`) or with reduced motion (`UI-29`). Without them the game must be fully readable: no information is carried only by an effect of this file.
- **FX-14** **[Post-MVP]** Only developers add skins, in the repository, as a change reviewed like any other. The players choose among the skins of the game (`FX-12`) and cannot load their own. A skin does not replace the audio. Decided by the product owner on 2026-11-18.
- **FX-15** **[Post-MVP]** A skin only changes the base look. It does not change the effects of `FX-7` and `FX-4`, which follow the rarity of the card and the settings of `UI-27`. Decided by the product owner on 2026-11-18.
- **FX-18** **[Post-MVP]** A skin is described by data: the value of every piece of `FX-17` (colors, alphas, sizes, fonts, frames and the look of the buttons under the pointer) is written in the skin itself, not in a list shared by all the skins. A piece whose shape data cannot describe, such as cut corners or a double border, may also carry the code that draws it. That code is only added by developers (`FX-14`), receives the same inputs as a piece made of data, and draws only inside the area it receives, so it does not change the layout (`FX-10`). Decided by the product owner on 2026-11-18. On 2026-11-22 the product owner decided that nothing drawn by Vue takes a value of the skin (`FX-10`).
- **FX-19** **[Post-MVP]** Adding a skin adds its own files and lists it in the catalog of its element (`FX-11`). No other file of the game changes: the colors of a skin are not added to a list shared with the other skins. Every catalog has the default skin of its element, which is the look of `docs/specs/ui/readme.md`, and every skin has a name, shown in the settings screen.
- **FX-20** **[Post-MVP]** Every skin keeps the readability of the interface: the minimum contrasts and the minimum text size that Phase 11.1 writes in new `VIEW` rules apply to the texts of every skin of the HUD, and to the marks of the board (`VIEW-4`, `VIEW-11`, `VIEW-17`, `VIEW-20`, `VIEW-27`, `VIEW-32`) of every skin of the HUD over every skin of the battlefield. A skin that does not keep them is not added to the catalog.
- **FX-21** **[Post-MVP]** A skin that cannot be used, because a resource of it fails to load or a value is missing, does not stop the game: its element shows the default look (`FX-19`) and the other element keeps its own skin (`FX-12`). If only some resources are missing, `FX-11` applies.

## Scenarios

**Heartbeat on a rare attack** **[Post-MVP]**
- Given a card of a rarity that has the heartbeat
- When `PLAYER_ATTACK_CARD` arrives with that card as the attacker
- Then the screen dims with the pulse until the attack animation ends, and then goes back to normal

**Effects turned off** **[Post-MVP]**
- Given a player who turned off the action effects
- When a card of a rarity that has the heartbeat attacks
- Then the attack animation and the changes of the statistics are shown, and the heartbeat is not

**Skin with missing resources** **[Post-MVP]**
- Given a skin of the battlefield that only defines its surface
- When the player selects it
- Then the battlefield shows that surface and the rest of the battlefield keeps its default look, and the HUD keeps the skin chosen for it

**A skin that fails to load** **[Post-MVP]**
- Given a skin of the HUD with a resource that fails to load
- When the game starts with that skin chosen
- Then the HUD shows the default look, the game goes on, and the battlefield keeps the skin chosen for it

**A skin added by a developer** **[Post-MVP]**
- Given a developer who adds a skin of the battlefield with its own files and lists it in the catalog
- When the game is built
- Then the skin can be chosen in the settings screen, and no other file of the game has changed

**A HUD and a battlefield chosen apart** **[Post-MVP]**
- Given a player who chose a skin for the battlefield and a skin for the HUD that were made apart
- When a game starts
- Then the battlefield shows its skin and the HUD its own, together
