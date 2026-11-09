# ROADMAP-ARCHIVE

Closed phases of `ROADMAP.md`, kept as history. What a bullet says about the code was true when it was written.

## Phase 1 — Backend contract (blockers)

Started at: `f122c6a` · Finished at: `2137753`

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

Started at: `2137753` · Finished at: `c0ba577`

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
- [x] Align the contract with `specs/CONTRACT.md` (the new error keys that need a rule not built yet arrive with that rule in Phases 3, 4, 5 and 12): `equipment` as a list in `CardDto`; `round` in `GameDto`; `handSize` in `PlayerDto`; no `health` or `maxHealth` in `ZoneDto`; `combatant` absent in an empty slot (`CON-14`); the `attackAvailable` and `targetable` flags (`PROT-4`, `CON-15`); remove `GAME_RESTART`; add `GAME_CANCELLED` and the details of `PLAYER_ATTACK_CARD` (`CON-21`); add the new error keys and rename those marked as renamed; no `code` in the body of `PUT /party`; `maxUsers` in the bodies of `POST` and `PUT /party`; a last `party:info` to a kicked user (`PARTY-12`); `catalogCode` instead of `code` in `CardDto` (`CON-26`); effective statistics in `CardDto` (`CON-27`); `locked` in `PartyDto`
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

Started at: `4506182` · Finished at: `c4f0e15`

Just enough to create a real game from the interface, which Phase 3 needs. The rest of the lobby is in Phase 12.

- [x] Move the party and the user state from `StoreSystem` to `SessionSystem` as read-only `shallowRef`s, and update its tests. Separate refactoring commit (`FRONTEND-CODESTYLE.md`, section 2)
- [x] Choose the screen from the user state in `App.vue`, waiting for `user:synced`, and start the loading and game scenes only when the state enters them; `Preloader` no longer jumps to `GameLoad` (`UI-17`, `CON-23`)
- [x] Main menu: create a party with the default capacity and mode, and join one with its code, showing rejections below the field (`UI-1`, `UI-18`, `PARTY-1`, `PARTY-5`)
- [x] Party screen: name, members out of capacity, owner marked, members from `party:info`, the code to copy, leaving, and starting the game for the owner, disabled while the party is locked or has fewer than 2 members (`UI-19`, `UI-20`, `UI-16`, `PARTY-9`, `PARTY-10`, `LOAD-1`)

## Phase 2.6 — Game resource loading

Started at: `fa5d9ea` · Finished at: `b6ee2aa`

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

Started at: `b6ee2aa` · Finished at: `6515c9a`

This phase synchronizes the state and renders it without animating it, except for the cards received. The actions arrive in Phase 4 and the combat feedback in Phase 5.5.

- [x] Publish the start of a round in the order of `CON-22`: `ROUND_CHANGE`, one `PLAYER_RECEIVE_CARD` per card dealt, player by player in the order of `zones`, then `TURN_CHANGE`, and the first round and turn like any other. `zones` starts with the starting player (`GameDto`)
- [x] Check the game flow against `specs/GAME-FLOW.md` and implement the differences: the leaders placed when the game is created, without `PLAYER_RECEIVE_CARD` (`SETUP-2`; today a player seated before a random starting player never gets one), the whole turn order drawn at random (`SETUP-3`; today only the starting player is), what a round is, rounds numbered from 1 (`GameDto.round`), dealing to everyone at the start of the round, equipment in the spell slots, unlimited deck, missing categories and a deck without leaders (`DECK-4`)
- [x] Reject the attack of a protected leader with `exception.player-action.selected_source_leader_is_protected` (`PROT-4`): `attackAvailable` already excludes it, but `AttackAction` accepts it. `hasLeaderInBoard` in the frontend is unrelated and has no callers, so it goes with the cleanup of Phase 9
- [x] A newly placed card must not attack on the turn it is placed (`BOARD-8`), although it can move and be equipped (`BOARD-6`, `EQUIP-3`): `Combatant.canAttack()` ignores it, so `attackAvailable` is `true` right after placement
- [x] Check the state of the turn against `CON-32` and implement the differences: `playerWithTurn` only changes with `TURN_CHANGE` and is not sent before the first one (`GameDto`), and attacks and cooldowns are reset before `TURN_CHANGE` is published
- [x] Feed `StoreSystem` with the real game state from `GAME_LOADING` on, independently of the scenes, and clear it when the user no longer has a game (`ARCH-2`, `LOAD-6`, `UI-17`)
- [x] Synchronize `GameDto` from backend events (round, turn, players, zones, board cards), replacing the state with the `game` of each event (`CON-10`)
- [x] Map the `game` and the cards of the details of each event for each recipient when the event is published, not when it is sent: the multicaster runs each listener on its own thread, so today they come from the live game (`CON-10`)
- [x] Queue the events by `sequence` and apply them in that order, waiting for the missing ones, discard those already reflected in a snapshot, always apply the snapshots, and start over with each game (`CON-12`)
- [x] Reconcile state after Socket.IO events and after reconnection (`CON-11`, `CON-23`)
- [x] Remove mocked game state, zones and hand, and the unused `saveHand` and `loadHand` of `LocalStorageApi`
- [x] Update Phaser views from authoritative state
- [x] Map the backend rows (row 0 is the leader row) to the frontend zone organization, with each leader at the edge of the table and the local zone at the bottom (`CON-14`, `VIEW-1`). `Battlefield` groups the zones by a team the contract does not have: in the MVP every other zone is an enemy (`VIEW-13`)
- [x] Implement the real hand: cleared and restored from `GAME_SYNC`, and a received card added only if the event carries it, without hardcoding the round schedule (`CON-11`, `CON-13`, `ROUND-4`)
- [x] Remove played cards from the hand when their event arrives, and empty it with the `PLAYER_DIE` of the local player (`HAND-2`, `CON-13`, `ELIM-3`)
- [x] Number the copies of a card in the hand (`HAND-4`)
- [x] Animate the cards received in the local hand (`VIEW-8`)
- [x] Keep opponent hands private: the server sends `targetCard` only to the player who receives it (`CON-13`), and rival hands show how many cards they hold (`HAND-3`, `UI-7`). Card backs arrive in Phase 10
- [x] On the server, when the result time ends, remove the finished game, with its event sequence, and unlock the party (`WIN-5`, `CON-9`). Without it a party plays only one game until the server restarts. A party that becomes empty removes its game and cancels that wait (`PARTY-8`). The result screens are in Phase 5
- [x] Fix `CombatantRender`, which reads `card.equipment?.health.value` although a statistic with value 0 is not sent (`CON-8`): rendering an equipped card such as Policía throws
- [x] Fix `HandView.clearCards`, which removes from the array it iterates and leaves about half of the cards in the hand (`CON-11`)

## Phase 4 — Core gameplay

Started at: `6515c9a` · Finished at: `754e61d`

- [x] Check equipment against `EQUIP-*` and implement the differences: several pieces per card, only on the player's own cards, limits on the total, and the statistic types sent only in combatants, also with a value of 0 (`CardDto`)
- [x] Check the attack and placement rules on the server against `COMBAT-11`, `COMBAT-12`, `BOARD-5` and `BOARD-7`
- [x] Reject an action without a required field, or whose `game` is not the one of the path, with `exception.request.malformed`, and remove `exception.player-action.selected_target_coordinate_is_null` (`CON-16`)
- [x] Add `targetPlayer` to `MOVE_ACTION` and `EQUIP_ACTION` in `ActionDto` on the backend and in `toActionDto` on the frontend, required as in `ATTACK_ACTION`, so that `selected_target_zone_is_not_source_zone` and `equip_target_not_owned` can be reached (`CON-16`, `BOARD-7`, `EQUIP-3`)
- [x] Reject an action or a `/ready` from a user who is not a player of the game with `exception.access_denied.wrong_game`: today membership is not checked, and an action ends in a null pointer (`CON-16`, `CON-18`)
- [x] Fix the clone of a warrior with equipment in `MemoryCardRepository`, which adds the equipment twice: Policía has 35 damage instead of 20 (`CARD-5`, `CARD-6`)
- [x] Remove the equipment from the hand when it is equipped: `EquipAction` keeps it, so it can be equipped without limit (`HAND-2`)
- [x] Fix `ZoneSlot.hasAlreadyEquipment` in the frontend, which compares with `null` and always says true
- [x] Refactor `CardController` to send backend commands
- [x] Card placement (`PUT_ACTION`, `BOARD-5`): validate available slots, row 2 before row 1
- [x] Card movement (`MOVE_ACTION`, `BOARD-7`): prevent invalid movement
- [x] Attack (`ATTACK_ACTION`, `VIEW-4`): attacker selection, target selection, targeting UI (arrow or highlight while dragging)
- [x] Equip (`EQUIP_ACTION`, `EQUIP-3`): only on the player's own cards
- [x] Surrender with confirmation (`SURRENDER_ACTION`, `ELIM-2`, `UI-15`)
- [x] Highlight valid targets and disable invalid ones (`UI-5`)
- [x] End Turn button (`PASS_TURN`)
- [x] Disable gameplay when it is not the player's turn (`UI-4`), and while animations are still playing once they exist (Phase 5.5)
- [x] Prevent conflicting actions while an action is pending (`CON-19`)
- [x] Handle rejected and duplicate/pending actions (`UI-6`, `CON-19`)
- [x] Show clearly whose turn it is (`UI-3`)

## Phase 5 — Elimination and game end

Started at: `754e61d` · Finished at: `faf6a51`

- [x] Check elimination and absence against `ELIM-*`, `ABSENT-*` and `SPEC-3` and implement the differences: `ModelMapper` drops the zones of eliminated players from `zones` (`ELIM-5`); deleting a user in a locked party throws `exception.party.locked`, so the player is never eliminated and the cleanup run stops there (`ABSENT-3`); surrender publishes no `PLAYER_DIE` (`CON-22`)
- [x] Cancel the loading when a player removed during it leaves fewer than 2 (`LOAD-4`, `CON-22`): publish `GAME_CANCELLED`, remove the game and unlock the party with a `party:info`. Nobody publishes `GAME_CANCELLED` today, and a player removed during the load must not block the start (`LOAD-3`)
- [x] Replace local game-over detection with the backend game-end event (`WIN-3`)
- [x] Determine winner from backend; victory and defeat over the board, with the winner's name and the countdown from a client constant, and automatic return to the party when it unlocks (`WIN-4`, `WIN-5`)
- [x] Disable interaction after game end (`WIN-4`)
- [x] Reject server-side any action when the game is not in progress (`TURN-7`; `PlayerTurnAction` only checks the turn today)
- [x] Clear targeting state after an action, turn change or invalid action

## Phase 5.5 — Combat feedback

Started at: `faf6a51` · Finished at: `d2aac50`

Split from Phase 5 so that each session stays small. It needs the zones of eliminated players that Phase 5 keeps in `zones`. The store applies each event at once (`CON-12`); the animations play in order from the snapshot of each event, and the board is drawn from that snapshot once its animation ends (`UI-4`, `VIEW-12`). This needs a view-side animation queue that is not in `CODESTYLE.md`: propose it and get it confirmed before writing it.

- [x] Disable gameplay while animations are still playing (`UI-4`): `AnimationSystem` queues the animations and `CardController.canAct` waits for it
- [x] Attack animation and hit feedback (`VIEW-5`)
- [x] Animate armor and health changes: the values count down and a floating text rises over the target (`VIEW-6`, `CON-21`)
- [x] Card death animation, then remove dead cards (`COMBAT-7`, `VIEW-7`)
- [x] Remove the equipment of a card when it dies (`EQUIP-8`, `VIEW-18`): no animation of its own, it fades with its card and the next board has none
- [x] Leader death animation and board update (`ELIM-3`, `VIEW-7`)
- [x] Show protected cards and exposed leader state (`PROT-6`): no mark of their own, only the highlight of valid targets (`VIEW-17`)

## Phase 6 — Phaser 4 migration

Started at: `d2aac50` · Finished at: `e92fea0`

Moves the frontend from Phaser 3 to Phaser 4 before more view work is built on it. It changes no behavior: every `VIEW-*` and `UI-*` rule keeps holding.

- [x] Update `phaser` to the latest 4.x in `frontend/package.json`, and remove `phaser3spectorjs` if Phaser 4 does not need it
- [x] Replace the removed APIs in use: `setTintFill` and `tintFill` (`setTint` with `setTintMode`), `Geom.Point` (`Vector2`), `Math.PI2` (`Math.TAU`), `Phaser.Struct.Set` and `Phaser.Struct.Map` (native `Set` and `Map`), `TextureManager.generate`, `Mesh` and `Plane`
- [x] Review every use of `Math.TAU`, which changes its value without an error: it was `PI / 2` and is now `PI * 2` (`Math.PI_OVER_2` is the old value)
- [x] Replace masks and FX with filters: `BitmapMask` with the `Mask` filter, and `preFX` and `postFX` with `filters.internal` and `filters.external`
- [x] Call `render()` after drawing on a `DynamicTexture` or `RenderTexture`, which no longer draw at once
- [x] Review what depends on the renderer internals: custom pipelines, `Shader` objects, direct `gl` calls and direct access to `Camera#matrix`
- [x] Check the sharpness of the cards and texts with `roundPixels`, which is now `false` by default: `pixelArt` still enables it, so the configuration stays as it was. The visual check is in "Pending checks" of `ROADMAP-TEST.md`
- [x] Update the Phaser version named in `CLAUDE.md`, `CODESTYLE.md` and `FRONTEND-CODESTYLE.md`

## Phase 7 — Base assets and stability

Started at: `f10329f` · Finished at: `47be378`

Requires T2.6 to T6 of `ROADMAP-TEST.md` to be finished.

- [x] Base card set (`CARD-5`, `CARD-7`): leaders, warriors and equipment, with textures, which may be provisional in the MVP and are hosted by the backend (`CON-29`). Decide what to do with the test art left in `frontend/public/assets` (Phase 2.6). `MemoryCardRepositoryPopulator` has their statistics but no names or descriptions, which are only in `CARD-5`. A leader's `CardDto` carries no `description`. The client holds the Spanish texts of the keys
- [x] Camera stability: zoom/pan must not break card interaction
- [x] Stop the copies of a card from sharing one instance (`DECK-2`, `HAND-4`, `COMBAT-7`): `Hand.grab` returns the last copy but `cards.remove` drops the first, because `Card.equals` compares by code. The second copy played is the same object on the board, so damage reaches both and, when one dies, the other stays with 0 health, showing none and still targetable. `EquipAction` also uses `grab`
- [x] Keep the HUD inside the screen at any camera zoom (`UI-3`): `GameHudLayout` uses screen positions and `setScrollFactor(0)` does not undo the zoom, so at 1.1 with 2 players the turn text and both buttons are cut off
- [x] Add the Spanish names and descriptions of the cards to the client (`UI-2`): `core/Texts.ts` has none, so every card shows its key, such as `card.warrior.3.name`
- [x] Provide the card images the manifest lists: `/resources/cards/leader/1.png` and warriors such as `/resources/cards/warrior/common/0.png` answer 404. Decide whether a redraw counts as showing the card again (`UI-21`): a failed image is requested on every redraw, 51 times in one short game
- [x] When the rest of the phase is finished, play the game in a browser and look for bugs and for things that can be improved (animations, positions, etc.). For example, whether the hand should be adapted so that its cards are not so large, which is only an example and not necessarily true. Record each finding as a bullet in the phase it fits best

## Phase 8 — Rounds, players and connection

Started at: `eefedd9` · Finished at: `0cab669`

- [x] Display the current round (`UI-3`)
- [x] Highlight the current player (`VIEW-20`)
- [x] Show the empty zones of eliminated players; handle elimination (`ELIM-5`, `VIEW-11`)
- [x] Spectator mode with all interaction disabled except a button to leave, which asks for confirmation (`UI-15`); a spectator who has left stops receiving the events of the game (`SPEC-1`, `SPEC-2`, `SPEC-3`, `UI-8`)
- [x] Connecting, disconnected, reconnecting and failure states, on every screen and with no retry limit (`UI-9`)
- [x] Handle game-not-found, expired/invalid session, backend unavailable, failed initial sync (`UI-10`, `UI-24`, `USER-8`)
- [x] Cancel the loading on the server when a removed player leaves fewer than 2: publish `GAME_CANCELLED`, remove the game and unlock the party (`LOAD-4`; done in Phase 5)
- [x] Go back to the party and explain it when the loading is cancelled (`LOAD-4`)
- [x] Let a spectator leave a locked party with `POST /party/{partyCode}/leave` and stop sending them the events of the game (`SPEC-3`): `Party.remove` rejected it with `exception.party.locked`
