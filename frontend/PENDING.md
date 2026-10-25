https://chatgpt.com/share/6aa67e84-95bc-83eb-b3bc-28bb010d6782

# Frontend TODO

## 🔴 P0 — Critical

### Backend connectivity
- [x] Replace STOMP with Socket.IO
- [x] Implement Socket.IO connection
- [x] Implement Socket.IO game event handling
- [x] Implement Socket.IO reconnection
- [ ] Implement REST `POST /game/{gameCode}/action`
- [ ] Implement `PUT_ACTION`
- [ ] Implement `MOVE_ACTION`
- [ ] Implement `ATTACK_ACTION`
- [ ] Implement `PASS_TURN`
- [ ] Implement REST error handling
- [x] Map `ActionDto` correctly
- [x] Map backend `EventDto` correctly
- [x] Identify the local player correctly

### Game state
- [ ] Create the authoritative frontend game-state layer
- [ ] Synchronize `GameDto` from backend events
- [ ] Synchronize current turn
- [ ] Synchronize players
- [ ] Synchronize player zones
- [ ] Synchronize cards on the board
- [ ] Remove mocked game state
- [ ] Remove mocked zones
- [ ] Remove mocked hand
- [ ] Replace mocked `GameLoad` flow with real backend state
- [ ] Reconcile frontend state after Socket.IO events
- [ ] Reconcile frontend state after reconnection

### Hand
- [ ] Implement real initial hand synchronization
- [ ] Implement hand updates
- [ ] Remove played cards from the hand after backend confirmation
- [ ] Animate newly received cards
- [ ] Keep opponent hands private

### Core gameplay
- [ ] Implement real card placement
- [ ] Implement `PUT_ACTION`
- [ ] Validate available board slots
- [ ] Enforce Row 2 before Row 1
- [ ] Implement real card movement
- [ ] Implement `MOVE_ACTION`
- [ ] Prevent invalid card movement
- [ ] Implement attacker selection
- [ ] Implement target selection
- [ ] Implement `ATTACK_ACTION`
- [ ] Implement valid target highlighting
- [ ] Disable invalid targets
- [ ] Implement End Turn button
- [ ] Implement `PASS_TURN`
- [ ] Update turn after backend confirmation
- [ ] Disable gameplay when it is not the player's turn
- [ ] Prevent conflicting actions while an action is pending

### Backend-authoritative behavior
- [ ] Stop directly mutating authoritative game state before backend confirmation
- [ ] Refactor `CardController` to send backend commands
- [ ] Update Phaser views from authoritative state
- [ ] Handle rejected actions correctly
- [ ] Handle duplicate/pending actions correctly


## ⚫ P0 — Backend contract blockers

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


## 🟠 P1 — High priority

### Combat
- [ ] Implement attack animation
- [ ] Implement damage feedback
- [ ] Animate armor changes
- [ ] Animate health changes
- [ ] Implement card death animation
- [ ] Remove dead cards after animation
- [ ] Handle equipment when its owner dies
- [ ] Implement leader death animation
- [ ] Update board after leader death

### Player state
- [ ] Highlight the player whose turn it is
- [ ] Visually distinguish the local player's cards
- [ ] Implement spectator mode
- [ ] Disable all game interaction for spectators
- [ ] Hide/remove dead players according to backend state
- [ ] Handle player elimination

### Protection and targeting
- [ ] Show protected cards visually
- [ ] Update protection visuals after board changes
- [ ] Show exposed leader state when available from backend
- [ ] Clear targeting state after an action
- [ ] Clear targeting state after turn changes
- [ ] Clear targeting state after invalid actions

### Game end
- [ ] Replace local game-over detection
- [ ] Use backend game-end state/event
- [ ] Determine winner from backend
- [ ] Show victory screen
- [ ] Show defeat screen
- [ ] Disable interaction after game end

### Rounds
- [ ] Synchronize current round from backend
- [ ] Display current round
- [ ] Handle round transitions
- [ ] Receive newly dealt cards
- [ ] Animate new cards entering the hand
- [ ] Do not hardcode the round schedule

### Connection and errors
- [ ] Show connecting state
- [ ] Show disconnected state
- [ ] Show reconnecting state
- [ ] Show connection failure
- [ ] Handle game-not-found errors
- [ ] Handle expired/invalid session
- [ ] Handle backend unavailable
- [ ] Handle failed initial synchronization


## 🟡 P2 — Medium priority

### Architecture
- [ ] Refactor networking into clear API services
- [ ] Separate REST commands from Socket.IO events
- [ ] Separate backend DTO mapping from domain models
- [ ] Review `EventSystem`
- [ ] Review `ActionSystem`
- [ ] Complete or remove `ActionResolver`
- [ ] Complete or remove unfinished card input logic
- [ ] Complete `CardClickHandler`
- [ ] Review unfinished TODOs
- [ ] Remove dead/unused architecture

### Board
- [ ] Test 2-player layout
- [ ] Test 3-player layout
- [ ] Test 4-player layout
- [ ] Test 5-player layout
- [ ] Test 6-player layout
- [ ] Test 7-player layout
- [ ] Test 8-player layout
- [ ] Test 9-player layout
- [ ] Test 10-player layout
- [ ] Verify card readability with 10 players
- [ ] Verify targeting with 10 players
- [ ] Verify hover previews with 10 players
- [ ] Review/fix existing table grid-line TODO

### Cards
- [ ] Connect card preview to real backend data
- [ ] Support all card types in the preview
- [ ] Display real stats
- [ ] Display real rarity
- [ ] Display real descriptions
- [ ] Display equipment correctly
- [ ] Display opponent card backs correctly
- [ ] Prevent inspection of dead cards
- [ ] Complete stacked-card hover behavior if needed

### UX
- [ ] Add invalid-drop feedback
- [ ] Add invalid-target feedback
- [ ] Add "not your turn" feedback
- [ ] Add "card cannot move" feedback
- [ ] Add "no available slot" feedback
- [ ] Add round transition presentation
- [ ] Add gameplay event notifications
- [ ] Improve loading flow
- [ ] Add loading failure UI

### Audio
- [ ] Centralize audio handling
- [ ] Play card placement sounds
- [ ] Play attack sounds
- [ ] Play death sounds
- [ ] Play spell sounds
- [ ] Play turn-change sounds
- [ ] Play round-change sounds
- [ ] Play victory sound
- [ ] Play defeat sound


## 🟢 P3 — Low priority / later

### Main Menu
- [ ] Implement real Main Menu
- [ ] Add Create Game
- [ ] Add Join Game
- [ ] Add Party/Game list if desired
- [ ] Add settings if needed

### Lobby
- [ ] Implement lobby
- [ ] Implement party creation
- [ ] Implement party joining
- [ ] Implement party list
- [ ] Implement leaving a party
- [ ] Implement owner controls
- [ ] Implement kicking players
- [ ] Implement party configuration
- [ ] Implement game start from lobby
- [ ] Transition from lobby to game

### User
- [ ] Implement username editing
- [ ] Persist username changes with `PUT /user`

### Teams
- [ ] Implement teams
- [ ] Display team information
- [ ] Implement team victory
- [ ] Implement team-related UI
- [ ] Handle dead teammates correctly

### Advanced features
- [ ] Implement advanced trolling cards
- [ ] Implement green/red trolling indicators
- [ ] Implement center-table trolling behavior

### Polish
- [ ] Add audio settings
- [ ] Add accessibility improvements
- [ ] Add reduced-motion option
- [ ] Add color-blind-friendly indicators
- [ ] Improve responsive layout
- [ ] Improve touch/mobile interaction

### Testing
- [ ] Add REST integration tests
- [ ] Add Socket.IO/event tests
- [ ] Add state-reconciliation tests
- [ ] Add action-flow tests
- [ ] Add E2E game-flow tests
- [ ] Test reconnection
- [ ] Test spectator mode
- [ ] Test game completion

## 🟢 P4 — Review
- [ ] Finish remaining TODOs in comments