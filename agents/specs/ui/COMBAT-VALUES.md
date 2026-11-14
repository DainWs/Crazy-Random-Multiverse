# Combat: values

What every player sees on the target when its armor or health changes with an attack (`PLAYER_ATTACK_CARD`). The target loses armor or health, never both, and the event carries what it actually lost (`COMBAT-4`, `CON-21`). The durations and curves are in `MOTION-BASE.md`. Decided with the product owner on 2026-11-14.

- **VIEW-6** At the impact of `VIEW-5`, at the same time:
  - **Count.** The value of the target that changed, its health, its physical armor or its magic armor (`COMBAT-2`, `COMBAT-3`), counts down on the card from the old value to the new one, showing each whole number between them, in 400 ms, slowing down at the end (`VIEW-31`). It ends exactly at the new value. A hit that takes nothing counts nothing.
  - **Floating text.** A text with what the target lost appears at once:
    - Health: "−N" and a heart icon, in red.
    - Physical armor: "−N" and a shield icon, in steel grey.
    - Magic armor: "−N" and a shield icon with a different shape from the physical one, in steel grey.
    - A hit that takes nothing (`armorDamage` and `healthDamage` are 0): "0" in white, without an icon.

    N is `healthDamage` or `armorDamage`. The red and the steel grey are those of the flash of `VIEW-5`. The text and the icon have a black outline, like the label of `VIEW-11`, and the icon is as tall as the text. The text is 40% as tall as the long side of the target as drawn on the screen, and never less than 24 px on the screen with the window at 1920 by 1080, scaled with the window as the camera (`VIEW-24`). It is drawn flat, without the perspective of the slot (`VIEW-1`), and above every card of the board. It appears centered horizontally on the target as drawn on the screen, with its bottom edge at the highest point of the target on the screen, whatever the rotation of its zone.
  - **Floating text, motion.** The text rises 40 px on the screen in 400 ms, slowing down at the end, and then fades out in 250 ms, speeding up (`VIEW-30`, `VIEW-31`). The 40 px are measured with the window at 1920 by 1080 and scale with the window as the size of the text. The whole text lasts 650 ms from the impact, and gameplay stays disabled until it ends (`UI-4`).
  - **Effects** (`UI-26`). The count and the floating text are essential: they show what the target lost, also when the values of the card are too small to read. **[OPEN] [Post-MVP]** Their versions for low quality (`UI-28`) and reduced motion (`UI-29`).

## Scenarios

**Hit on health**
- Given a target with 0 armor and 5 health
- When an attack takes 2 health
- Then its health counts 5, 4, 3 in 400 ms, and a red "−2" with a heart rises from its top edge and fades out

**Hit on magic armor**
- Given a target with 2 magic armor and 5 health
- When an attack takes its 2 magic armor
- Then its magic armor counts down to 0, and a steel grey "−2" with the shield of magic armor rises from its top edge

**Hit that takes nothing**
- Given an attack whose `armorDamage` and `healthDamage` are 0
- When it is applied
- Then no value counts, and a white "0" without an icon rises from the top edge of the target

**Small cards**
- Given a game of 10 players, with the window at 1920 by 1080 and the zoom at 1
- When a card is hit
- Then its floating text is at least 24 px tall on the screen
