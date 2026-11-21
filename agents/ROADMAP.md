# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them. Closed phases are in `ROADMAP-ARCHIVE.md`.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

**MVP scope:** Phases 1 to 13 (including 2.5, 2.6, 5.5 and 11.1 to 11.8). Phases 14 and 15 and the Post-MVP section are out of it.

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
| Settings screen | In the MVP with one option, the camera of the board (`UI-33`, `VIEW-57`), decided on 2026-11-20 in Phase 11.3 and changed on 2026-11-21: the card values outside the cards, its first section, were removed by the product owner, and the camera took their place. The graphics quality and reduced motion options stay Post-MVP (`UI-27`), and the MVP is built so that adding them only adds options to the screen, without changing the effects (`UI-30`) |
| Accepted risk: waiting player removed | The session of a waiting player can expire before that of the blocking one, so the waiting player is eliminated instead, during the turn (`TURN-4`) or the load (`LOAD-3`) |

## Phase 11.7 — UX/UI: two cameras

Started at: 1a289de1

The board seen from above by default, and the tilted look of before as an option of the settings (`VIEW-57`, `UI-33`). Decided by the product owner on 2026-11-21, who asked for one interface with two implementations, so the change between them stays simple. It has two implementations from the start, so it is the case of `CODESTYLE.md` for an interface, like `BattlefieldViewStrategy`. Done before the learnability phase, which was 11.7 and is now 11.8, by decision of the product owner on 2026-11-21: the reference images are regenerated once, and the legend of that phase is drawn over the default camera.

- [x] Put what differs between the cameras behind one strategy with two implementations, tilted and top-down, chosen by a dispatcher like that of `BattlefieldViewStrategy`: the projection of a point of the board (`ProjectionSystem`), the drawing of the table (`TableViewStrategy`), the framing of the camera (`resolveCameraConfiguration`) and whether a card is deformed to its slot (`VIEW-1`). The tilted implementation keeps the look of today, so this bullet changes no reference image
- [x] Add the top-down camera (`VIEW-57`): one scale for the whole board, the table as a rectangle with its border and without sides or legs, the cards flat and drawn without the Displacement filter and its buffer, and the whole table and the labels of its zones in view between the top edge of the screen and the hand at rest at every window from 1280 by 720 to 1920 by 1080 with 2 to 10 players (`VIEW-24`, `VIEW-49`)
- [ ] Check in a browser test that the texts of a card of the board, with the top-down camera, are sharper after zooming in (`VIEW-57`). It needs no code of its own: without the buffer of the Displacement filter a text is drawn from its texture, of one texel for each unit of the card, and at the maximum zoom a unit of the card takes about 0.77 px of the canvas, so the texture is never enlarged. Measured on 2026-11-21 with a prototype
- [ ] Fix the two browser tests that fail since before the removal of the card values, before the images are regenerated, so the regeneration starts from a green suite. `layouts.spec.ts`, "shows the side panel of a card of the top side": an `expect(...).toBe(false)` receives `true`, probably because Phase 11.6 changed the side the panel opens on (`VIEW-14`). `zoneLabels.spec.ts`, "draws no health bar for the zone of an eliminated player": the image differs from `zone-labels-eliminated.png` in 5437 pixels, only in the end turn and surrender buttons (`VIEW-43`)
- [ ] Add the camera option to the settings screen, "Cenital" by default and kept in the browser, and apply a change at once, after the animations that are playing (`UI-33`, `VIEW-57`)
- [ ] Move the points of the browser tests (`e2e/support/board.ts`) to the top-down camera, regenerate the reference images with the full suite, and keep one image of the tilted camera for 2, 6 and 10 players. A person approves the new images (`ROADMAP-TEST.md`, pending checks)

## Phase 11.8 — UX/UI: learnability

- [ ] Add a help button to the HUD that opens a panel over the board with a legend of the marks of the board: each one with its color, its second signal (Phase 11.1) and its meaning. The panel closes with the same button, with Escape and with a click outside it. Whether gameplay stays enabled while it is open is decided with the product owner. Write it in new `UI` and `VIEW` rules
- [ ] Add to the panel of the previous bullet a summary of the rules, in a second section: the goal, the turn, placing a card, attacking, protection and elimination (`TURN-*`, `BOARD-*`, `PROT-*`, `ELIM-*`). The text is in Spanish, goes through the texts of `UI-2`, and is approved by the product owner. Write it in a new `UI` rule
- [ ] Say in the side panel (`VIEW-14`) of an own card on the board, while the board being shown is the local player's turn, whether it can attack this turn, from `attackAvailable` (`CON-15`): a click on a card that cannot attack does nothing and says nothing (`UI-25`). The contract does not say why a card cannot attack, so the panel gives no reason. Write it in a new `VIEW` rule

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

## Phase 15 — Skins

**[Post-MVP]** Skins of the HUD and of the battlefield (`FX-10` to `FX-21`). It needs Phase 11.1 (the minimum contrasts and text size of `FX-20`), Phase 11.5 (the default look, which is the default skin of `FX-19`) and the settings screen (`UI-13`, `UI-27`).

- [ ] Make `HudSkin` hold the value of every piece in the skin itself, with the optional code that draws a piece (`FX-18`), and let a skin define only part of them, taking the rest from the default skin (`FX-11`). Today it only has data and cannot describe the cut corners or the double border of `docs/skins/huds/fantasy/`
- [ ] Take the colors of the battlefield out of `PaletteColor` and into `BattlefieldSkin` (`FX-19`): today a new battlefield means editing `Palette.ts`, and `BattlefieldSkin` has only three colors, while the proposals of `docs/skins/battlefields/` are scenes. Decide with the product owner which parts of a battlefield a skin defines, and write it in `FX-10`
- [ ] Add a catalog for each element and choose the skin from it (`FX-11`, `FX-12`), instead of the fixed `DEFAULT_SKIN` of `GameDto`. The choice is read from the settings of the player (`UI-27`). A skin that cannot be used shows the default look (`FX-21`)
- [ ] Give the Vue panels (`FX-10`) the values of the skin of the HUD, and take the `rgba` of `App.vue` out of the CSS
- [ ] Load the resources of a skin, such as images and fonts, when it is chosen. A new font file is a new asset: ask before adding it
- [ ] Check in a test, for every skin of the catalog, the minimum contrasts and text size of `FX-20`, so a skin that does not keep them cannot be added
- [ ] Write in `FRONTEND-CODESTYLE.md` how to add a skin (`FX-19`), with one skin of the repository as the example
- [ ] Port the skins of `docs/skins/`, one skin per commit, with a reference image of each. Which ones are ported first is decided with the product owner

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
- [x] Stop the pulse of the gold frame when its slot is destroyed (`VIEW-20`): `ZoneSlotView.preDestroy` only removes the listener of `pulseReadyMark`, so `pulseTurnGlow` keeps running on `UPDATE` and reads `this.scene.time` of a destroyed slot. Found on 2026-11-14 recording the elimination of a rival in a game of three without reduced motion: the error `Cannot read properties of undefined (reading 'time')` repeats on every frame, the animations freeze, the zone never shows its veil (`VIEW-11`) and gameplay stays disabled (`UI-4`). The browser tests run with `reducedMotion: 'reduce'`, which skips the read of the clock, so none catches it: add one without reduced motion. `showReadyMark` also removes the listener of `pulseTurnGlow`, which stops the gold pulse of a leader that can attack
- [ ] Make a card of a zone on the left or right side shake from top to bottom on the screen, along its zone, instead of from left to right: seen on 2026-11-14 by the product owner in the recording of the death of a leader in the left zone of a game of three. It contradicts `VIEW-5`, which says that the target moves horizontally on the screen: change `VIEW-5` first, with the direction for each side (`VIEW-1`, `VIEW-13`)
- [x] Replace `IllegalAccessException` in `PlayerUsecase` with an `AccessDeniedException` that extends `UsecaseException`
- [x] Mark `VIEW-9` as **[Post-MVP]** and add sounds and cursor animations to `SCOPE-4`
- [x] State in `PARTY-5` that the party screen shows its code to be copied, and that its format is up to the server
- [x] State in `INTERFACE.md` that the party list is loaded when its screen opens and with a refresh button (`PARTY-4`)
- [x] State in `UI-13` that the interface does not offer renaming inside a party, although the server accepts it (`USER-3`)
- [x] State in `SPEC-3` and `UI-8` that a spectator has a leave button, as an exception to the disabled interaction, and stops receiving the events of the game after leaving
- [x] State in `INTERFACE.md` that surrendering asks for confirmation (`ELIM-2`)
- [x] State in `USER-4` that spaces are trimmed before validating the length, and in `USER-2` that the default name follows `USER-4`
- [ ] Review the performance of the game: frame rate and frame time of the board with 10 players, with the animations of Phase 11.4 running, and the cost of the full-screen effects. Measure first and record what is found; the browser tests take screenshots of the whole page on every poll, which is also slow

## Ideas

Ideas the product owner chose on 2026-11-21 to make the values of the cards of the board easy to read, without floating information, from 50 proposals with an image each. They are not phases yet: each one needs its rule in `VIEW-SPECS.md` or `specs/ui/` before it is planned. The top-down camera (idea 01), chosen with them, is Phase 11.7.

- **Health bar on the card** (idea 31). One bar along the bottom of every card of the board, as wide as the card, filled in green with the current health over the maximum (`CON-27`); what was lost is drawn dark. The bar has no armor part: the contract has no maximum armor, and the product owner chose not to add it. Decided on 2026-11-21.
- **Bar only when wounded** (idea 32). A card that has not lost health has no bar, so the cards that were hit stand out on their own. With the previous idea, "wounded" is current health lower than the maximum. Decided on 2026-11-21.
- **Numbers on the card.** The face of a card of the board shows its damage, large, and its armor; the health is the bar of idea 31. The exact health is read in the side panel (`VIEW-14`) and with the key of idea 42. Decided on 2026-11-21.
- **Key of the values** (idea 42). While the player holds Alt down, every card of the board shows only its values: dark face, large damage and health, smaller armor. When it is released, the cards go back to their face. Decided on 2026-11-21. Known risk: on Windows, releasing Alt can take the focus to the menu of the browser, and the page cannot always prevent it.
- **Health after the hit** (idea 49). With an attacker selected (`VIEW-4`) and the pointer over a valid target, the part of the target's bar that the attack would take is drawn striped in red. It follows the rules of combat: the attack takes armor or health, never both (`COMBAT-2` to `COMBAT-4`), so with armor of the type of the damage only the armor changes and the bar is not striped. The client computes it from the values it has, without changing the state (`UI-6`). **[OPEN]** Whether the keyboard (`UI-32`, `VIEW-42`) shows it too when it puts the focus on a target.

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
- Centralized audio and sounds for placement, attack, death, turn and round changes, victory and defeat, and a click refused while attacking (`VIEW-9`), with more variants for rarer cards once `VIEW-22` is resolved (`VIEW-21`)
- Advanced trolling cards, green/red indicators, center-table behavior
- Skins of the HUD and of the battlefield, each one chosen on its own by each player, and turning the effects off by group (`FX-10` to `FX-21`, Phase 15). The HUD skins are built from base pieces (`FX-17`). Their last parts, after the turn panel, the buttons and the dialog: the notices, the result, the rejection message and the label of a spectator; the side panel of a card; and the loading screen and the notices of the session, which are Vue panels
- Settings screen, with the graphics quality and reduced motion options (`UI-27` to `UI-29`), audio settings, a color-blind palette chosen in the settings, responsive and touch layouts. The accessibility of the MVP is Phase 11.1

