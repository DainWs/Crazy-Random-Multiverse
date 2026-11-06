# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

**MVP scope:** Phases 1 to 12 (including 2.5 and 2.6). Phase 13 and the Post-MVP section are out of it.

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
- [x] Add `locked` to `PartyDto`: the client goes back to the party only when it becomes `false` and disables starting a game while it is `true` (`WIN-5`)
- [x] Define `PlayerDto.code` as the public `UserDto.id` (`CON-24`, `NFR-3`), so the client identifies its player without exposing the session
- [x] Define `damage`, `armor`, `health` and `maxHealth` in `CardDto` as effective values with the equipment included; `equipment` only lists what the card holds
- [x] End `CON-23` with a new event without data, always sent, even to a user with no party or game, so the client knows it can go to the main menu
- [x] Rename `CardDto.code` to `catalogCode` (`CON-7`, `CARD-7`): it identifies the card in the catalog, together with `type`, and copies of a card share it
- [x] State that cards have no unique id: the client numbers the copies of a card in its hand by how many it holds, renumbering them when one leaves, and that number never reaches the server. On the board a card is identified by its position
- [x] Remove from `CON-12` and from the Phase 3 task that a received card already in the hand is ignored, because a player can legitimately hold repeated cards
- [x] Document in `CON-12` as an accepted risk of the MVP that an event already reflected in `GAME_SYNC` can leave a wrong hand on the client until the next `GAME_SYNC`, because a card in the hand cannot be recognized. It can only happen when a socket is bound
- [x] State in `CARD-4` that the client derives the frame and image of a card from `type`, `rarity` and `catalogCode`, so `CardDto` has no texture field
- [x] Add the field types to the contract. `ActionDto`: `game`, `sourcePlayer` and `targetPlayer` are codes as text, `sourceCard` is a `CardCodeDto` (`{ code, type }`), positions are `PositionDto`. `EventDetailsDto`: `sourcePlayer` and `targetPlayer` are `PlayerDto`, `sourceCard` and `targetCard` are `CardDto`, positions are `PositionDto`, `hand` is `CardDto[]`
- [x] Extend `CON-5`: one setting holds the client origin for REST and the socket, with credentials, and `*` stops being its default, because browsers refuse the cookie with it
- [x] State in the contract that `round` and `playerWithTurn` are not sent before their first event, that `playerWithTurn` is not sent once the game has ended, and that `attackAvailable` is `false` on rival cards and outside the player's turn

## Phase 2 — Connectivity

- [x] Remove the current AI implementation entirely (`SCOPE-4`), before adopting the new exception rule, so the AI does not have to be adapted to it. This includes its tests (`AIvsAIGameIntegationTest`, which times out in about half of the runs, goes with it), `docs/AISystem.md`, the AI references in `CODESTYLE.md`, `BACKEND-CODESTYLE.md` and `BACKEND-TESTS.md`, and the diagrams `class_diagram-ai_system` and `domain_model-ai_system`
- [x] Replace STOMP with Socket.IO
- [x] Remove `WebSocketCommunicationClient` and turn `CommunicationClient` into a concrete class, because Socket.IO is the only transport
- [x] Implement Socket.IO connection
- [x] Open the Socket.IO connection from the application (`CON-1`; nothing calls `connect()` yet)
- [x] Implement Socket.IO game event handling
- [x] Implement Socket.IO reconnection
- [x] Map `ActionDto` correctly
- [x] Map backend `EventDto` correctly
- [x] Identify the local player correctly
- [x] Adopt the new exception rule (`BACKEND-CODESTYLE.md`, section 8): `Action` and the modes return a result with the `ExceptionCode` instead of throwing, and check the rules through queries on the models. Needed for `CON-18`
- [x] Answer rejected actions with a 400 and their key (`CON-18`), after adopting the exception rule. Then remove `ExceptionPublisher` and the `error` channel (`CON-20`), including `sendExceptionCode` in the clients, and update `BACKEND-CODESTYLE.md` (sections 1 and 14) and `BACKEND-TESTS.md`
- [x] Answer every other expected error with a 400 and its key (`CON-18`): parties, users, denied accesses, elements not found and malformed requests have no handler today
- [x] Align the contract with `specs/CONTRACT.md` (the new error keys that need a rule not built yet arrive with that rule in Phases 3, 4, 5 and 11): `equipment` as a list in `CardDto`; `round` in `GameDto`; `handSize` in `PlayerDto`; no `health` or `maxHealth` in `ZoneDto`; `combatant` absent in an empty slot (`CON-14`); the `attackAvailable` and `targetable` flags (`PROT-4`, `CON-15`); remove `GAME_RESTART`; add `GAME_CANCELLED` and the details of `PLAYER_ATTACK_CARD` (`CON-21`); add the new error keys and rename those marked as renamed; no `code` in the body of `PUT /party`; `maxUsers` in the bodies of `POST` and `PUT /party`; a last `party:info` to a kicked user (`PARTY-12`); `catalogCode` instead of `code` in `CardDto` (`CON-26`); effective statistics in `CardDto` (`CON-27`); `locked` in `PartyDto`
- [x] Replace `crm.communication.socket-io.origin` with one explicit origin for REST and the socket, with credentials (`CON-5`)
- [x] Publish each event to the clients before the game reacts to it, and `ROUND_CHANGE` before `TURN_CHANGE` (`CON-22`)
- [x] Separate a public user id from the session id (`NFR-3`, `CON-24`): the user id is the HTTP session id and the parties share it with their members. `owner` and `users` in `PartyDto` become `UserDto`, and `PlayerDto.code` takes the public id
- [x] Keep `POST /register` as the only way to create a user and remove `POST /login` (`USER-6`), with a session of 24 hours (`USER-7`)
- [x] Delete users only after the grace period (`CON-3`, `ABSENT-1`)
- [x] Check that a user can have several sockets at once and implement the differences (`CON-25`)
- [x] Send the user's state when a socket is bound (`CON-23`): `GAME_SYNC` or `GAME_LOADING`, then `party:info`, and always `user:synced`; a repeated `/ready` has no effect (`LOAD-2`)
- [x] Implement REST `POST /game/{gameCode}/action` (`CON-16`)
- [x] Implement REST error handling (`CON-18`): read the 400 and its key, and stop listening to the `error`, `game:error` and `exception` socket channels
- [x] Remove `login` from `UserApi.ts` and its test: `POST /login` no longer exists (`USER-6`)
- [x] Read `owner` and `users` of `PartyDto` as `UserDto` in the frontend, and update `Party` (`CON-24`)
- [x] On start, call `GET /user` and, on `exception.user.not_found`, `POST /register` (`USER-6`)
- [x] Listen to `party:info` and `user:synced` in the client and apply `CON-23`: go to the party, the main menu or the game according to what arrives
- [x] Send `party:info` to every member when a user joins a party (`PARTY-10`)

## Phase 2.5 — Minimal lobby

Just enough to create a real game from the interface, which Phase 3 needs. The rest of the lobby is in Phase 11.

- [x] Move the party and the user state from `StoreSystem` to `SessionSystem` as read-only `shallowRef`s, and update its tests. Separate refactoring commit (`FRONTEND-CODESTYLE.md`, section 2)
- [x] Choose the screen from the user state in `App.vue`, waiting for `user:synced`, and start the loading and game scenes only when the state enters them; `Preloader` no longer jumps to `GameLoad` (`UI-17`, `CON-23`)
- [x] Main menu: create a party with the default capacity and mode, and join one with its code, showing rejections below the field (`UI-1`, `UI-18`, `PARTY-1`, `PARTY-5`)
- [x] Party screen: name, members out of capacity, owner marked, members from `party:info`, the code to copy, leaving, and starting the game for the owner, disabled while the party is locked or has fewer than 2 members (`UI-19`, `UI-20`, `UI-16`, `PARTY-9`, `PARTY-10`, `LOAD-1`)

## Phase 2.6 — Game resource loading

Starting a game from the party today stalls in `GAME_LOADING`: the client asks `GET /game/{gameCode}/resources`, which the backend does not have, and the load fails with `imageResources is not iterable`. The resources must be downloaded before the game starts, and `/ready` confirmed only after that (`LOAD-2`).

- [x] Define the resource manifest contract in `specs/CONTRACT.md`: endpoint or field, format and error keys. The server exposes it (closed with the user); its format is for a person to decide, do not invent it: ask
- [x] Serve the `fixed` files from the backend under `/resources`, on its classpath, moving them from `frontend/public/assets`, and add `/resources` to the Vite dev proxy (`CON-29`). `logo` and the menu background stay in the frontend. The test art (`common-01`, `mythic-01`, `cards/pop_02` and their audios) matches no card of `CARD-5` and is not moved
- [x] Implement the manifest in the backend, with its tests (`CON-28`, `CON-30`, `CON-31`)
- [x] Align `GameApi.loadGameResourceManifest` and its test with the contract
- [x] Derive the manifest keys of images, frames, icons and slot marks in the client (`CARD-4`, `CON-30`)
- [x] Replace mocked `GameLoad` flow with real backend state: the game code comes from `GAME_LOADING` instead of `Code:1`. The board, zones and hand stay mocked until Phase 3
- [x] Download the `fixed` resources and try the leader images during `GAME_LOADING`, with the time limit of `LOAD-7`, and confirm `POST /game/{gameCode}/ready` only after that (`LOAD-2`), and stop on `GAME_CANCELLED` (`LOAD-5`)
- [x] Loading screen: progress of the downloads, then the wait for the other players (`UI-22`)
- [x] Download the `fixed` resources before showing a game in progress, without `/ready` (`LOAD-6`)
- [x] Download card images when a card is first shown, with `card.unknown` until they arrive or if they fail (`UI-21`)
- [x] Loading failure UI: show the failure and offer to retry only what failed, without confirming `/ready` (`UI-12`)

## Phase 3 — Authoritative game state and hand

This phase synchronizes the state and renders it without animating it, except for the cards received. The actions arrive in Phase 4 and the combat feedback in Phase 5.

- [x] Publish the start of a round in the order of `CON-22`: `ROUND_CHANGE`, one `PLAYER_RECEIVE_CARD` per card dealt, player by player in the order of `zones`, then `TURN_CHANGE`, and the first round and turn like any other. `zones` starts with the starting player (`GameDto`)
- [x] Check the game flow against `specs/GAME-FLOW.md` and implement the differences: the leaders placed when the game is created, without `PLAYER_RECEIVE_CARD` (`SETUP-2`; today a player seated before a random starting player never gets one), the whole turn order drawn at random (`SETUP-3`; today only the starting player is), what a round is, rounds numbered from 1 (`GameDto.round`), dealing to everyone at the start of the round, equipment in the spell slots, unlimited deck, missing categories and a deck without leaders (`DECK-4`)
- [x] Reject the attack of a protected leader with `exception.player-action.selected_source_leader_is_protected` (`PROT-4`): `attackAvailable` already excludes it, but `AttackAction` accepts it. `hasLeaderInBoard` in the frontend is unrelated and has no callers, so it goes with the cleanup of Phase 8
- [x] A newly placed card must not attack on the turn it is placed (`BOARD-8`), although it can move and be equipped (`BOARD-6`, `EQUIP-3`): `Combatant.canAttack()` ignores it, so `attackAvailable` is `true` right after placement
- [x] Check the state of the turn against `CON-32` and implement the differences: `playerWithTurn` only changes with `TURN_CHANGE` and is not sent before the first one (`GameDto`), and attacks and cooldowns are reset before `TURN_CHANGE` is published
- [x] Feed `StoreSystem` with the real game state from `GAME_LOADING` on, independently of the scenes, and clear it when the user no longer has a game (`ARCH-2`, `LOAD-6`, `UI-17`)
- [x] Synchronize `GameDto` from backend events (round, turn, players, zones, board cards), replacing the state with the `game` of each event (`CON-10`)
- [x] Map the `game` and the cards of the details of each event for each recipient when the event is published, not when it is sent: the multicaster runs each listener on its own thread, so today they come from the live game (`CON-10`)
- [ ] Queue the events by `sequence` and apply them in that order, waiting for the missing ones, discard those already reflected in a snapshot, always apply the snapshots, and start over with each game (`CON-12`)
- [ ] Reconcile state after Socket.IO events and after reconnection (`CON-11`, `CON-23`)
- [ ] Remove mocked game state, zones and hand, and the unused `saveHand` and `loadHand` of `LocalStorageApi`
- [ ] Update Phaser views from authoritative state
- [ ] Map the backend rows (row 0 is the leader row) to the frontend zone organization, with each leader at the edge of the table and the local zone at the bottom (`CON-14`, `VIEW-1`). `Battlefield` groups the zones by a team the contract does not have: in the MVP every other zone is an enemy (`VIEW-13`)
- [ ] Implement the real hand: cleared and restored from `GAME_SYNC`, and a received card added only if the event carries it, without hardcoding the round schedule (`CON-11`, `CON-13`, `ROUND-4`)
- [ ] Remove played cards from the hand when their event arrives, and empty it with the `PLAYER_DIE` of the local player (`HAND-2`, `CON-13`, `ELIM-3`)
- [ ] Number the copies of a card in the hand (`HAND-4`)
- [ ] Animate the cards received in the local hand (`VIEW-8`)
- [ ] Keep opponent hands private: the server sends `targetCard` only to the player who receives it (`CON-13`), and rival hands show how many cards they hold (`HAND-3`, `UI-7`). Card backs arrive in Phase 9
- [x] On the server, when the result time ends, remove the finished game, with its event sequence, and unlock the party (`WIN-5`, `CON-9`). Without it a party plays only one game until the server restarts. A party that becomes empty removes its game and cancels that wait (`PARTY-8`). The result screens are in Phase 5
- [x] Fix `CombatantRender`, which reads `card.equipment?.health.value` although a statistic with value 0 is not sent (`CON-8`): rendering an equipped card such as Policía throws
- [x] Fix `HandView.clearCards`, which removes from the array it iterates and leaves about half of the cards in the hand (`CON-11`)

## Phase 4 — Core gameplay

- [ ] Check equipment against `EQUIP-*` and implement the differences: several pieces per card, only on the player's own cards, limits on the total, and the statistic types sent only in combatants, also with a value of 0 (`CardDto`)
- [ ] Check the attack and placement rules on the server against `COMBAT-11`, `COMBAT-12`, `BOARD-5` and `BOARD-7`
- [ ] Reject an action without a required field, or whose `game` is not the one of the path, with `exception.request.malformed`, and remove `exception.player-action.selected_target_coordinate_is_null` (`CON-16`)
- [ ] Add `targetPlayer` to `MOVE_ACTION` and `EQUIP_ACTION` in `ActionDto` on the backend and in `toActionDto` on the frontend, required as in `ATTACK_ACTION`, so that `selected_target_zone_is_not_source_zone` and `equip_target_not_owned` can be reached (`CON-16`, `BOARD-7`, `EQUIP-3`)
- [ ] Reject an action or a `/ready` from a user who is not a player of the game with `exception.access_denied.wrong_game`: today membership is not checked, and an action ends in a null pointer (`CON-16`, `CON-18`)
- [ ] Fix the clone of a warrior with equipment in `MemoryCardRepository`, which adds the equipment twice: Policía has 35 damage instead of 20 (`CARD-5`, `CARD-6`)
- [ ] Remove the equipment from the hand when it is equipped: `EquipAction` keeps it, so it can be equipped without limit (`HAND-2`)
- [ ] Fix `ZoneSlot.hasAlreadyEquipment` in the frontend, which compares with `null` and always says true
- [ ] Refactor `CardController` to send backend commands
- [ ] Card placement (`PUT_ACTION`, `BOARD-5`): validate available slots, row 2 before row 1
- [ ] Card movement (`MOVE_ACTION`, `BOARD-7`): prevent invalid movement
- [ ] Attack (`ATTACK_ACTION`, `VIEW-4`): attacker selection, target selection, targeting UI (arrow or highlight while dragging)
- [ ] Equip (`EQUIP_ACTION`, `EQUIP-3`): only on the player's own cards
- [ ] Surrender with confirmation (`SURRENDER_ACTION`, `ELIM-2`, `UI-15`)
- [ ] Highlight valid targets and disable invalid ones (`UI-5`)
- [ ] End Turn button (`PASS_TURN`)
- [ ] Disable gameplay when it is not the player's turn (`UI-4`), and while animations are still playing once they exist (Phase 5)
- [ ] Prevent conflicting actions while an action is pending (`CON-19`)
- [ ] Handle rejected and duplicate/pending actions (`UI-6`, `CON-19`)
- [ ] Show clearly whose turn it is (`UI-3`)

## Phase 5 — Combat feedback and game end

- [ ] Check elimination and absence against `ELIM-*`, `ABSENT-*` and `SPEC-3` and implement the differences: `ModelMapper` drops the zones of eliminated players from `zones` (`ELIM-5`); deleting a user in a locked party throws `exception.party.locked`, so the player is never eliminated and the cleanup run stops there (`ABSENT-3`); surrender publishes no `PLAYER_DIE` (`CON-22`)
- [ ] Attack animation and hit feedback (`VIEW-5`)
- [ ] Animate armor and health changes (`VIEW-6`, `CON-21`)
- [ ] Card death animation, then remove dead cards (`COMBAT-7`, `VIEW-7`)
- [ ] Remove the equipment of a card when it dies (`EQUIP-8`)
- [ ] Leader death animation and board update (`ELIM-3`, `VIEW-7`)
- [ ] Replace local game-over detection with the backend game-end event (`WIN-3`)
- [ ] Determine winner from backend; victory and defeat over the board, with the winner's name and the countdown from a client constant, and automatic return to the party when it unlocks (`WIN-4`, `WIN-5`)
- [ ] Disable interaction after game end (`WIN-4`)
- [ ] Reject server-side any action when the game is not in progress (`TURN-7`; `PlayerTurnAction` only checks the turn today)
- [ ] Show protected cards and exposed leader state (`PROT-6`)
- [ ] Clear targeting state after an action, turn change or invalid action

## Phase 6 — Base assets and stability

- [ ] Base card set (`CARD-5`, `CARD-7`): leaders, warriors and equipment, with textures, which may be provisional in the MVP and are hosted by the backend (`CON-29`). Decide what to do with the test art left in `frontend/public/assets` (Phase 2.6). `MemoryCardRepositoryPopulator` has their statistics but no names or descriptions, which are only in `CARD-5`. A leader's `CardDto` carries no `description`. The client holds the Spanish texts of the keys
- [ ] Camera stability: zoom/pan must not break card interaction

## Phase 7 — Rounds, players and connection

- [ ] Display the current round (`UI-3`)
- [ ] Highlight the current player; distinguish the local player's cards
- [ ] Show the empty zones of eliminated players; handle elimination (`ELIM-5`, `VIEW-11`)
- [ ] Spectator mode with all interaction disabled except a button to leave, which asks for confirmation (`UI-15`); a spectator who has left stops receiving the events of the game (`SPEC-1`, `SPEC-2`, `SPEC-3`, `UI-8`)
- [ ] Connecting, disconnected, reconnecting and failure states, on every screen and with no retry limit (`UI-9`)
- [ ] Handle game-not-found, expired/invalid session, backend unavailable, failed initial sync (`UI-10`, `UI-11`, `USER-8`)
- [ ] Cancel the loading on the server when a removed player leaves fewer than 2: publish `GAME_CANCELLED`, remove the game and unlock the party (`LOAD-4`). Nothing publishes `GAME_CANCELLED` today
- [ ] Go back to the party and explain it when the loading is cancelled (`LOAD-4`)

## Phase 8 — Architecture cleanup

- [ ] Review `EventSystem` and `ActionSystem`
- [ ] Complete or remove `ActionResolver`
- [ ] Complete or remove unfinished card input logic; complete `CardClickHandler`
- [ ] Remove dead/unused architecture
- [ ] Finish remaining TODOs in comments
- [ ] Remove or fix the latent defects of unused code: the inverted condition of `Zone.isLineFull` in the frontend and `TurnManager.getPrevTurn`, which wraps out of bounds
- [ ] Weigh the pros and cons of giving each event its own `EventDetails` implementation (`CON-21`)
- [ ] Remove the debugging left in place: `createDebugUI` in `GameScene`, the red polygon in `ZoneSlotView` and `showDebugBoxes`

## Phase 9 — Board and cards

- [ ] Test layouts for 2 to 10 players (`VIEW-2`)
- [ ] Review whether the sides of the rivals should reflect the turn order around the table (`VIEW-13`)
- [ ] Verify card readability, targeting and hover previews with 10 players (`VIEW-2`)
- [ ] Review/fix existing table grid-line TODO
- [ ] Connect card preview to real backend data (types, stats, rarity, descriptions, equipment), listing every piece of equipment (`VIEW-14`, `EQUIP-4`): `GlobalCardTooltipView` only shows one
- [ ] Display opponent card backs (`VIEW-3`), adding the file, which does not exist yet, and its key to `fixed` (`CON-30`), and animate the card a rival receives (`VIEW-8`)
- [ ] Complete stacked-card hover behavior, with every piece of equipment stacked behind its combatant (`VIEW-14`)
- [ ] Decide how a hand that does not fit is shown and close `VIEW-16`: `HAND-1` sets no limit and `HandView` sizes its bounds for 10 cards. Probably the cards overlap
- [ ] Animate the leaders being placed one after the other when the board is first shown, with the first deal animation waiting for them, and set its duration per leader so that the start stays short with 10 players (`VIEW-12`)

## Phase 10 — UX

- [ ] Feedback: invalid drop, invalid target, not your turn, card cannot move, no available slot (`UI-6`)
- [ ] Round transition presentation and gameplay event notifications, including the turn and round notices (`VIEW-15`)
- [ ] Improve loading flow
- [ ] Move the hardcoded texts of the game scenes to `core/Texts.ts`, and show the key itself for a text key without a translation (`UI-2`)

## Phase 11 — Menu, lobby, user

- [ ] Check users, parties and loading against `USER-*`, `PARTY-*` and `LOAD-*` and implement the differences: default capacity of 4 (`Party` uses 5) and its range, minimum to start, rejecting a start or a configuration change on a locked party (`PARTY-3`, `PARTY-9`), the result time counted as locked (`LOAD-1`), owner succession, the default name (`USER-2`), deleting the user when the session expires (`USER-7`), `exception.party.user_not_in_party` (`PARTY-6`), name rules with the name stored trimmed (`USER-4`), the capacity below the members rejected with `max_users_out_of_range` (`PARTY-2`), name of the party, and `party:info` sent to the members when a member changes their name (`PARTY-10`)
- [ ] Main Menu: party list, loaded when its screen opens and with a refresh button, with the members out of the capacity, the join button disabled for a full party, and a rejected join shown as a message that reloads the list (`UI-1`, `UI-14`)
- [ ] Lobby: listing, owner controls, kicking, configuration (`PARTY-*`, `UI-23`), and the message for a kicked user (`PARTY-12`); leaving is already in Phase 2.5. Leaving and kicking ask for confirmation (`UI-15`)
- [ ] Show a rejected start as a message below the start button (`UI-20`), and disable leaving, kicking and the configuration while the party is locked (`UI-16`)
- [ ] Username editing from the main menu, persisted with `PUT /user`, with a rejected name shown below the field (`USER-3`, `UI-13`)
- [ ] Fix `WebUserController.setAccount`, which saves a clone of the session user over the stored one, so the user loses their sockets and stops receiving events, and ignore the `id` of the body (`USER-3`)
- [ ] Send `gameMode` in `PartyDto`: `ModelMapper.toPartyDto` never sets it (`PARTY-3`)

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
- [ ] Define how production serves the frontend and the backend under one origin, routing `/resources` like the REST paths (`CON-29`): `config.prod.mjs` has no proxy and the relative URLs depend on it
- [ ] A person tests a real browser connection with the session cookie
- [ ] Read the Socket.IO port from `crm.communication.socket-io.port`, 9092 by default, instead of hardcoding it in `SocketIOConfiguration` (`CON-1`)
- [x] Replace `IllegalAccessException` in `PlayerUsecase` with an `AccessDeniedException` that extends `UsecaseException`
- [x] Mark `VIEW-9` as **[Post-MVP]** and add sounds and cursor animations to `SCOPE-4`
- [x] State in `PARTY-5` that the party screen shows its code to be copied, and that its format is up to the server
- [x] State in `INTERFACE.md` that the party list is loaded when its screen opens and with a refresh button (`PARTY-4`)
- [x] State in `UI-13` that the interface does not offer renaming inside a party, although the server accepts it (`USER-3`)
- [x] State in `SPEC-3` and `UI-8` that a spectator has a leave button, as an exception to the disabled interaction, and stops receiving the events of the game after leaving
- [x] State in `INTERFACE.md` that surrendering asks for confirmation (`ELIM-2`)
- [x] State in `USER-4` that spaces are trimmed before validating the length, and in `USER-2` that the default name follows `USER-4`

## Post-MVP

- Spells (including exposing `UseCardAction` and `UseSpellAction` in the API), autotrigger (`R`) spells and complex equipment effects
- Teams: a team model in the backend (from the game configuration and from spells) and its exposure to the frontend (for example a `team` in each `ZoneDto`), and in the interface: display, team victory and dead teammates
- Vote to kick a player in the middle of a game (the MVP has no turn time limit, so a disconnected player blocks the game until their user is deleted, and one who stays connected without acting blocks it indefinitely)
- Several decks instead of a single one per server: today one `Deck` bean, which is also the `CardRepository`, is injected into every game mode, and `PersistenceConfiguration` backs off if the application provides its own `Deck`; decide how a deck is chosen (per party, per game mode, uploaded as a zip, `VAR-3`), who uploads it, its format, validation and lifetime before designing it
- Leaders do not repeat when the deck has enough for every player
- Names and descriptions for the leaders (`CARD-5`)
- Balance of the base content: higher rarities do not stand out (Alien, Epic, has 5 damage and 15 health, worse than Perro, Uncommon, with 10 and 10; Policía reaches 20 damage with Pistolón), and Argoth and Odin are not dealt, because the schedule has no slots for their rarities
- Equipment on enemy cards
- Rivals see the type and rarity of a dealt card, without knowing which card it is (`CON-13`)
- Spectators from outside the game
- English translation
- Discussion: defensive programming between actions and the domain. Some rules are validated twice (for example `MoveAction.checkContext` and `Zone.putCombatant`); decide where each rule lives
- Infinite stats and true damage
- Excess damage of Legendary cards carried over to health (`COMBAT-5`), once Legendary cards are dealt
- Combat log and dynamic localization
- Premium animations (particles, special effects)
- Cursor animations
- Centralized audio and sounds for placement, attack, death, turn and round changes, victory and defeat (`VIEW-9`)
- Advanced trolling cards, green/red indicators, center-table behavior
- Settings screen, audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
- Order of the state sent when a socket is bound (`CON-23`): with Engine.IO v4, `netty-socketio` 2.0.12 runs the connect listeners on the handshake, so `SocketIOConnectionManager` sends the state before the namespace connect ack. The client works around it by starting the sync on `connecting`/`reconnecting` (`SessionSystem`), which blanks the screen for the whole reconnection. The library has no hook after the ack; the options are a client request for the state (a new event, changing `CON-23`) or a delayed send
