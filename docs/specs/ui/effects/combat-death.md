# Combat: death

What every player sees when an attack kills its target (`targetDead`, `CON-21`, `COMBAT-7`). The death of a card and the death of a leader are two tiers above the hit (`VIEW-5`). The durations and curves are in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14.

- **VIEW-7** The death starts at the impact of `VIEW-5`, while the hit and the values (`VIEW-6`) play as they say:
  - **Card.** When the shake of `VIEW-5` ends, 250 ms after the impact, the card shrinks towards its center until it disappears while it fades out, in 400 ms, speeding up (`VIEW-31`). It ends 650 ms after the impact, together with the floating text of `VIEW-6`.
  - **Leader.**
    - **Freeze.** At the impact, every animation of `VIEW-5`, `VIEW-6` and `VIEW-7` stops for 150 ms, with the flash of `VIEW-5` on the leader, and then goes on from where it stopped. The pulses of `VIEW-17` and `VIEW-20` do not stop.
    - When the shake of `VIEW-5` ends, the leader is tinted at once a dark grey, darker than the steel grey of `VIEW-5`, and stays still for 400 ms. Then it shrinks towards its center until it disappears while it fades out, in 400 ms, speeding up. It ends 1200 ms after the impact. The exact dark grey is chosen with the colors of Phase 11.5.
    - The camera does not move.
  - **Effects** (`UI-26`). The death of a card and the death of a leader are essential: they show that the card left the board. The freeze is non-essential. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.
- **VIEW-18** The equipment of a combatant is part of its card (`VIEW-65`): when the card dies (`EQUIP-8`), the equipment stacked behind it shrinks and fades out together with it, as one, and has no animation of its own. The board drawn afterwards has neither.
- **VIEW-33** Gameplay stays disabled until the last animation of an attack ends (`UI-4`). From the moment its event is applied, an attack lasts:
  - Without a death: 900 ms, 250 ms of the lunge and 650 ms of the floating text of `VIEW-6`.
  - With the death of a card: 900 ms, because the death ends together with the floating text.
  - With the death of a leader: 1450 ms, 250 ms of the lunge and 1200 ms of the death, freeze included.

## Scenarios

**Death of a card with equipment**
- Given a warrior with 1 health and a piece of equipment
- When an attack takes its last health
- Then it shakes, and then the warrior and its equipment shrink and fade out together, 650 ms after the impact

**Death of a leader**
- Given a leader with 1 health
- When an attack takes its last health
- Then everything stops for 150 ms at the impact, the leader shakes, turns dark grey, stays still for 400 ms and then shrinks and fades out, and gameplay is enabled again 1450 ms after the event is applied

**A card that survives**
- Given a warrior with 5 health
- When an attack takes 2 health
- Then it does not shrink, and gameplay is enabled again 900 ms after the event is applied
