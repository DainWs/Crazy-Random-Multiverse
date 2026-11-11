# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them. Closed phases are in `ROADMAP-ARCHIVE.md`.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

**MVP scope:** Phases 1 to 13 (including 2.5, 2.6 and 5.5). Phase 14 and the Post-MVP section are out of it.

## Closed decisions

| Decision | Choice |
|---|---|
| Realtime transport | Socket.IO (replaces STOMP) |
| Commands | REST `POST /game/{gameCode}/action` |
| Game state authority | Backend. The frontend never mutates state before server confirmation |
| Rejected requests | The HTTP response says it: 2xx or 400 with an `exception.*` key (`CON-18`). There is no socket channel for errors (`CON-20`) |
| Event order | Sending events to the clients stays on a thread pool, so they can arrive out of order. The client orders them by `sequence` (`CON-12`) |
| Frontend engine | Phaser 4 |
| Visual and smoke tests | Playwright against the real application, with doubles of REST and the socket at the network boundary |
| Reference images | Generated and compared on the developer's machine for now, ready to move to Docker |
| Accepted risk: turn without limit | A player can block the game during their turn (`TURN-4`) |
| Accepted risk: load without limit | A player can block the start of the game (`LOAD-3`) |
| Accepted risk: wrong hand | The hand can stay wrong until the next `GAME_SYNC` (`CON-12`) |
| Accepted risk: request without response | A request that reaches the server and is never answered has no client time limit, so the client waits until the page is reloaded (`UI-24`, `LOAD-7`) |
| Accepted risk: waiting player removed | The session of a waiting player can expire before that of the blocking one, so the waiting player is eliminated instead, during the turn (`TURN-4`) or the load (`LOAD-3`) |

## Phase 9 — Architecture cleanup

Started at: `12df6bd`

- [x] Review `EventSystem`, and whether the animation system of Phase 5.5 (`core/`) joins it: nothing listened to it, so it is removed, and `AnimationSystem` stays apart
- [x] Complete or remove `ActionResolver` (removed with `ActionSystem` in Phase 4). Done before the phase started, so it has no `Started at`
- [x] Complete or remove unfinished card input logic; complete `CardClickHandler`: it already follows `VIEW-4`, so the empty `onPointerDown` and the logging of the dispatcher were removed
- [x] Remove dead/unused architecture: `CardActionPerspective` stays, kept for the effects of the Post-MVP section
- [x] Finish remaining TODOs in comments: the ones of the spells now name their Post-MVP rule, and the ones of the grid, the stacked cards, the equipment tooltip and the card texts manifest stay with the phase that owns them
- [x] Remove or fix the latent defects of unused code: the inverted condition of `Zone.isLineFull` in the frontend and `TurnManager.getPrevTurn`, which wraps out of bounds. Both were removed with the code that only they served
- [x] Weigh the pros and cons of giving each event its own `EventDetails` implementation (`CON-21`): decided not to split it. About 7 distinct shapes over 18 codes do not justify a class and a mapper branch each (`CODESTYLE` section 2), and the contract does not change. The cost accepted is the nullable fields and the `has*()` checks of `CommunicationMapper`
- [x] Remove the debugging left in place: `createDebugUI` in `GameScene`, the red polygon in `ZoneSlotView` and `showDebugBoxes`

## Phase 10 — Board and cards

- [ ] Test layouts for 2 to 10 players (`VIEW-2`)
- [ ] Review whether the sides of the rivals should reflect the turn order around the table (`VIEW-13`)
- [ ] Verify card readability, targeting and hover previews with 10 players (`VIEW-2`)
- [ ] Review/fix existing table grid-line TODO
- [ ] Connect card preview to real backend data (types, stats, rarity, descriptions, equipment), listing every piece of equipment (`VIEW-14`, `EQUIP-4`): `GlobalCardTooltipView` only shows one
- [ ] Stop showing the rival hands (`HAND-3`, `UI-7`): remove `handSize` from `PlayerDto` in both applications, and the `Mano:` label that `ZoneView` draws in each rival zone. Regenerate the reference images that show the label: T6 of `ROADMAP-TEST.md` approved them with cards in the rival hands
- [ ] Complete stacked-card hover behavior, with every piece of equipment stacked behind its combatant (`VIEW-14`)
- [ ] Animate the leaders being placed one after the other when the board is first shown, with the first deal animation waiting for them, and set its duration per leader so that the start stays short with 10 players (`VIEW-12`)
- [ ] Reposition the board, the hand and the HUD when the window changes size (`VIEW-24`): `App.vue` uses `Scale.RESIZE` and nothing reacts to it, so at 1100×620 the own leader, rows and buttons are out of view, and at 1920 wide the board is off-center. Only desktop windows: the responsive layouts of `VIEW-10` stay Post-MVP
- [ ] Fix the hand staying expanded after the pointer leaves it (`VIEW-16`). Seen twice with simulated mouse events in a game of two, but it folded in a game of three, and the cause was not found, so confirm it with a real mouse first ("Pending checks" of `ROADMAP-TEST.md`)
- [ ] Fix the slot of the incoming cards in `HandView.addCards` (`VIEW-8`): the position uses `i` instead of the index in the hand, and `newIndex` drifts because the cards are pushed inside the loop. Target and depth are wrong until `updateCards` runs at the end of the animation. Probably why, in 2 of 3 sessions of a game of three, only one of the 2 first cards was shown until the hand was hovered
- [ ] Make the expansion of the hand animate: `HandView.updateBounds` sets its `y` on every `prerender`, which overrides the tween of `HandAnimator`. Read from the code, not seen on screen
- [ ] Reduce the size of the cards of the hand: expanded they measure about 200×300 at 1600×900, a third of the screen height, and two cards take about 410 px. With 5 cards the expanded hand covers the left column of the own zone. They stay larger than the cards of the board, whose smaller size is what lets the whole board fit. The target size is not set: it is decided with the user at the start of the phase, looking at it on screen
- [ ] Center the hand on the screen according to the cards it holds (`VIEW-25`): its bounds are sized for 10 cards and anchored to the left
- [ ] Make the values of the cards of the board readable without hovering (`VIEW-2`): with 2 players a card is about 65 px wide, and about 50 px in the rival zone, while the table between the zones is mostly empty
- [ ] Lower the contrast of the grid of the table, which competes with the cards (`VIEW-26`)
- [ ] Fix the cards of the side zones (`VIEW-1`, `VIEW-2`): they are drawn upright over rotated slots, off-center, overlapping the neighboring cards
- [ ] Close the side panel when the hovered card disappears (`VIEW-14`): after the elimination of a player the panel of a card of their hand stayed open, up to the result screen
- [ ] Draw the name and the values of an equipment card: `EquipmentRender` draws nothing, so it shows two blank areas in the hand and in the side panel

## Phase 11 — UX

- [ ] Distinguish the local player's cards from the rivals' (needs a new `VIEW` rule)
- [ ] Feedback: invalid drop, invalid target, not your turn, card cannot move, no available slot (`UI-25`)
- [x] Stop a slow click from grabbing the card when attacking (`VIEW-4`): `DRAG_TIME_THRESHOLD`, the time after which Phaser starts a drag without the pointer moving and below which `CardClickHandler` counts a click, was raised from 100 to 150 ms (`53e8a60`, `4320859`). Done before the phase started, so it has no `Started at`. A click held 150 ms or more still grabs the card
- [ ] Round transition presentation and gameplay event notifications, including the turn and round notices (`VIEW-15`)
- [ ] Improve loading flow. It needs a rule first: what to improve is not defined yet
- [ ] Move the hardcoded texts of the game scenes to `core/Texts.ts`, and show the key itself for a text key without a translation (`UI-2`)
- [ ] Make the highlight of the valid targets easier to see, and stop the arrow from covering the target (`UI-5`, `VIEW-4`)
- [ ] Mark the own cards that can attack. It needs a new `VIEW` rule: `VIEW-17` only rules out marks for protection, and today nothing marks them
- [ ] Put a panel behind the texts of the result screen: the countdown overlaps the slots of the board (`VIEW-23`)
- [ ] Redo the glow of the leader of the player with the turn (`VIEW-20`): today it is five stacked strokes over the corners of the slot and looks like a halo with thin lines at the corners. Use a Phaser 4 glow filter or a soft texture, with a discreet pulse that does not restart when the board is redrawn. Regenerate the 11 reference images that contain it
- [ ] Improve the look of the zone of an eliminated player (`VIEW-11`): the veil is a flat black fill per slot and the label "Eliminado" is a plain red text. Make the veil cover the zone as one piece and give the label a panel or a style that fits the table
- [ ] Improve the look of the connection notice (`UI-9`), the notices of `SessionNotice` (`UI-10`, `UI-24`, `LOAD-4`) and the leave button and its dialog (`UI-15`): they are unstyled, with default controls and a plain dark veil
- [ ] Improve the look of the HUD, the confirmation dialog and the spectator state (`UI-3`, `UI-8`): make clear that the player is watching and cannot act, beyond hiding the buttons
- [ ] Review the look of every effect of the game together, so that the glow, the veils, the notices, the combat feedback (`VIEW-5` to `VIEW-7`) and the transitions share one style. Regenerate the reference images when it changes
- [ ] Set the title of the page: `frontend/index.html` still says `Phaser Vue Template`

## Phase 12 — Menu, lobby, user

- [ ] Check users, parties and loading against `USER-*`, `PARTY-*` and `LOAD-*` and implement the differences: default capacity of 4 (`Party` uses 5) and its range, minimum to start, rejecting a start or a configuration change on a locked party (`PARTY-3`, `PARTY-9`), the result time counted as locked (`LOAD-1`), owner succession, the default name (`USER-2`), deleting the user when the session expires (`USER-7`), `exception.party.user_not_in_party` (`PARTY-6`), name rules with the name stored trimmed (`USER-4`), the capacity below the members rejected with `max_users_out_of_range` (`PARTY-2`), a `PUT /party/{partyCode}` without `gameMode` or `maxUsers` rejected with `exception.request.malformed` instead of the 500 it gets today (`CON-35`, `CON-37`), a `PUT /user` without `username` rejected with `exception.request.malformed` (`CON-37`), name of the party, and `party:info` sent to the members when a member changes their name (`PARTY-10`)
- [ ] Main Menu: party list, loaded when its screen opens and with a refresh button, with the members out of the capacity, the join button disabled for a full party, and a rejected join shown as a message that reloads the list (`UI-1`, `UI-14`)
- [ ] Lobby: listing, owner controls, kicking, configuration (`PARTY-*`, `UI-23`), and the message for a kicked user (`PARTY-12`); leaving is already in Phase 2.5. Leaving and kicking ask for confirmation (`UI-15`)
- [ ] Show a rejected start as a message below the start button (`UI-20`), and disable kicking and the configuration while the party is locked, keeping leaving enabled (`UI-16`)
- [ ] Username editing from the main menu, persisted with `PUT /user`, with a rejected name shown below the field (`USER-3`, `UI-13`)
- [ ] Fix `WebUserController.setAccount`, which saves a clone of the session user over the stored one, so the user loses their sockets and stops receiving events, and ignore the `id` of the body (`CON-35`)
- [ ] Send `gameMode` in `PartyDto`: `ModelMapper.toPartyDto` never sets it (`PARTY-3`)
- [ ] Name the party after its owner (`PARTY-11`): `ModelMapper` sends `Party of <name>`
- [ ] Style the main menu and the party screen, which use the default controls of the browser, and show the members with the owner first and the others in the order they joined (`UI-19`, `CON-38`): today the owner can be last, because `Party` keeps them in a `HashMap`

## Phase 13 — Testing

Cross-cutting tests are in `ROADMAP-TEST.md`.

- [ ] Complete T13 of `ROADMAP-TEST.md`

## Phase 14 — AI

The AI is rethought around an LLM, starting from nothing. The current implementation is removed in Phase 2.

- [ ] Discuss the specifications of the LLM model

## Pending tasks

Not tied to a phase.

- [x] Resolve the apparent `ActionMapper.toPlayerCode()` recursion bug
- [ ] Fix the order of the state sent when a socket is bound (`CON-23`): with Engine.IO v4, `netty-socketio` 2.0.12 runs the connect listeners on the handshake, so `SocketIOConnectionManager` sends the state before the namespace connect ack. The client works around it by starting the sync on `connecting`/`reconnecting` (`SessionSystem`), which blanks the screen for the whole reconnection, behind the notice of `UI-9`. The library has no hook after the ack; the options are a client request for the state (a new event, changing `CON-23`) or a delayed send
- [ ] Ignore the events of a game the user no longer has, remembering the code of the last one, and discard a `GAME_SYNC` or `GAME_LOADING` of the followed game whose `sequence` is lower than that of the last event applied (`CON-12`, `SPEC-3`): `GameStateApi` applies every `game:event`, and `GameEventQueue` applies every snapshot, rewinding the queue, so one in flight when a spectator leaves, or when a socket is bound after the game ended (`CON-23`), would rebuild the game state while the user is in the main menu or the party, and a late one of the previous game would restart the queue of the new one. The server stops sending them, so it only happens in a race
- [ ] Remove `EventPublisher.publish(EventCode)` and its two implementations: nothing calls it (`Game` always sends details), and it builds `new EventDetails(null)`, whose `getGameCode()` would fail with a null game
- [ ] Make the HUD follow the snapshot of the board it is showing, not the live state (`UI-3`): `GameHudView` reads `StoreSystem` on every frame, so the round, the turn and the spectator buttons can run ahead of the animations of the board (`CON-12`)
- [ ] Define how production serves the frontend and the backend under one origin, routing `/resources` like the REST paths (`CON-29`): `config.prod.mjs` has no proxy and the relative URLs depend on it
- [ ] Read the Socket.IO port from `crm.communication.socket-io.port`, 9092 by default, instead of hardcoding it in `SocketIOConfiguration` (`CON-1`)
- [ ] Replace any use of `exception.game.not_in_progress` with `exception.player-action.game_not_in_progress`, the only key of `TURN-7` in the contract. `PassTurnAction` returned the old one on 2026-11-05; the code was not checked when the key was removed from the contract
- [x] Decide what to do with `GameBehaviorIntegrationTest`: kept as it is, abstract and with no subclass. The test of T5 of `ROADMAP-TEST.md` does not use it, because it needs the real services. `GameEventWatcher`, `GameEventDebuger`, `PartyPopulator`, `UserPopulator` and `PersistenceTestConfiguration` are only referenced among themselves
- [ ] Send `damage`, `armor` and `health` of `CardDto` also with a value of 0, and `maxHealth` on combatants, and make them required in the frontend types (`CON-33`)
- [ ] Stop waiting for a missing event after 10 seconds and go on with the next one, discarding it if it arrives later, with the time in a client constant (`CON-12`)
- [ ] Reject `GET /game/{gameCode}/resources` with `exception.access_denied.wrong_game` for a spectator who left the game (`CON-28`, `SPEC-3`): `LoadUsecase.getManifest` only checks that the user is a player of it, and `Player.hasLeft` is ignored
- [ ] Find the frontend test that failed once in a full run (1 of 454, `npx vitest run`) and passed in the next runs, so it may be flaky. Its name was not recorded
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
- Vote to kick a player in the middle of a game (the MVP has no turn time limit, so a disconnected player blocks the game until their user is deleted, and one who stays connected without acting blocks it until a session of the game expires, `TURN-4`, `USER-7`)
- Several decks instead of a single one per server: today one `Deck` bean, which is also the `CardRepository`, is injected into every game mode, and `PersistenceConfiguration` backs off if the application provides its own `Deck`; decide how a deck is chosen (per party, per game mode, uploaded as a zip, `VAR-3`), who uploads it, its format, validation and lifetime before designing it
- Leaders do not repeat when the deck has enough for every player
- Names and descriptions for the leaders (`CARD-5`)
- Balance of the base content: higher rarities do not stand out (Alien, Epic, has 5 damage and 15 health, worse than Perro, Uncommon, with 10 and 10; Policía reaches 20 damage with Pistolón), and Argoth and Odin are not dealt, because the schedule has no slots for their rarities
- Equipment on enemy cards
- Losing equipment (`EQUIP-7`), and equipment that disappears when its card permanently changes owner (`EQUIP-8`)
- Cards that can attack more than once per turn (`BOARD-9`)
- Excess damage carried over to health from 100 physical damage (`COMBAT-10`), once its meaning is resolved
- Rival hands shown as backs, one for each type and warrior rarity, through `PlayerDto.handBacks` and their keys in `fixed`, with the back a rival receives animated (`CON-13`, `VIEW-3`, `VIEW-8`)
- Spectators from outside the game
- English translation
- Discussion: defensive programming between actions and the domain. Some rules are validated twice (for example `MoveAction.checkContext` and `Zone.putCombatant`); decide where each rule lives
- Infinite stats and true damage
- Excess damage of Legendary cards carried over to health (`COMBAT-5`), once Legendary cards are dealt
- Combat log and dynamic localization
- Premium animations (particles, special effects)
- Effects that grow with the rarity of a card, like the audio variants: a glowing card border, and a screen that dims with a heartbeat when it attacks. `CalmTargetingOverlay` and `CardActionPerspective` are kept for this and are not used by the click attack of Phase 4 (`FX-*` in `specs/VISUAL-EFFECTS.md`)
- Cursor animations
- Centralized audio and sounds for placement, attack, death, turn and round changes, victory and defeat (`VIEW-9`), with more variants for rarer cards once `VIEW-22` is resolved (`VIEW-21`)
- Advanced trolling cards, green/red indicators, center-table behavior
- Interface skins chosen by each player, and turning the effects off by group (`FX-10` to `FX-15`)
- Settings screen, audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
