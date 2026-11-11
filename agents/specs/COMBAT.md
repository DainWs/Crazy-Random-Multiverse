# Combat

- **COMBAT-1** Damage goes only from the attacker to the target. The target does not hit back.
- **COMBAT-2** Physical damage hits physical armor if the target has any left, and health otherwise. It ignores magic armor.
- **COMBAT-3** Magic damage hits magic armor if the target has any left, and health otherwise. It ignores physical armor.
- **COMBAT-4** When armor breaks, the excess damage is discarded: an attack hits armor or health, never both.
- **COMBAT-5** **[Post-MVP]** Exception: damage from Legendary cards that exceeds armor, of any type, carries over to health. **[OPEN]** Whether "of any type" refers to the damage or to the armor.
- **COMBAT-6** Lost health and armor persist between turns and do not recover. The exception is equipment: when the limits of `EQUIP-5` stop current health at 1 or armor at 0, what they saved no longer counts as lost (`EQUIP-6`), so a later bonus gives it back, and a penalty followed by a bonus of the same value can restore health or armor. The base content has no equipment with negative values (`CARD-5`), so it cannot happen yet.
- **COMBAT-7** Health does not drop below 0, and reaching 0 kills the card. A dead card is removed from the board by the server, and the frontend shows its death after the event. If it is a leader, see `ELIM-1`.
- **COMBAT-8** **[Post-MVP]** True damage ignores armor, abilities and spells.
- **COMBAT-9** **[Post-MVP]** Infinite damage ignores infinite health and armor.
- **COMBAT-10** **[Post-MVP]** When a card reaches 100 physical damage, excess damage dealt to armor carries over to health. **[OPEN]** Whether "reaches 100 physical damage" means a damage statistic of 100 or more, or 100 damage dealt in total, and whether magic damage has an equivalent.
- **COMBAT-11** A player attacks only with their own cards on the board.
- **COMBAT-12** The target is a card of another player. An attack on one's own card or on an empty slot is rejected.

## Scenarios

**Excess is discarded**
- Given a target with 2 physical armor and 5 health
- When it receives 4 physical damage from a non-Legendary card
- Then it has 0 armor and 5 health

**Broken armor**
- Given a target with 0 physical armor and 5 health
- When it receives 4 physical damage
- Then it has 0 armor and 1 health

**Excess from a Legendary card** **[Post-MVP]**
- Given a target with 2 physical armor and 5 health
- When it receives 4 physical damage from a Legendary card
- Then it has 0 armor and 3 health

**Armor of another type**
- Given a target with 2 magic armor and 5 health
- When it receives 4 physical damage
- Then it has 2 magic armor and 1 health

**Damage persists**
- Given a target that lost 3 health and all its armor in a previous turn
- When a new turn or round starts
- Then its health and armor are unchanged
