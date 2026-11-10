# Post-MVP

Part of the design, not built in the MVP. Rules for other sections are marked **[Post-MVP]** in place.

## Teams

- **TEAM-1** Two players belong to the same team either from the game configuration or through a spell.
- **TEAM-2** When a member of a team wins, all allies win, living or dead.
- **TEAM-3** The game ends when only one team is left alive.

Still to be specified: friendly fire, valid targets among allies and their exposure in the contract.

## Spells

- **SPELL-1** A spell has varied effects, good or harmful, and may change the rules of the game.
- **SPELL-2** A spell marked as automatic (an `R` in its description, in `docs/Requirements.md`) is cast when played, with no intervention of the player. Who it affects depends on each spell.
- **SPELL-3** A spell can force the caster into an alliance with another player.
- **SPELL-4** Using a card and casting a spell are exposed in the public API.
- **SPELL-5** A spell can leave no leader alive, and then the game ends in a tie.

Still to be specified: how a spell is marked as automatic (`SPELL-2`), since the description travels as a translation key (`CARD-7`) and its text cannot carry the mark; abilities, which `COMBAT-8` mentions but no rule defines, and what distinguishes each rarity beyond the deal schedule, `COMBAT-5`, its audio variants (`VIEW-21`), its effects (`FX-1`, `FX-7`, `FX-16`) and its back (`CON-13`).

## Variants

- **VAR-1** Trolling cards show a circle next to health and damage. Green: a normal card. Red: the card moves to the center of the table and only attacks its owner.
- **VAR-2** Combat log.
- **VAR-3** A deck is uploaded to the backend as a zip with its cards (`DECK-1`). The backend hosts its files and lists them in the manifest of the games that use it (`CON-28`). This is why the backend hosts the resources and the manifest depends on the game.

Still to be specified for `VAR-3`: who uploads a deck, the format of the zip, its validation and its lifetime.

## AI

See `ROADMAP.md`, Phase 14.
