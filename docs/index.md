# INDEX

The only index of the documentation: where each thing is, when to read it and who writes it, every file of the specification with the rules it holds, and every idea with its status. Every path is written from the root of the repository (`docs/specs/contract.md`), so it can be searched and opened as it is. A file that is added, moved, split or removed changes its row in the same commit.

## Find it by question

| Question | Where |
|---|---|
| What does the game do? | `docs/specs/` — its files are in [Specification](#specification) |
| Where is the rule `COMBAT-3`, or any other? | [Specification](#specification): the file of each prefix and of each `VIEW` rule |
| How does the interface look, move or sound? | `docs/specs/ui/` — its files are in [Appearance](#appearance-docsspecsui) |
| What do the backend and the frontend exchange? | `docs/specs/contract.md` |
| What is being built now, and what is left? | `docs/roadmap/roadmap.md` |
| What was decided and cannot change without asking? | `docs/roadmap/decisions.md` |
| What is left to test, or to check by hand? | `docs/roadmap/roadmap-test.md` |
| When and how was a closed phase done? | `docs/roadmap/roadmap-archive.md` |
| What could the game do, not planned yet? | [Ideas](#ideas), and how an idea changes status in `docs/ideas/readme.md` |
| What can never be broken in the code? | `docs/constitution.md` |
| Which system of the frontend creates each part of the interface? | `.claude/skills/frontend-conventions/SKILL.md`, section 11 |
| How is the code written and tested? | The skill of the application: `.claude/skills/backend-conventions/SKILL.md` or `.claude/skills/frontend-conventions/SKILL.md`, and the tests file next to it |
| Something in the Phaser view looks or behaves wrong | `docs/guides/phaser4-troubleshooting.md` |
| How is the domain modeled? | `docs/diagrams/` (PlantUML) |
| What were the skins proposed? | `docs/skins/` — reference material, not rules |
| What was the game first asked to be? | `docs/requirements.md` — background, replaced by `docs/specs/` |

## Folders

| Folder | Content | Written |
|---|---|---|
| `docs/specs/` | The rules of behavior, with their identifiers (`COMBAT-3`). The source of truth | Before the code, with the product owner |
| `docs/specs/ui/` | The `VIEW` rules: `components/`, `effects/`, and in its root the shared bases and a `readme.md` with the rules not moved yet | Before the code, with the product owner |
| `docs/roadmap/` | The phases, the pending tasks, the closed decisions, the test phases and the archive | By each phase, in the commits of its work |
| `docs/ideas/` | One file per proposal, with its status (`idea`, `accepted`, `discarded`, `done`) | With `/add-idea`; its status, when it changes |
| `docs/guides/` | Known effects of Phaser 4 on the view (`docs/guides/phaser4-troubleshooting.md`) | When one is found |
| `.claude/skills/backend-conventions/` | The conventions of the code of `backend/` in `SKILL.md`, and of its tests in `backend-tests.md`. Mandatory, under `docs/constitution.md` | When a convention changes |
| `.claude/skills/frontend-conventions/` | The conventions of the code of `frontend/` in `SKILL.md`, and of its tests in `frontend-tests.md`. Mandatory, under `docs/constitution.md` | When a convention changes |
| `docs/diagrams/` | Domain model, class diagrams and use cases | Only when the user allows it |
| `docs/skins/` | Skin proposals with their captures and prototype code | By hand |

## Order of truth

When two documents disagree, `docs/specs/` wins on behavior, `docs/constitution.md` on how the code is built, and `docs/roadmap/decisions.md` over the roadmap. The constitution wins over the skills of conventions, and between the conventions and the existing code its golden rule decides (`docs/constitution.md`, section 1). An idea never wins: until its rules are in `docs/specs/`, it is only a proposal.

## Specification

A rule is cited by its identifier (`docs/specs/readme.md`, Conventions), and this section says which file holds it.

### Behavior and scope

| File | Content | Prefixes |
|---|---|---|
| `docs/specs/readme.md` | Conventions, architecture constraints, MVP scope and non-functional requirements | `ARCH`, `SCOPE`, `NFR` |
| `docs/specs/contract.md` | Backend ↔ frontend contract and its catalogs | `CON` |
| `docs/specs/game-flow.md` | Setup, turns, rounds, deck and hand | `SETUP`, `TURN`, `ROUND`, `DECK`, `HAND` |
| `docs/specs/board.md` | Zones, placement, movement and protection | `BOARD`, `PROT` |
| `docs/specs/cards.md` | Card types, statistics, equipment and base content | `CARD`, `EQUIP` |
| `docs/specs/combat.md` | Damage resolution | `COMBAT` |
| `docs/specs/game-end.md` | Elimination, absence, winning and spectators | `ELIM`, `ABSENT`, `WIN`, `SPEC` |
| `docs/specs/lobby.md` | Users, parties and game loading | `USER`, `PARTY`, `LOAD` |
| `docs/specs/interface.md` | Interface behavior | `UI` |
| `docs/specs/visual-effects.md` | Effects by rarity (heartbeat, border glow) and interface skins, all Post-MVP or open | `FX` |
| `docs/specs/post-mvp.md` | Teams, spells and variants | `TEAM`, `SPELL`, `VAR` |

### Appearance: `docs/specs/ui/`

The `VIEW` rules: what is seen, never how it is built. Separate from the behavior of `docs/specs/interface.md`.

| Folder | What goes in it | Files |
|---|---|---|
| `docs/specs/ui/components/` | Each piece of the screen: what it looks like, where it is and how it is laid out | `category-piece.md`: `hud-menu.md` |
| `docs/specs/ui/effects/` | What happens after an action of the player or an event of the game: animations, and marks that come and go | `category-effect.md`: `combat-hit.md` |
| `docs/specs/ui/` | The bases shared by components and effects, and in `readme.md` the rules not moved yet to a file of their own | The name of the base: `palette.md` |

- **Components cite their effects; effects do not cite components.** Every file of `components/` ends with an `Effects` section that lists, with their paths, the effects its piece plays, or says there are none. An effect names what it acts on by the identifier of its rule (`VIEW-14`), never by the file of a component, so the same effect can be played by several components.
- A rule about how a piece changes when something happens goes in `effects/`, and its component lists it. A component whose animations are still part of its own rules says so in its `Effects` section, until they are split.
- The rules of `docs/specs/ui/readme.md` move to the folder of their kind as they are reviewed, keeping their identifiers.

#### Bases

| File | Content | Rules |
|---|---|---|
| `docs/specs/ui/readme.md` | Rules not moved yet: what the HUD is (`VIEW-62`), and the Post-MVP card backs, sounds and effects (`VIEW-3`, `VIEW-9`, `VIEW-10`, `VIEW-21`, `VIEW-22`) | listed in the content |
| `docs/specs/ui/motion-base.md` | The shared durations and curves of the animations | `VIEW-30`, `VIEW-31` |
| `docs/specs/ui/palette.md` | The colors of the interface and their meanings | `VIEW-52` |
| `docs/specs/ui/typography.md` | The typefaces and the four sizes of the texts | `VIEW-54`, `VIEW-55` |
| `docs/specs/ui/contrast-minimums.md` | The minimum contrasts of the texts and of the marks | `VIEW-40` |
| `docs/specs/ui/text-minimum-size.md` | The minimum size of the texts | `VIEW-41` |
| `docs/specs/ui/marks-pairs.md` | What is drawn when two marks are on the same slot | `VIEW-53` |
| `docs/specs/ui/marks-second-signal.md` | The second signal of the marks told apart only by color | `VIEW-39` |
| `docs/specs/ui/draw-order.md` | What is drawn over what, from the panels of Vue to the surroundings of the table | `VIEW-68` |

#### Components

| File | Content | Rules |
|---|---|---|
| `docs/specs/ui/components/board.md` | The layout of the board, the rivals around the table, zoom and pan, window sizes, the tint of the own zone, the grid and the background | `VIEW-1`, `VIEW-2`, `VIEW-13`, `VIEW-19`, `VIEW-24`, `VIEW-26`, `VIEW-27`, `VIEW-45` |
| `docs/specs/ui/components/camera-view.md` | The two cameras of the board, top-down and tilted | `VIEW-57` |
| `docs/specs/ui/components/cards-side-panel.md` | The side panel of the card under the pointer, and the line of an own card that can attack | `VIEW-14`, `VIEW-59` |
| `docs/specs/ui/components/game-loading.md` | The loading screen and its change to the board | `VIEW-29` |
| `docs/specs/ui/components/game-notices.md` | The turn and round notices | `VIEW-15` |
| `docs/specs/ui/components/game-result.md` | The result of the game | `VIEW-23` |
| `docs/specs/ui/components/hand.md` | The layout of the hand and its place at rest | `VIEW-16`, `VIEW-25` |
| `docs/specs/ui/components/hud-buttons.md` | The buttons of the HUD and of the confirmation dialog, the label of a spectator, and the panel of the round and the turn | `VIEW-28`, `VIEW-42`, `VIEW-43`, `VIEW-44`, `VIEW-61` |
| `docs/specs/ui/components/hud-help.md` | The help panel, with the legend of the marks of the board and the summary of the rules | `VIEW-58` |
| `docs/specs/ui/components/hud-menu.md` | The menu button and the menu of the game screen | `VIEW-60` |
| `docs/specs/ui/components/zones-labels.md` | The name of each zone, the health bar of its leader and the mark of who plays next | `VIEW-49` to `VIEW-51` |

#### Effects

| File | Content | Rules |
|---|---|---|
| `docs/specs/ui/effects/cards-actionable.md` | How an own card that can attack now reacts to the pointer | `VIEW-37` |
| `docs/specs/ui/effects/cards-drag.md` | The drag of a card, its marks and the dropped card while the server answers | `VIEW-32`, `VIEW-34` |
| `docs/specs/ui/effects/cards-equip.md` | The equipment attached to a card | `VIEW-36` |
| `docs/specs/ui/effects/cards-hover.md` | The enlargement of a card under the pointer, the side panel in and out, and the equipment sliding out | `VIEW-63`, `VIEW-64`, `VIEW-65` |
| `docs/specs/ui/effects/cards-settle.md` | A card that settles in a slot from an event | `VIEW-35` |
| `docs/specs/ui/effects/combat-attack.md` | The choice of an attacker and its target | `VIEW-4` |
| `docs/specs/ui/effects/combat-death.md` | The death of a card and of a leader, the equipment that dies with its card and the total duration of an attack | `VIEW-7`, `VIEW-18`, `VIEW-33` |
| `docs/specs/ui/effects/combat-hit.md` | The hit | `VIEW-5` |
| `docs/specs/ui/effects/combat-values.md` | The count of the values and the floating text | `VIEW-6` |
| `docs/specs/ui/effects/game-elimination.md` | The zone of an eliminated player and its notice | `VIEW-11` |
| `docs/specs/ui/effects/game-placement.md` | The placement of the leaders at the start | `VIEW-12` |
| `docs/specs/ui/effects/game-pulses.md` | The frame of the leader with the turn, the frame of an own card that can attack and the pulse of the end turn button | `VIEW-17`, `VIEW-20`, `VIEW-38` |
| `docs/specs/ui/effects/hand-arrival.md` | The arrival of a card in the hand | `VIEW-8` |
| `docs/specs/ui/effects/hand-motion.md` | The hand rising, folding and sliding its cards aside, and its cards moving to their new slots | `VIEW-66`, `VIEW-67` |

## Ideas

Proposals not planned yet, one file each in `docs/ideas/`. How an idea changes status is in `docs/ideas/readme.md`.

| Id | Idea | Status | Rules | Phase |
|---|---|---|---|---|
| `IDEA-001` | [Top-down camera](ideas/001-top-down-camera.md) | done | `VIEW-57`, `UI-33` | 11.7 |
| `IDEA-002` | [Health bar on the card](ideas/002-health-bar-on-card.md) | accepted | — | — |
| `IDEA-003` | [Bar only when wounded](ideas/003-bar-only-when-wounded.md) | accepted | — | — |
| `IDEA-004` | [Numbers on the card](ideas/004-numbers-on-card.md) | accepted | — | — |
| `IDEA-005` | [Key of the values](ideas/005-key-of-the-values.md) | accepted | — | — |
| `IDEA-006` | [Health after the hit](ideas/006-health-after-the-hit.md) | accepted | — | — |
| `IDEA-007` | [Dim the rest while attacking](ideas/007-dim-the-rest-while-attacking.md) | accepted | `VIEW-4`, `UI-33` | Pending tasks |
