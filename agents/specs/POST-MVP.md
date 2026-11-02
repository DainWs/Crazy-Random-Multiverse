# Post-MVP

Part of the design, not built in the MVP. Rules for other sections are marked **[Post-MVP]** in place.

## Teams

- **TEAM-1** Two players belong to the same team either from the game configuration or through a spell.
- **TEAM-2** When a member of a team wins, all allies win, living or dead.
- **TEAM-3** The game ends when only one team is left alive.

Still to be specified: friendly fire, valid targets among allies and their exposure in the contract.

## Spells

- **SPELL-1** A spell has varied effects, good or harmful, and may change the rules of the game.
- **SPELL-2** A spell whose description contains an `R` is cast automatically when played, with no intervention of the player. Who it affects depends on each spell.
- **SPELL-3** A spell can force the caster into an alliance with another player.
- **SPELL-4** Using a card and casting a spell are exposed in the public API.
- **SPELL-5** A spell can leave no leader alive, and then the game ends in a tie.

Still to be specified: abilities, which `COMBAT-8` mentions but no rule defines, and what distinguishes each rarity beyond the deal schedule and `COMBAT-5`.

## Variants

- **VAR-1** Trolling cards show a circle next to health and damage. Green: a normal card. Red: the card moves to the center of the table and only attacks its owner.
- **VAR-2** Combat log.

## AI

See `ROADMAP.md`, Phase 13.
