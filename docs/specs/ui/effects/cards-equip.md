# Cards: equip

What every player sees when a piece of equipment is attached to a combatant (`PLAYER_EQUIP_CARD`, `EQUIP-3`), so that the rivals see which equipment it is and what it changed without hovering the card. The equipment stacked behind its card is in `docs/specs/ui/effects/cards-hover.md` (`VIEW-14`), and the durations and curves in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-14.

- **VIEW-36** When the event of an equipment is applied, own or rival, at the same time:
  - **The card.** The equipped combatant plays the settle of `VIEW-35`: it appears at once at 106% of its size and settles at exactly its size in 250 ms.
  - **The equipment.** The new piece of equipment slides out from behind the card to the place it takes under the pointer (`VIEW-14`), in 250 ms, slowing down at the end. It stays there for 400 ms, and then slides back behind the card in 250 ms, slowing down at the end, as when the pointer leaves it. The other pieces of equipment of the card do not move.
  - **Values.** Each value of the card that the equipment changes, its damage, its physical armor, its magic armor or its health, counts from the old value to the new one as in `VIEW-6`, in 400 ms, slowing down at the end. The new value is the one the card shows, with the limits of `EQUIP-5`.
  - **Floating text.** Each value that changes gets a floating text with the change and the icon of that value: a sword for the damage, and the heart and the two shields of `VIEW-6`. A value that goes up shows "+N" in green and one that goes down "−N" in red, the text and the icon, as the values of the side panel (`VIEW-14`). The size, the outline, the place and the motion are those of `VIEW-6`, and with several texts they are stacked one above the other without overlapping, from the bottom up: damage, physical armor, magic armor, health. A value that does not change gets no text, and an equipment that changes nothing shows none.
  - The whole equipment lasts 900 ms, and gameplay stays disabled until it ends (`UI-4`). It replaces, for an equipment, the settle that a placed or moved card plays alone. A card restored from `GAME_SYNC` does not play it (`VIEW-8`).
  - **Effects** (`UI-26`). The settle, the equipment sliding out and back, the count and the floating texts are essential: they show which card was equipped, with what, and what changed, also to the players who did not do it. **[Post-MVP]** They have no low quality version (`UI-28`), and their reduced motion version is the general one of `UI-29`.

## Scenarios

**A rival equips a card**
- Given a game of 4 players
- When a rival attaches to a warrior an equipment that adds 2 damage and 1 health
- Then the warrior settles from 106%, the equipment slides out from behind it, stays 400 ms and slides back, the damage and the health count up, and a green "+2" with a sword and, above it, a green "+1" with a heart rise from its top edge

**Own equipment**
- Given an own equipment dropped on a warrior and waiting for the server (`VIEW-34`)
- When its event is applied
- Then the local player sees the same as the rivals

**Gameplay waits**
- Given the event of an equipment applied
- When the animation plays
- Then gameplay is enabled again 900 ms after the event is applied
