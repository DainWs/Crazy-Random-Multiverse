# Visual effects

Effects and skins that go beyond the base appearance of `VIEW-SPECS.md`. Proposals of skins, as reference material and not as rules, are in `docs/skins/`. Everything here is **[Post-MVP]**: the MVP only has the effects of `VIEW-SPECS.md`, such as the attack (`VIEW-4`), the combat feedback (`VIEW-5` to `VIEW-7`), the veil of an eliminated zone (`VIEW-11`), the placement of the leaders (`VIEW-12`), the turn notices (`VIEW-15`) and the glow of the leader (`VIEW-20`). The effects are drawn by the frontend from confirmed events and never change the game state (`ARCH-2`).

- **FX-1** **[Post-MVP]** The effects grow with the rarity of the card, in the same way as its audio variants (`VIEW-21`): the rarer the card, the more and the stronger the effects it plays.
- **FX-2** **[Post-MVP]** An effect belongs to one of three groups. Every effect of this file is non-essential (`UI-26`):
  - *Card effects*: they stay on the card while it is on the board or in the hand (`FX-7`).
  - *Action effects*: they play once when an action happens (`FX-4`, `FX-8`).
  - *Interface effects*: they belong to the interface, not to a card. None is specified yet.

  A skin (`FX-10`) is not an effect: turning the effects off (`FX-13`) does not change the skin.
- **FX-3** **[Post-MVP]** An effect is described by data (rarity it applies to, trigger, duration, intensity), not by a branch in the code of each card. A new effect is added without changing the cards.

## Heartbeat

- **FX-4** **[Post-MVP]** Heartbeat: the screen dims with a slow pulse, darker towards the edges, while something important is going on. It is a pulse of the dimming, not of the cards.
- **FX-5** **[Post-MVP]** The heartbeat plays when a card of a rarity that has this effect attacks. It starts with the `PLAYER_ATTACK_CARD` event, not with the click of the player, and ends when the animations of the attack (`VIEW-5`, `VIEW-6`) end.
- **FX-6** **[OPEN]** Whether the heartbeat is also used while choosing a target (the old targeting overlay), for the attacker only or for everyone, and from which rarity it applies.

## Card border glow

- **FX-7** **[Post-MVP]** Glowing border: a card of a rarity that has this effect shows a light around its frame while it is on the board and in the hand. The color and the strength depend on the rarity.
- **FX-8** **[Post-MVP]** The glow grows briefly when the card attacks or is hit, and goes back to its level afterwards. It does not hide the statistics of the card (`VIEW-2`).
- **FX-9** **[OPEN]** Which rarities glow and how: only Rare and above, or every rarity with a different strength.
- **FX-16** **[OPEN]** Which effects leaders and equipment have: `FX-1` and `FX-7` depend on the rarity, and only warriors have one (`CARD-4`). It is the same question as `VIEW-22` for the audio.

## Interface skins

- **FX-10** **[Post-MVP]** A skin changes the look of one element of the interface, without changing its layout or behavior. There is no skin of the whole interface: each element has skins of its own. The elements with skins are two:
  - The HUD (`UI-3`, `VIEW-28`): the turn panel, the buttons and the confirmation dialog, with their colors, fonts, frames and the reaction of the buttons under the pointer.
  - The battlefield: the surface under the zones, the slots and the cards, and what is seen around it. It can be any surface, such as a table, a floor or a map, and it does not change the zones, the slots or the cards.

  **[OPEN]** Whether the cards, the icons of the statistics and the mark of the slots (`CON-30`) become elements with skins of their own.
- **FX-11** **[Post-MVP]** Each element has its own catalog of skins, each one with a name. A skin replaces the look of its element as a whole. What it does not define of its element falls back to the default look of that element, so a skin can change a single thing.
- **FX-12** **[Post-MVP]** The player chooses one skin for each element in the settings screen, each one on its own: any skin of the HUD goes with any skin of the battlefield. An element without a skin chosen keeps its default look. The choices are a preference of that player only, the other players do not see them, and they are not part of the game state or of the contract with the backend.
- **FX-13** **[Post-MVP]** The effects of this file follow the settings of `UI-27`: being non-essential, they do not happen with low quality (`UI-28`) or with reduced motion (`UI-29`). Without them the game must be fully readable: no information is carried only by an effect of this file.
- **FX-14** **[OPEN]** Whether the skins are part of the game or can be added by the players, and whether a skin may replace the audio.
- **FX-15** **[OPEN]** Whether a skin may also change the effects of `FX-7` and `FX-4` or only the base look.

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

**A HUD and a battlefield chosen apart** **[Post-MVP]**
- Given a player who chose a skin for the battlefield and a skin for the HUD that were made apart
- When a game starts
- Then the battlefield shows its skin and the HUD its own, together
