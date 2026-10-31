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

- [ ] Define the Socket.IO connection contract
- [ ] Define Socket.IO event names
- [ ] Define Socket.IO event payloads
- [ ] Define how the player's hand is sent
- [ ] Define card runtime state/effects
- [ ] Define `targetable` state
- [ ] Define `PROTECTED` state
- [ ] Define `autotrigger` state
- [ ] Define attack-used/attack-available state
- [ ] Define movement restrictions
- [ ] Define equipment-to-card relationships
- [ ] Confirm whether equipment actions are supported
- [ ] Confirm whether surrender is supported
- [ ] Resolve the apparent `ActionMapper.toPlayerCode()` recursion bug
- [ ] Confirm the exact `PlayerCode` representation
- [ ] Fix the `hasLeaderInBoard` bug so protection rules work from day one

## Phase 2 — Connectivity

- [x] Replace STOMP with Socket.IO
- [x] Implement Socket.IO connection
- [x] Implement Socket.IO game event handling
- [x] Implement Socket.IO reconnection
- [x] Map `ActionDto` correctly
- [x] Map backend `EventDto` correctly
- [x] Identify the local player correctly
- [ ] Implement REST `POST /game/{gameCode}/action`
- [ ] Implement REST error handling
- [ ] Refactor networking into clear API services
- [ ] Separate REST commands from Socket.IO events
- [ ] Separate backend DTO mapping from domain models

## Phase 3 — Authoritative game state and hand

- [ ] Create the authoritative frontend game-state layer
- [ ] Synchronize `GameDto` from backend events (turn, players, zones, board cards)
- [ ] Reconcile state after Socket.IO events and after reconnection
- [ ] Remove mocked game state, zones and hand
- [ ] Replace mocked `GameLoad` flow with real backend state
- [ ] Update Phaser views from authoritative state
- [ ] Implement real initial hand synchronization and hand updates
- [ ] Remove played cards from the hand after backend confirmation
- [ ] Animate newly received cards
- [ ] Keep opponent hands private

## Phase 4 — Core gameplay

- [ ] Refactor `CardController` to send backend commands
- [ ] Card placement (`PUT_ACTION`): validate available slots, row 2 before row 1
- [ ] Card movement (`MOVE_ACTION`): prevent invalid movement
- [ ] Attack (`ATTACK_ACTION`): attacker selection, target selection, targeting UI (arrow or highlight while dragging)
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
- [ ] Show protected cards and exposed leader state
- [ ] Clear targeting state after an action, turn change or invalid action

## Phase 6 — Base assets and stability

- [ ] Base card set: 1 leader and 3 distinct warrior types (Pop, Common, Rare) with textures
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

## Phase 11 — Menu, lobby, user, teams

- [ ] Main Menu: create game, join game, party list, settings
- [ ] Lobby: party creation, joining, listing, leaving, owner controls, kicking, configuration, start game
- [ ] Username editing persisted with `PUT /user`
- [ ] Teams: display, team victory, dead teammates

## Phase 12 — Testing

- [ ] REST integration tests
- [ ] Socket.IO/event tests
- [ ] State-reconciliation and action-flow tests
- [ ] E2E game-flow tests
- [ ] Reconnection, spectator mode and game completion tests

## Post-MVP

- Spells and complex equipment
- Infinite stats and true damage
- Advanced AI system
- Combat log and dynamic localization
- Premium animations (particles, special effects)
- Advanced trolling cards, green/red indicators, center-table behavior
- Audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
