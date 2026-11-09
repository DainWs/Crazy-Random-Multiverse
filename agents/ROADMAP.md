# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them. Closed phases are in `ROADMAP-ARCHIVE.md`.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

**MVP scope:** Phases 1 to 13 (including 2.5 and 2.6). Phase 14 and the Post-MVP section are out of it.

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

## Phase 7 — Base assets and stability

Started at: `f10329f`

Requires T2.6 to T6 of `ROADMAP-TEST.md` to be finished.

- [ ] Base card set (`CARD-5`, `CARD-7`): leaders, warriors and equipment, with textures, which may be provisional in the MVP and are hosted by the backend (`CON-29`). Decide what to do with the test art left in `frontend/public/assets` (Phase 2.6). `MemoryCardRepositoryPopulator` has their statistics but no names or descriptions, which are only in `CARD-5`. A leader's `CardDto` carries no `description`. The client holds the Spanish texts of the keys
- [ ] Camera stability: zoom/pan must not break card interaction
- [ ] Stop the copies of a card from sharing one instance (`DECK-2`, `HAND-4`, `COMBAT-7`): `Hand.grab` returns the last copy but `cards.remove` drops the first, because `Card.equals` compares by code. The second copy played is the same object on the board, so damage reaches both and, when one dies, the other stays with 0 health, showing none and still targetable. `EquipAction` also uses `grab`
- [ ] Keep the HUD inside the screen at any camera zoom (`UI-3`): `GameHudLayout` uses screen positions and `setScrollFactor(0)` does not undo the zoom, so at 1.1 with 2 players the turn text and both buttons are cut off
- [ ] Add the Spanish names and descriptions of the cards to the client (`UI-2`): `core/Texts.ts` has none, so every card shows its key, such as `card.warrior.3.name`
- [ ] Provide the card images the manifest lists: `/resources/cards/leader/1.png` and warriors such as `/resources/cards/warrior/common/0.png` answer 404. Decide whether a redraw counts as showing the card again (`UI-21`): a failed image is requested on every redraw, 51 times in one short game
- [ ] When the rest of the phase is finished, play the game in a browser and look for bugs and for things that can be improved (animations, positions, etc.). For example, whether the hand should be adapted so that its cards are not so large, which is only an example and not necessarily true. Record each finding as a bullet in the phase it fits best

## Phase 8 — Rounds, players and connection

- [ ] Display the current round (`UI-3`)
- [ ] Highlight the current player; distinguish the local player's cards
- [ ] Show the empty zones of eliminated players; handle elimination (`ELIM-5`, `VIEW-11`)
- [ ] Spectator mode with all interaction disabled except a button to leave, which asks for confirmation (`UI-15`); a spectator who has left stops receiving the events of the game (`SPEC-1`, `SPEC-2`, `SPEC-3`, `UI-8`)
- [ ] Connecting, disconnected, reconnecting and failure states, on every screen and with no retry limit (`UI-9`)
- [ ] Handle game-not-found, expired/invalid session, backend unavailable, failed initial sync (`UI-10`, `UI-11`, `USER-8`)
- [x] Cancel the loading on the server when a removed player leaves fewer than 2: publish `GAME_CANCELLED`, remove the game and unlock the party (`LOAD-4`; done in Phase 5)
- [ ] Go back to the party and explain it when the loading is cancelled (`LOAD-4`)

## Phase 9 — Architecture cleanup

- [ ] Review `EventSystem`, and whether the animation system of Phase 5.5 (`core/`) joins it
- [x] Complete or remove `ActionResolver` (removed with `ActionSystem` in Phase 4)
- [ ] Complete or remove unfinished card input logic; complete `CardClickHandler`
- [ ] Remove dead/unused architecture
- [ ] Finish remaining TODOs in comments
- [ ] Remove or fix the latent defects of unused code: the inverted condition of `Zone.isLineFull` in the frontend and `TurnManager.getPrevTurn`, which wraps out of bounds
- [ ] Weigh the pros and cons of giving each event its own `EventDetails` implementation (`CON-21`)
- [ ] Remove the debugging left in place: `createDebugUI` in `GameScene`, the red polygon in `ZoneSlotView` and `showDebugBoxes`

## Phase 10 — Board and cards

- [ ] Test layouts for 2 to 10 players (`VIEW-2`)
- [ ] Review whether the sides of the rivals should reflect the turn order around the table (`VIEW-13`)
- [ ] Verify card readability, targeting and hover previews with 10 players (`VIEW-2`)
- [ ] Review/fix existing table grid-line TODO
- [ ] Connect card preview to real backend data (types, stats, rarity, descriptions, equipment), listing every piece of equipment (`VIEW-14`, `EQUIP-4`): `GlobalCardTooltipView` only shows one
- [ ] Display opponent card backs (`VIEW-3`), adding the file, which does not exist yet, and its key to `fixed` (`CON-30`), and animate the card a rival receives (`VIEW-8`)
- [ ] Complete stacked-card hover behavior, with every piece of equipment stacked behind its combatant (`VIEW-14`)
- [ ] Decide how a hand that does not fit is shown and close `VIEW-16`: `HAND-1` sets no limit and `HandView` sizes its bounds for 10 cards. Probably the cards overlap
- [ ] Animate the leaders being placed one after the other when the board is first shown, with the first deal animation waiting for them, and set its duration per leader so that the start stays short with 10 players (`VIEW-12`)
- [ ] Reposition the board, the hand and the HUD when the window changes size: `App.vue` uses `Scale.RESIZE` and nothing reacts to it, so at 1100×620 the own leader, rows and buttons are out of view, and at 1920 wide the board is off-center. Only desktop windows: the responsive layouts of `VIEW-10` stay Post-MVP
- [ ] Fix the hand staying expanded after the pointer leaves it (`VIEW-14`). Seen twice with simulated mouse events in a game of two, but it folded in a game of three, and the cause was not found, so confirm it with a real mouse first ("Pending checks" of `ROADMAP-TEST.md`)
- [ ] Fix the slot of the incoming cards in `HandView.addCards` (`VIEW-8`): the position uses `i` instead of the index in the hand, and `newIndex` drifts because the cards are pushed inside the loop. Target and depth are wrong until `updateCards` runs at the end of the animation. Probably why, in 2 of 3 sessions of a game of three, only one of the 2 first cards was shown until the hand was hovered
- [ ] Make the expansion of the hand animate: `HandView.updateBounds` sets its `y` on every `prerender`, which overrides the tween of `HandAnimator`. Read from the code, not seen on screen
- [ ] Reduce the size of the cards of the hand: expanded they measure about 200×300 at 1600×900, a third of the screen height, and two cards take about 410 px. With 5 cards the expanded hand covers the left column of the own zone. They stay larger than the cards of the board, whose smaller size is what lets the whole board fit
- [ ] Center the hand on the screen according to the cards it holds: its bounds are sized for 10 cards and anchored to the left
- [ ] Make the values of the cards of the board readable without hovering (`VIEW-2`): with 2 players a card is about 65 px wide, and about 50 px in the rival zone, while the table between the zones is mostly empty
- [ ] Lower the contrast of the grid of the table, which competes with the cards
- [ ] Fix the cards of the side zones (`VIEW-1`, `VIEW-2`): they are drawn upright over rotated slots, off-center, overlapping the neighboring cards and the `Mano:` label
- [ ] Close the side panel when the hovered card disappears (`VIEW-14`): after the elimination of a player the panel of a card of their hand stayed open, up to the result screen
- [ ] Draw the name and the values of an equipment card: `EquipmentRender` draws nothing, so it shows two blank areas in the hand and in the side panel

## Phase 11 — UX

- [ ] Feedback: invalid drop, invalid target, not your turn, card cannot move, no available slot (`UI-6`)
- [ ] Round transition presentation and gameplay event notifications, including the turn and round notices (`VIEW-15`)
- [ ] Improve loading flow
- [ ] Move the hardcoded texts of the game scenes to `core/Texts.ts`, and show the key itself for a text key without a translation (`UI-2`)
- [ ] Make the highlight of the valid targets easier to see, and stop the arrow from covering the target (`UI-5`, `VIEW-4`)
- [ ] Mark the own cards that can attack. It needs a new `VIEW` rule: `VIEW-17` only rules out marks for protection
- [ ] Put a panel behind the texts of the result screen: the countdown overlaps the slots of the board
- [ ] Set the title of the page: `frontend/index.html` still says `Phaser Vue Template`

## Phase 12 — Menu, lobby, user

- [ ] Check users, parties and loading against `USER-*`, `PARTY-*` and `LOAD-*` and implement the differences: default capacity of 4 (`Party` uses 5) and its range, minimum to start, rejecting a start or a configuration change on a locked party (`PARTY-3`, `PARTY-9`), the result time counted as locked (`LOAD-1`), owner succession, the default name (`USER-2`), deleting the user when the session expires (`USER-7`), `exception.party.user_not_in_party` (`PARTY-6`), name rules with the name stored trimmed (`USER-4`), the capacity below the members rejected with `max_users_out_of_range` (`PARTY-2`), name of the party, and `party:info` sent to the members when a member changes their name (`PARTY-10`)
- [ ] Main Menu: party list, loaded when its screen opens and with a refresh button, with the members out of the capacity, the join button disabled for a full party, and a rejected join shown as a message that reloads the list (`UI-1`, `UI-14`)
- [ ] Lobby: listing, owner controls, kicking, configuration (`PARTY-*`, `UI-23`), and the message for a kicked user (`PARTY-12`); leaving is already in Phase 2.5. Leaving and kicking ask for confirmation (`UI-15`)
- [ ] Show a rejected start as a message below the start button (`UI-20`), and disable leaving, kicking and the configuration while the party is locked (`UI-16`)
- [ ] Username editing from the main menu, persisted with `PUT /user`, with a rejected name shown below the field (`USER-3`, `UI-13`)
- [ ] Fix `WebUserController.setAccount`, which saves a clone of the session user over the stored one, so the user loses their sockets and stops receiving events, and ignore the `id` of the body (`USER-3`)
- [ ] Send `gameMode` in `PartyDto`: `ModelMapper.toPartyDto` never sets it (`PARTY-3`)
- [ ] Name the party after its owner (`PARTY-11`): `ModelMapper` sends `Party of <name>`
- [ ] Style the main menu and the party screen, which use the default controls of the browser, and show the members in a stable order with the owner first: today the owner can be last

## Phase 13 — Testing

Cross-cutting tests are in `ROADMAP-TEST.md`.

- [ ] Complete T13 of `ROADMAP-TEST.md`

## Phase 14 — AI

The AI is rethought around an LLM, starting from nothing. The current implementation is removed in Phase 2.

- [ ] Discuss the specifications of the LLM model

## Pending tasks

Not tied to a phase.

- [x] Resolve the apparent `ActionMapper.toPlayerCode()` recursion bug
- [ ] Define how production serves the frontend and the backend under one origin, routing `/resources` like the REST paths (`CON-29`): `config.prod.mjs` has no proxy and the relative URLs depend on it
- [ ] Read the Socket.IO port from `crm.communication.socket-io.port`, 9092 by default, instead of hardcoding it in `SocketIOConfiguration` (`CON-1`)
- [ ] Replace any use of `exception.game.not_in_progress` with `exception.player-action.game_not_in_progress`, the only key of `TURN-7` in the contract. `PassTurnAction` returned the old one on 2026-11-05; the code was not checked when the key was removed from the contract
- [x] Decide what to do with `GameBehaviorIntegrationTest`: kept as it is, abstract and with no subclass. The test of T5 of `ROADMAP-TEST.md` does not use it, because it needs the real services. `GameEventWatcher`, `GameEventDebuger`, `PartyPopulator`, `UserPopulator` and `PersistenceTestConfiguration` are only referenced among themselves
- [ ] Send `damage`, `armor` and `health` of `CardDto` also with a value of 0, and `maxHealth` on combatants, and make them required in the frontend types (`CON-33`)
- [ ] Stop waiting for a missing event after 10 seconds and go on with the next one, discarding it if it arrives later, with the time in a client constant (`CON-12`)
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
- Vote to kick a player in the middle of a game (the MVP has no turn time limit, so a disconnected player blocks the game until their user is deleted, and one who stays connected without acting blocks it until their session expires, `USER-7`)
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
- Effects that grow with the rarity of a card, like the audio variants: a glowing card border, and a screen that dims with a heartbeat when it attacks. `CalmTargetingOverlay` and `CardActionPerspective` are kept for this and are not used by the click attack of Phase 4 (`FX-*` in `specs/VISUAL-EFFECTS.md`)
- Cursor animations
- Centralized audio and sounds for placement, attack, death, turn and round changes, victory and defeat (`VIEW-9`)
- Advanced trolling cards, green/red indicators, center-table behavior
- Settings screen, audio settings, accessibility (reduced motion, color-blind indicators), responsive and touch layouts
- Order of the state sent when a socket is bound (`CON-23`): with Engine.IO v4, `netty-socketio` 2.0.12 runs the connect listeners on the handshake, so `SocketIOConnectionManager` sends the state before the namespace connect ack. The client works around it by starting the sync on `connecting`/`reconnecting` (`SessionSystem`), which blanks the screen for the whole reconnection. The library has no hook after the ack; the options are a client request for the state (a new event, changing `CON-23`) or a delayed send
