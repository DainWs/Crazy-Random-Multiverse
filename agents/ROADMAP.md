# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

## Closed decisions

| Decision | Choice |
|---|---|
| Realtime transport | Socket.IO (replaces STOMP) |
| Commands | REST `POST /game/{gameCode}/action` |
| Game state authority | Backend. The frontend never mutates state before server confirmation |

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

- [ ] Remove the current AI implementation entirely, including its tests (`AIvsAIGameIntegationTest`, which times out in about half of the runs, goes with it), before adopting the new exception rule (Pending tasks), so the AI does not have to be adapted to it
- [x] Replace STOMP with Socket.IO
- [x] Implement Socket.IO connection
- [ ] Open the Socket.IO connection from the application (nothing calls `connect()` yet)
- [x] Implement Socket.IO game event handling
- [x] Implement Socket.IO reconnection
- [x] Map `ActionDto` correctly
- [x] Map backend `EventDto` correctly
- [x] Identify the local player correctly
- [ ] Implement REST `POST /game/{gameCode}/action`
- [ ] Implement REST error handling (`CON-18`): read the 400 and its key, and stop listening to the `error`, `game:error` and `exception` socket channels
- [ ] Refactor networking into clear API services
- [ ] Separate REST commands from Socket.IO events
- [ ] Separate backend DTO mapping from domain models

## Phase 3 — Authoritative game state and hand

- [ ] Create the authoritative frontend game-state layer
- [ ] Synchronize `GameDto` from backend events (turn, players, zones, board cards)
- [ ] Apply events in sequence order, discard those not newer than the last snapshot and ignore a received card that is already in the hand
- [ ] Reconcile state after Socket.IO events and after reconnection
- [ ] Remove mocked game state, zones and hand
- [ ] Replace mocked `GameLoad` flow with real backend state
- [ ] Update Phaser views from authoritative state
- [ ] Map the backend rows (row 0 is the leader row) to the frontend zone organization, so the leader is shown nearest to the local player
- [ ] Implement real initial hand synchronization and hand updates
- [ ] Remove played cards from the hand after backend confirmation
- [ ] Animate newly received cards
- [ ] Keep opponent hands private

## Phase 4 — Core gameplay

- [ ] Refactor `CardController` to send backend commands
- [ ] Card placement (`PUT_ACTION`): validate available slots, row 2 before row 1
- [ ] Card movement (`MOVE_ACTION`): prevent invalid movement
- [ ] Attack (`ATTACK_ACTION`): attacker selection, target selection, targeting UI (arrow or highlight while dragging)
- [ ] Equip (`EQUIP_ACTION`): only on the player's own cards
- [ ] Surrender (`SURRENDER_ACTION`)
- [ ] Highlight valid targets and disable invalid ones
- [ ] End Turn button (`PASS_TURN`)
- [ ] Update turn after backend confirmation
- [ ] Disable gameplay when it is not the player's turn
- [ ] Prevent conflicting actions while an action is pending
- [ ] Handle rejected and duplicate/pending actions
- [ ] Show clearly whose turn it is
- [ ] Render opponent card moves and turn changes from server events

## Phase 5 — Combat feedback and game end

- [ ] Update health/armor on server damage events
- [ ] Attack animation and hit feedback (shake or red flash)
- [ ] Animate armor and health changes
- [ ] Card death animation, then remove dead cards
- [ ] Handle equipment when its owner dies
- [ ] Leader death animation and board update
- [ ] Replace local game-over detection with the backend game-end event
- [ ] Determine winner from backend; victory and defeat screens
- [ ] Disable interaction after game end
- [ ] Reject server-side any action when the game is not in progress (`PlayerTurnAction` only checks the turn today)
- [ ] Show protected cards and exposed leader state
- [ ] Clear targeting state after an action, turn change or invalid action

## Phase 6 — Base assets and stability

- [ ] Base card set (`CARD-5`): leaders, warriors and equipment, with textures. `MemoryCardRepositoryPopulator` has their statistics but no names or descriptions, which are only in `CARD-5`; the leaders have provisional names
- [ ] Camera stability: zoom/pan must not break card interaction

## Phase 7 — Rounds, players and connection

- [ ] Synchronize and display current round; handle round transitions
- [ ] Receive newly dealt cards; do not hardcode the round schedule
- [ ] Highlight the current player; distinguish the local player's cards
- [ ] Hide/remove dead players per backend state; handle elimination
- [ ] Spectator mode with all interaction disabled
- [ ] Connecting, disconnected, reconnecting and failure states
- [ ] Handle game-not-found, expired/invalid session, backend unavailable, failed initial sync

## Phase 8 — Architecture cleanup

- [ ] Review `EventSystem` and `ActionSystem`
- [ ] Complete or remove `ActionResolver`
- [ ] Complete or remove unfinished card input logic; complete `CardClickHandler`
- [ ] Remove dead/unused architecture
- [ ] Finish remaining TODOs in comments

## Phase 9 — Board and cards

- [ ] Test layouts for 2 to 10 players
- [ ] Verify card readability, targeting and hover previews with 10 players
- [ ] Review/fix existing table grid-line TODO
- [ ] Connect card preview to real backend data (types, stats, rarity, descriptions, equipment)
- [ ] Display opponent card backs; prevent inspection of dead cards
- [ ] Complete stacked-card hover behavior if needed

## Phase 10 — UX and audio

- [ ] Feedback: invalid drop, invalid target, not your turn, card cannot move, no available slot
- [ ] Round transition presentation and gameplay event notifications
- [ ] Improve loading flow; loading failure UI
- [ ] Cursor animations
- [ ] Centralize audio; sounds for placement, attack, death, spells, turn/round change, victory, defeat

## Phase 11 — Menu, lobby, user

- [ ] Main Menu: create game, join game, party list, settings
- [ ] Lobby: party creation, joining, listing, leaving, owner controls, kicking, configuration, start game
- [ ] Username editing persisted with `PUT /user`

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
- [ ] Fix the `hasLeaderInBoard` bug so protection rules work from day one
- [ ] The user id is the HTTP session id and the parties share it with their members, which makes it equivalent to a credential: separate a public user id from the session id
- [ ] A person starts the backend and checks that the Socket.IO server listens on port 9092 (it cannot be done from the agent environment)
- [ ] A person tests a real browser connection with the session cookie; the frontend does not call `connect()` yet (see Phase 2)
- [ ] Adopt the new exception rule (`BACKEND-CODESTYLE.md`, section 8): `Action` and the modes return a result with the `ExceptionCode` instead of throwing, and check the rules through queries on the models. Needed for `CON-18`
- [ ] Answer rejected actions with a 400 and their key (`CON-18`), after adopting the exception rule. Then remove `ExceptionPublisher` and the `error` channel (`CON-20`), including `sendExceptionCode` in the clients, and update `BACKEND-CODESTYLE.md` (sections 1 and 14) and `BACKEND-TESTS.md`
- [ ] Answer every other expected error with a 400 and its key (`CON-18`): parties, users, denied accesses and elements not found have no handler today
- [x] Replace `IllegalAccessException` in `PlayerUsecase` with an `AccessDeniedException` that extends `UsecaseException`
- [ ] Decide whether to add tooling that enforces the style rules (Checkstyle to ban `switch`, ArchUnit to ban records in the DTO package); each is a new dependency, ask first
- [ ] A newly placed card must not act on the turn it is placed (`BOARD-8`): `Combatant.canAttack()` ignores it, so `attackAvailable` is `true` right after placement
- [ ] Align the contract with `specs/CONTRACT.md`: `equipment` as a list in `CardDto`; `round` in `GameDto`; `handSize` in `PlayerDto`; remove `GAME_RESTART`; add the new error keys; `exception.party_locked`, `exception.party_is_full` and `EXCEPTION_COORDINATE_REQUIRES_LEADER` do not follow the key format of the others, review them
- [ ] Check the game flow against `specs/GAME-FLOW.md` and implement the differences: turn order, what a round is, dealing to everyone at the start of the round, equipment in the spell slots, unlimited deck and missing categories
- [ ] Check equipment against `EQUIP-*` and implement the differences: several pieces per card, only on the player's own cards, limits on the total
- [ ] Check elimination and absence against `ELIM-*`, `ABSENT-*`, `WIN-5` and `SPEC-3` and implement the differences
- [ ] Check users, parties and loading against `USER-*`, `PARTY-*` and `LOAD-*` and implement the differences: default capacity of 4 (`Party` uses 5) and its range, minimum to start, owner succession, name rules

## Post-MVP

- Spells (including exposing `UseCardAction` and `UseSpellAction` in the API), autotrigger (`R`) spells and complex equipment effects
- Teams: a team model in the backend (from the game configuration and from spells) and its exposure to the frontend (for example a `team` in each `ZoneDto`), and in the interface: display, team victory and dead teammates
- Grace period on disconnect: delete a user only after a configurable time without reconnecting (today a periodic task deletes every user without an open socket, so one can be deleted a moment after dropping)
- Vote to kick a player in the middle of a game (the MVP has no turn time limit, so an absent player blocks the game until their user is deleted)
- Several decks instead of a single one per server: today one `Deck` bean, which is also the `CardRepository`, is injected into every game mode, and `PersistenceConfiguration` backs off if the application provides its own `Deck`; decide how a deck is chosen (per party, per game mode, uploaded by the owner), its format, validation and lifetime before designing it
- Leaders do not repeat when the deck has enough for every player
- Equipment on enemy cards
- Spectators from outside the game
- English translation
- Discussion: defensive programming between actions and the domain. Some rules are validated twice (for example `MoveAction.checkContext` and `Zone.putCombatant`); decide where each rule lives
- Infinite stats and true damage
- Combat log and dynamic localization
- Premium animations (particles, special effects)
- Advanced trolling cards, green/red indicators, center-table behavior
- Audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
