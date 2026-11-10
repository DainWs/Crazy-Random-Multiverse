# Visual effects

Effects and skins that go beyond the base appearance of `VIEW-SPECS.md`. Everything here is **[Post-MVP]**: the MVP only has the effects of `VIEW-SPECS.md`, such as the attack arrow (`VIEW-4`), the combat feedback (`VIEW-5` to `VIEW-7`), the veil of an eliminated zone (`VIEW-11`), the placement of the leaders (`VIEW-12`), the turn notices (`VIEW-15`) and the glow of the leader (`VIEW-20`). The effects are drawn by the frontend from confirmed events and never change the game state (`ARCH-2`).

- **FX-1** **[Post-MVP]** The effects grow with the rarity of the card, in the same way as its audio variants (`VIEW-21`): the rarer the card, the more and the stronger the effects it plays.
- **FX-2** **[Post-MVP]** An effect belongs to one of three groups, so each one can be turned off or reduced on its own (`FX-13`):
  - *Card effects*: they stay on the card while it is on the board (`FX-7`).
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

## Interface skins

- **FX-10** **[Post-MVP]** A skin changes the look of the interface without changing its layout or behavior: colors, fonts, frames, the table background, the icons of the statistics and the mark of the slots (`VIEW-1`).
- **FX-11** **[Post-MVP]** A skin is a set of resources with a name, replaceable as a whole. The resources it does not define fall back to the default skin, so a skin can change a single thing.
- **FX-12** **[Post-MVP]** The player chooses their skin in the settings screen. It is a preference of that player only, the other players do not see it, and it is not part of the game state or of the contract with the backend.
- **FX-13** **[Post-MVP]** The settings can turn the effects off by group (`FX-2`) or reduce them, as part of the reduced motion and accessibility options (`VIEW-10`). Without effects the game must be fully readable: no information is carried only by an effect.
- **FX-14** **[OPEN]** Whether the skins are part of the game or can be added by the players, and whether a skin may replace the audio.
- **FX-15** **[OPEN]** Whether a skin may also change the effects of `FX-7` and `FX-4` or only the base look.

## Scenarios

**Heartbeat on a rare attack** **[Post-MVP]**
- Given a card of a rarity that has the heartbeat
- When `PLAYER_ATTACK_CARD` arrives with that card as the attacker
- Then the screen dims with the pulse until the attack animation ends, and then goes back to normal

**Effects turned off** **[Post-MVP]**
- Given a player who turned off the action effects
- When a rare card attacks
- Then the attack animation and the changes of the statistics are shown, and the heartbeat is not

**Skin with missing resources** **[Post-MVP]**
- Given a skin that only defines the table background
- When the player selects it
- Then the table shows its background and everything else uses the default skin
