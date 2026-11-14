# Combat: hit

What every player sees when an attack is applied (`PLAYER_ATTACK_CARD`). Only the target receives damage (`COMBAT-1`), and it loses armor or health, never both (`COMBAT-4`, `CON-21`). The durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-5** When an attack is applied, the attacker hits the target:
  - **Lunge.** The attacker travels in a straight line from its slot towards the center of the target, and stops when it touches the target, in 250 ms, speeding up until it stops (`VIEW-31`). That moment is the impact. Then it travels back to its slot in 250 ms, slowing down at the end. It keeps the look it has in its slot during the trip, and is drawn above every other card of the board. If it was lifted (`VIEW-4`), it travels lifted and comes back at its rest size, without a separate lowering.
  - **Impact.** At the impact, at the same time:
    - The target shakes: it moves horizontally on the screen, from side to side, three times in 250 ms, with an amplitude that goes down from 6 px to 0, and ends exactly where it was. Only the card moves, not its slot nor the camera. If it was lifted (`VIEW-4`), it goes back to its rest size at once.
    - The target flashes: it is tinted at once and goes back to its normal look in 150 ms. Red if it lost health, steel grey if it lost armor. Without a flash if it lost neither.
    - The attacker starts its trip back.
    - The changes of the values (`VIEW-6`) and, if the target died, its death (`VIEW-7`) start.
  - The camera does not move.
  - **Effects** (`UI-26`). The lunge is essential: it shows who attacked whom, also to the players who did not choose the attack. The shake and the flash are non-essential: what the target lost is shown by `VIEW-6`.

## Scenarios

**Hit on armor**
- Given a target with 2 physical armor and 5 health
- When an attack takes its 2 armor
- Then the attacker lunges, and at the impact the target shakes and flashes steel grey

**Hit that takes nothing**
- Given an attack whose `armorDamage` and `healthDamage` are 0
- When it is applied
- Then the attacker lunges and the target shakes, without a flash

**Attack between two rivals**
- Given a game of 6 players
- When a rival attacks the card of another rival
- Then the local player sees the attacker travel to the target and back
