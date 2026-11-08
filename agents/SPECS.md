# SPECS

Functional specification of Crazy Random Multiverse. Source of truth for behavior. Derived from `docs/Requirements.md`, the previous frontend backlog and the decisions taken with the product owner.

## Conventions

- Every rule has an identifier (`COMBAT-3`). Tests and roadmap tasks refer to rules by that identifier.
- Identifiers are never reused. A removed rule leaves a gap in the numbering.
- Rules with a non-obvious outcome have scenarios in Given/When/Then form.
- **[OPEN]** marks something that must be resolved by a person before being implemented. Do not guess it.
- **[Post-MVP]** marks a rule that is part of the design but is not built in the MVP.

## Sections

| File | Content | Prefixes |
|---|---|---|
| `specs/CONTRACT.md` | Backend ↔ frontend contract and its catalogs | `CON` |
| `specs/GAME-FLOW.md` | Setup, turns, rounds, deck and hand | `SETUP`, `TURN`, `ROUND`, `DECK`, `HAND` |
| `specs/BOARD.md` | Zones, placement, movement and protection | `BOARD`, `PROT` |
| `specs/CARDS.md` | Card types, statistics, equipment and base content | `CARD`, `EQUIP` |
| `specs/COMBAT.md` | Damage resolution | `COMBAT` |
| `specs/GAME-END.md` | Elimination, absence, winning and spectators | `ELIM`, `ABSENT`, `WIN`, `SPEC` |
| `specs/LOBBY.md` | Users, parties and game loading | `USER`, `PARTY`, `LOAD` |
| `specs/INTERFACE.md` | Interface behavior | `UI` |
| `specs/VISUAL-EFFECTS.md` | Effects by rarity (heartbeat, border glow) and interface skins, all Post-MVP | `FX` |
| `specs/POST-MVP.md` | Teams, spells and variants | `TEAM`, `SPELL`, `VAR` |
| `VIEW-SPECS.md` | Interface appearance, separate from behavior | `VIEW` |

## Overview

A strategic showdown. Each player receives a random leader card, shown publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

## Architecture constraints

- **ARCH-1** The backend holds the only authoritative game state, in memory.
- **ARCH-2** The frontend is a view of that state. It sends commands and renders confirmed results; it never mutates game state before the server confirms.
- **ARCH-3** Commands use REST `POST /game/{gameCode}/action`. Updates use Socket.IO events. See `specs/CONTRACT.md`.

## MVP scope

- **SCOPE-1** The first playable version covers deal, placement, combat and victory or defeat, every player against every other.
- **SCOPE-2** The base content is at least one Leader, three Warrior types (Common, Uncommon, Rare) and basic equipment.
- **SCOPE-3** The only game mode is Classic. The party still shows a mode selector.
- **SCOPE-4** Out of the MVP, besides every rule marked **[Post-MVP]**: spells, abilities, teams, the AI, complex equipment effects, infinite stats, true damage, combat log, translations other than Spanish, spectators from outside the game, premium animations, cursor animations and sounds.
- **SCOPE-5** The AI is rethought around an LLM in its own phase (`ROADMAP.md`, Phase 14). Nothing about it is specified yet.

## Non-functional requirements

- **NFR-1** The MVP sets no numeric targets for capacity or latency until there are measurements.
- **NFR-2** All state is lost when the server restarts.
- **NFR-3** The session id is a credential and is never shared with other users. The id they see is a public one (`CON-24`).
