# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

## Closed decisions

| Decision | Choice |
|---|---|
| Realtime transport | Socket.IO (replaces STOMP) |
| Commands | REST `POST /game/{gameCode}/action` |
| Game state authority | Backend. The frontend never mutates state before server confirmation |
| Rejected requests | The HTTP response says it: 2xx or 400 with an `exception.*` key (`CON-18`). There is no socket channel for errors (`CON-20`) |

## Phase 1 — Backend contract (blockers)

Must be resolved by a person before the dependent frontend work. Do not invent it: ask.

- [x] Define the Socket.IO connection contract
- [x] Define Socket.IO event names
- [x] Define Socket.IO event payloads
- [x] Define how the player's hand is sent
- [x] Define card runtime state/effects
- [x] Define `targetable` state
- [x] Define `PROTECTED` state
- [x] Define attack-used/attack-available state
- [x] Define movement restrictions
- [x] Define equipment-to-card relationships
- [x] Confirm whether equipment actions and surrender are supported (domain: yes)
- [x] Expose equip and surrender actions in the public API (`ActionType`)
- [x] Confirm the exact `PlayerCode` representation
- [x] Define the game snapshot event (`GAME_SYNC`): the `GameDto` plus the receiving player's hand and its own sequence number
- [x] Push the snapshot from the server when a user with a game in progress reconnects
- [x] Add a per-game sequence number to every `EventDto`. The counter is a concrete class in `persistence/memory`, incremented only by `SpringEventPublisher`

## Phase 2 — Connectivity

- [ ] Remove the current AI implementation entirely (`SCOPE-4`), before adopting the new exception rule, so the AI does not have to be adapted to it. This includes its tests (`AIvsAIGameIntegationTest`, which times out in about half of the runs, goes with it), `docs/AISystem.md`, the AI references in `CODESTYLE.md`, `BACKEND-CODESTYLE.md` and `BACKEND-TESTS.md`, and the diagrams `class_diagram-ai_system` and `domain_model-ai_system`
- [x] Replace STOMP with Socket.IO
- [ ] Remove `WebSocketCommunicationClient` and turn `CommunicationClient` into a concrete class, because Socket.IO is the only transport
- [x] Implement Socket.IO connection
- [ ] Open the Socket.IO connection from the application (`CON-1`; nothing calls `connect()` yet)
- [x] Implement Socket.IO game event handling
- [x] Implement Socket.IO reconnection
- [x] Map `ActionDto` correctly
- [x] Map backend `EventDto` correctly
- [x] Identify the local player correctly
- [ ] Adopt the new exception rule (`BACKEND-CODESTYLE.md`, section 8): `Action` and the modes return a result with the `ExceptionCode` instead of throwing, and check the rules through queries on the models. Needed for `CON-18`
- [ ] Answer rejected actions with a 400 and their key (`CON-18`), after adopting the exception rule. Then remove `ExceptionPublisher` and the `error` channel (`CON-20`), including `sendExceptionCode` in the clients, and update `BACKEND-CODESTYLE.md` (sections 1 and 14) and `BACKEND-TESTS.md`
- [ ] Answer every other expected error with a 400 and its key (`CON-18`): parties, users, denied accesses, elements not found and malformed requests have no handler today
- [ ] Align the contract with `specs/CONTRACT.md`: `equipment` as a list in `CardDto`; `round` in `GameDto`; `handSize` in `PlayerDto`; no `health` or `maxHealth` in `ZoneDto`; `combatant` absent in an empty slot (`CON-14`); the `attackAvailable` and `targetable` flags (`PROT-4`, `CON-15`); remove `GAME_RESTART`; add `GAME_CANCELLED` and the details of `PLAYER_ATTACK_CARD` (`CON-21`); add the new error keys and rename those marked as renamed; no `code` in the body of `PUT /party`; `maxUsers` in the bodies of `POST` and `PUT /party`; a last `party:info` to a kicked user (`PARTY-12`)
- [ ] Publish the events in the order of `CON-22`
- [ ] Separate a public user id from the session id (`NFR-3`, `CON-24`): the user id is the HTTP session id and the parties share it with their members. `owner` and `users` in `PartyDto` become `UserDto`
- [ ] Keep `POST /register` as the only way to create a user and remove `POST /login` (`USER-6`), with a session of 24 hours (`USER-7`)
- [ ] Delete users only after the grace period (`CON-3`, `ABSENT-1`)
- [ ] Send the user's state when a socket is bound (`CON-23`): `GAME_SYNC` or `GAME_LOADING`, then `party:info`; a repeated `/ready` has no effect (`LOAD-2`)
- [ ] Implement REST `POST /game/{gameCode}/action` (`CON-16`)
- [ ] Implement REST error handling (`CON-18`): read the 400 and its key, and stop listening to the `error`, `game:error` and `exception` socket channels
- [ ] Refactor networking into clear API services
- [ ] Separate REST commands from Socket.IO events
- [ ] Separate backend DTO mapping from domain models

## Phase 3 — Authoritative game state and hand

- [ ] Check the game flow against `specs/GAME-FLOW.md` and implement the differences: turn order, what a round is, dealing to everyone at the start of the round, equipment in the spell slots, unlimited deck and missing categories
- [ ] Fix the `hasLeaderInBoard` bug so protection rules work from day one (`PROT-1`, `PROT-2`, `PROT-4`)
- [ ] A newly placed card must not act on the turn it is placed (`BOARD-8`): `Combatant.canAttack()` ignores it, so `attackAvailable` is `true` right after placement
- [ ] Create the authoritative frontend game-state layer (`ARCH-2`)
- [ ] Synchronize `GameDto` from backend events (turn, players, zones, board cards)
- [ ] Apply events in sequence order, discard those not newer than the last snapshot and ignore a received card that is already in the hand (`CON-12`)
- [ ] Reconcile state after Socket.IO events and after reconnection (`CON-11`, `CON-23`)
- [ ] Remove mocked game state, zones and hand
- [ ] Replace mocked `GameLoad` flow with real backend state
- [ ] Update Phaser views from authoritative state
- [ ] Map the backend rows (row 0 is the leader row) to the frontend zone organization, so the leader is shown nearest to the local player (`CON-14`, `VIEW-1`)
- [ ] Implement real initial hand synchronization and hand updates (`CON-13`)
- [ ] Remove played cards from the hand after backend confirmation (`HAND-2`)
- [ ] Animate newly received cards (`VIEW-8`)
- [ ] Keep opponent hands private (`HAND-3`, `UI-7`)

## Phase 4 — Core gameplay

- [ ] Check equipment against `EQUIP-*` and implement the differences: several pieces per card, only on the player's own cards, limits on the total
- [ ] Check the attack and placement rules on the server against `COMBAT-11`, `COMBAT-12`, `BOARD-5` and `BOARD-7`
- [ ] Refactor `CardController` to send backend commands
- [ ] Card placement (`PUT_ACTION`, `BOARD-5`): validate available slots, row 2 before row 1
- [ ] Card movement (`MOVE_ACTION`, `BOARD-7`): prevent invalid movement
- [ ] Attack (`ATTACK_ACTION`, `VIEW-4`): attacker selection, target selection, targeting UI (arrow or highlight while dragging)
- [ ] Equip (`EQUIP_ACTION`, `EQUIP-3`): only on the player's own cards
- [ ] Surrender (`SURRENDER_ACTION`, `ELIM-2`)
- [ ] Highlight valid targets and disable invalid ones (`UI-5`)
- [ ] End Turn button (`PASS_TURN`)
- [ ] Update turn after backend confirmation
- [ ] Disable gameplay when it is not the player's turn (`UI-4`)
- [ ] Prevent conflicting actions while an action is pending (`CON-19`)
- [ ] Handle rejected and duplicate/pending actions (`UI-6`, `CON-19`)
- [ ] Show clearly whose turn it is (`UI-3`)
- [ ] Render opponent card moves and turn changes from server events

## Phase 5 — Combat feedback and game end

- [ ] Check elimination and absence against `ELIM-*`, `ABSENT-*`, `WIN-5` and `SPEC-3` and implement the differences
- [ ] Keep the party locked while the result is shown, then remove the game and unlock the party (`WIN-5`)
- [ ] Update health/armor from `PLAYER_ATTACK_CARD` (`CON-21`)
- [ ] Attack animation and hit feedback (`VIEW-5`)
- [ ] Animate armor and health changes (`VIEW-6`)
- [ ] Card death animation, then remove dead cards (`COMBAT-7`, `VIEW-7`)
- [ ] Remove the equipment of a card when it dies (`EQUIP-8`)
- [ ] Leader death animation and board update (`ELIM-3`, `VIEW-7`)
- [ ] Replace local game-over detection with the backend game-end event (`WIN-3`)
- [ ] Determine winner from backend; victory and defeat screens, and automatic return to the party when it unlocks (`WIN-5`)
- [ ] Disable interaction after game end (`WIN-4`)
- [ ] Reject server-side any action when the game is not in progress (`TURN-7`; `PlayerTurnAction` only checks the turn today)
- [ ] Show protected cards and exposed leader state (`PROT-6`)
- [ ] Clear targeting state after an action, turn change or invalid action

## Phase 6 — Base assets and stability

- [ ] Base card set (`CARD-5`, `CARD-7`): leaders, warriors and equipment, with textures. `MemoryCardRepositoryPopulator` has their statistics but no names or descriptions, which are only in `CARD-5`. The client holds the Spanish texts of the keys
- [ ] Camera stability: zoom/pan must not break card interaction

## Phase 7 — Rounds, players and connection

- [ ] Synchronize and display current round; handle round transitions (`UI-3`)
- [ ] Receive newly dealt cards; do not hardcode the round schedule (`ROUND-4`)
- [ ] Highlight the current player; distinguish the local player's cards
- [ ] Show the empty zones of eliminated players; handle elimination (`ELIM-5`, `VIEW-11`)
- [ ] Spectator mode with all interaction disabled (`SPEC-1`, `SPEC-2`, `UI-8`)
- [ ] Connecting, disconnected, reconnecting and failure states (`UI-9`)
- [ ] Handle game-not-found, expired/invalid session, backend unavailable, failed initial sync (`UI-10`, `UI-11`, `USER-8`)
- [ ] Go back to the party and explain it when the loading is cancelled (`LOAD-4`)

## Phase 8 — Architecture cleanup

- [ ] Review `EventSystem` and `ActionSystem`
- [ ] Complete or remove `ActionResolver`
- [ ] Complete or remove unfinished card input logic; complete `CardClickHandler`
- [ ] Remove dead/unused architecture
- [ ] Finish remaining TODOs in comments

## Phase 9 — Board and cards

- [ ] Test layouts for 2 to 10 players (`VIEW-2`)
- [ ] Verify card readability, targeting and hover previews with 10 players (`VIEW-2`)
- [ ] Review/fix existing table grid-line TODO
- [ ] Connect card preview to real backend data (types, stats, rarity, descriptions, equipment)
- [ ] Display opponent card backs (`VIEW-3`)
- [ ] Complete stacked-card hover behavior if needed

## Phase 10 — UX and audio

- [ ] Feedback: invalid drop, invalid target, not your turn, card cannot move, no available slot (`UI-6`)
- [ ] Round transition presentation and gameplay event notifications
- [ ] Improve loading flow; loading failure UI (`UI-12`)
- [ ] Cursor animations
- [ ] Centralize audio; sounds for placement, attack, death, turn/round change, victory, defeat (`VIEW-9`)

## Phase 11 — Menu, lobby, user

- [ ] Check users, parties and loading against `USER-*`, `PARTY-*` and `LOAD-*` and implement the differences: default capacity of 4 (`Party` uses 5) and its range, minimum to start, owner succession, name rules, name of the party
- [ ] Main Menu: create party, join party, party list (`UI-1`)
- [ ] Lobby: party creation, joining, listing, leaving, owner controls, kicking, configuration, start game (`PARTY-*`)
- [ ] Username editing from the main menu, persisted with `PUT /user` (`USER-3`, `UI-13`)

## Phase 12 — Testing

Unit and per-feature tests are written with their code (see Workflow). This phase covers only cross-cutting tests.

- [ ] E2E game-flow tests
- [ ] Reconnection, spectator mode and game completion tests

## Phase 13 — AI

The AI is rethought around an LLM, starting from nothing. The current implementation is removed in Phase 2.

- [ ] Discuss the specifications of the LLM model

## Pending tasks

Not tied to a phase.

- [x] Resolve the apparent `ActionMapper.toPlayerCode()` recursion bug
- [ ] A person starts the backend and checks that the Socket.IO server listens on port 9092 (it cannot be done from the agent environment)
- [ ] A person tests a real browser connection with the session cookie; the frontend does not call `connect()` yet (see Phase 2)
- [x] Replace `IllegalAccessException` in `PlayerUsecase` with an `AccessDeniedException` that extends `UsecaseException`
- [ ] In the planning stage, before implementing `CON-21`, weigh the pros and cons of giving each event its own `EventDetails` implementation

## Post-MVP

- Spells (including exposing `UseCardAction` and `UseSpellAction` in the API), autotrigger (`R`) spells and complex equipment effects
- Teams: a team model in the backend (from the game configuration and from spells) and its exposure to the frontend (for example a `team` in each `ZoneDto`), and in the interface: display, team victory and dead teammates
- Vote to kick a player in the middle of a game (the MVP has no turn time limit, so an absent player blocks the game until their user is deleted)
- Several decks instead of a single one per server: today one `Deck` bean, which is also the `CardRepository`, is injected into every game mode, and `PersistenceConfiguration` backs off if the application provides its own `Deck`; decide how a deck is chosen (per party, per game mode, uploaded by the owner), its format, validation and lifetime before designing it
- Leaders do not repeat when the deck has enough for every player
- Names and descriptions for the leaders (`CARD-5`)
- Balance of the base content: higher rarities do not stand out (Alien, Epic, has 5 damage and 15 health, worse than Perro, Uncommon, with 10 and 10; Policía reaches 20 damage with Pistolón), and Argoth and Odin are not dealt, because the schedule has no slots for their rarities
- Equipment on enemy cards
- Spectators from outside the game
- English translation
- Discussion: defensive programming between actions and the domain. Some rules are validated twice (for example `MoveAction.checkContext` and `Zone.putCombatant`); decide where each rule lives
- Infinite stats and true damage
- Combat log and dynamic localization
- Premium animations (particles, special effects)
- Advanced trolling cards, green/red indicators, center-table behavior
- Settings screen, audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
