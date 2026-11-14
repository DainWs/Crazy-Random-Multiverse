# ROADMAP

Phased work plan. One phase per session. Mark bullets `- [x]` in the same commit as the work that completes them. Closed phases are in `ROADMAP-ARCHIVE.md`.

**MVP goal:** a complete game loop: deal -> placement -> combat -> victory/defeat.

**MVP scope:** Phases 1 to 13 (including 2.5, 2.6, 5.5 and 11.1 to 11.7). Phase 14 and the Post-MVP section are out of it.

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
| Settings screen | Post-MVP, with the graphics quality and reduced motion options (`UI-27`). The MVP is built so that adding it only adds the screen and its options, without changing the effects (`UI-30`) |
| Accepted risk: waiting player removed | The session of a waiting player can expire before that of the blocking one, so the waiting player is eliminated instead, during the turn (`TURN-4`) or the load (`LOAD-3`) |

## Phase 11.1 — UX/UI: accessibility

What can be done without a settings screen, which stays **[Post-MVP]** (`UI-13`, `VIEW-10`). "Decided with the product owner" means that the bullet is not implemented until the product owner has chosen, among sketches when it is visual, and the choice is written in the rule first.

- [ ] Give every mark of the board a second signal that does not depend on color: a shape, an icon or a line pattern, the same one wherever the mark appears. The signal of each mark is decided with the product owner and written in a new `VIEW` rule. The marks told apart today only by color are: the blue tint of the own zone (`VIEW-27`), the cyan frame of a card that can attack (`VIEW-17`), the gold frame of the leader with the turn (`VIEW-20`), the green frame of a slot where a dragged card can go and the red frame of the slot it comes from (`VIEW-32`), and the dark red tint of an eliminated zone (`VIEW-11`). Red and green are the pair that red-green color blindness confuses. The attack (`VIEW-4`) is not covered: its red frame comes with an icon and its green frame does not, so they are told apart without the color
- [ ] Write a new `VIEW` rule with minimum contrasts, measured against the color directly behind, and fix what falls under them: 4.5:1 for the texts of the HUD (`UI-3`, `VIEW-28`), the notices (`VIEW-15`), the side panel (`VIEW-14`), the result (`VIEW-23`), the loading screen (`VIEW-29`) and the dialogs (`UI-15`); 3:1 for texts of 24 px or more, or 19 px or more in bold, and for the frames and tints of the marks of the previous bullet against the slot. Today the round and turn text of the HUD is green drawn straight over the saturated background, with no panel
- [ ] Write a new `VIEW` rule with a minimum text size of 18 px on screen, with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`), for the same texts as the previous bullet, and fix what falls under it. The texts of the cards on the board are not covered by this bullet: see Phase 11.3
- [ ] Implement `UI-30`: stop following the reduced motion option of the operating system, which the code follows today for the pulses of `VIEW-17` and `VIEW-20` and the fade of `VIEW-29` (removed from those rules on 2026-11-14), and build the effects so that adding the settings of `UI-27` only adds the screen and its options. The browser tests ask for reduced motion to skip the fade of `VIEW-29` (pending check of Phase 11 in `ROADMAP-TEST.md`): they need another way to skip it
- [ ] Write a new `UI` rule for the keyboard and implement it: Enter accepts and Escape cancels the confirmation dialog (`UI-15`); a key ends the turn, does nothing while the button is disabled (`UI-4`) and is decided with the product owner; and the notices of `UI-9`, `UI-10` and `UI-24` and the confirmation dialog put the focus on their first button when they open, do not let it leave them while open, and draw the focused button with a mark different from the hover of `VIEW-28`

## Phase 11.2 — UX/UI: HUD hierarchy

- [ ] Give the end turn button the style of the primary action and the surrender button a different, destructive style, and stop them from being next to each other: today both have the same style and the surrender button is right above the end turn one (`VIEW-28`). The styles and the new place of the surrender button are decided with the product owner and written in a new `VIEW` rule. Surrendering keeps its confirmation (`UI-15`)
- [ ] Put the round and the turn on a panel in the palette of `VIEW-28`, at the top left corner where the text is today. The turn says "Tu turno" when it is the local player's and the name of the player otherwise, as the notices of `VIEW-15`. It follows the board being shown (`UI-3`). Write it in a new `VIEW` rule
- [ ] Implement the pulse of the end turn button of `specs/ui/GAME-PULSES.md` (`VIEW-38`), written on 2026-11-14, while it is the local player's turn and they have nothing left to do
- [ ] Lower the visual weight of the background around the table so that the board stands out over it. Whether by lowering its saturation, darkening it or adding a vignette is decided with the product owner and written in a new `VIEW` rule

## Phase 11.3 — UX/UI: board legibility

- [ ] Show the name of each player in a label next to their zone, with "Tú" instead of the name in the local player's zone: today the turn notice names the player (`VIEW-15`), but nothing on the board says which zone is theirs (`VIEW-13`). The label never covers a slot, and keeps the size on screen of the minimum text of Phase 11.1 at any zoom. Its place is decided with the product owner and written in a new `VIEW` rule
- [ ] Show the health of every leader outside its card, readable without hovering at any count from 2 to 10 players (`VIEW-2`): eliminating the leaders is the goal of the game, and with 10 players the values of the cards cannot be read. It keeps the size on screen of the minimum text of Phase 11.1 at any zoom and any count of players. Whether it is a number, a bar or both, and its place, are decided with the product owner and written in a new `VIEW` rule
- [ ] Measure, with the window at 1920 by 1080 and the zoom at 1, which values of a card on the board (damage, armor and health) reach the minimum size of Phase 11.1 with 2, 4, 6 and 10 players. With that measurement, the product owner decides which values must reach it without hovering, and how (`VIEW-2`, `VIEW-14`). Record the measurement in this bullet
- [ ] Show the turn order on the board (`VIEW-13`, `UI-3`). Whether each name label of the first bullet shows the position of its player in the order, or only the zone of the player who plays next is marked, is decided with the product owner and written in a new `VIEW` rule

## Phase 11.4 — UX/UI: feedback and game feel

- [ ] Implement the attack of `specs/ui/COMBAT-ATTACK.md` (`VIEW-4`), rewritten on 2026-11-14 together with `UI-5`, `UI-25` and `VIEW-17`, once the product owner has resolved its **[OPEN]** points for the MVP: the color and opacity of the shadows, and the size of the icon. Remove the arrow, and regenerate the reference images of the arrow and of `attack-marks`. The product owner had chosen a small bounce for the lift, but the questionnaire did not offer them the option without it; the developer chose it without bounce (`VIEW-31`)
- [ ] Implement the hit of `specs/ui/COMBAT-HIT.md` (`VIEW-5`), written on 2026-11-14, and the combat feedback of `VIEW-6` and `VIEW-7` once they are rewritten in their own files of `specs/ui/`, with the death of a card and the death of a leader as two tiers above the hit. The channels and durations of those tiers are decided with the product owner, within these limits: a freeze of the animation, if there is one, is only for the death of a leader and lasts 0.15 s or less; a flash happens at most three times per second (WCAG 2.3.1)
- [ ] Implement the reaction under the pointer of an own card that can attack of `specs/ui/CARDS-ACTIONABLE.md` (`VIEW-37`), written on 2026-11-14. The cards that can only be moved (`BOARD-7`) have none, because almost every warrior can be moved on the turn of its owner
- [ ] Implement the start size of 150% of the placement of the leaders of `specs/ui/GAME-PLACEMENT.md` (`VIEW-12`) and the durations of the notices of `specs/ui/GAME-NOTICES.md` (`VIEW-15`), 250 ms in, 1000 ms still and 250 ms out, written on 2026-11-14
- [ ] Change the period of the pulse of the cyan frame of `specs/ui/GAME-PULSES.md` (`VIEW-17`) from 1600 ms to 2400 ms, decided on 2026-11-14
- [ ] Implement the elimination of `specs/ui/GAME-ELIMINATION.md` (`VIEW-11`), written on 2026-11-14: the veil that fades in, the notice "<name> eliminado" or "Has sido eliminado", and only the veil when it ends the game. It needs first the fix of the gold pulse of the pending tasks, without which the elimination freezes. The animation starts with `PLAYER_DIE`, not when the zone is drawn: the board is drawn again right after the elimination
- [ ] Implement the opening and closing of the side panel of `specs/ui/CARDS-HOVER.md` (`VIEW-14`), written on 2026-11-14: today it appears and disappears at once
- [ ] Implement the arrival of a dealt card in the hand of `specs/ui/HAND-ARRIVAL.md` (`VIEW-8`), written on 2026-11-14
- [ ] Implement the settle of a card in a slot of `specs/ui/CARDS-SETTLE.md` (`VIEW-35`) and the equipment of `specs/ui/CARDS-EQUIP.md` (`VIEW-36`), written on 2026-11-14, and the durations of the drag moved to the scale of `VIEW-30` in `specs/ui/CARDS-DRAG.md` (`VIEW-32`): 150 ms for the preview in a slot and for the hiding of the hand

## Phase 11.5 — UX/UI: visual language

- [ ] Write in `VIEW-SPECS.md` a table of the colors of the interface, with the name, the hexadecimal value and the meaning of each one, used by the board, the HUD, the notices, the side panel and the dialogs. No color has two meanings: today red is the slot a dragged card comes from (`VIEW-32`), a rival card that cannot be attacked (`VIEW-4`), the flash of a card that lost health (`VIEW-5`), the negative values (`VIEW-14`) and the eliminated zone (`VIEW-11`). The colors are decided with the product owner
- [ ] Write in `VIEW-SPECS.md`, for every pair of marks that can be on the same slot at the same time, which one is drawn, or whether both are and how: the tint of the own zone (`VIEW-27`), the frame of a card that can attack (`VIEW-17`), the frame of the leader with the turn (`VIEW-20`), the frames of a dragged card (`VIEW-32`), the frames of a card under the pointer while attacking (`VIEW-4`) and the tint of an eliminated zone (`VIEW-11`). Today only `VIEW-17` and `VIEW-27` say it
- [ ] Choose a typeface and the sizes of four levels of text (title, body, label and numbers) for the HUD, the notices, the side panel, the dialogs and the cards, and write them in `VIEW-SPECS.md`: every text of the reference images uses the same monospaced typewriter face. The typeface is decided with the product owner. A new font file is a new asset: ask before adding it
- [ ] Review together the look of every effect of the game: the glow of the leader (`VIEW-20`), the veils (`VIEW-11`, `VIEW-23`), the notices (`VIEW-15`), the combat feedback (`VIEW-5` to `VIEW-7`) and the fades (`VIEW-29`), so that they use the colors of the first bullet and the durations and curves of `specs/ui/MOTION-BASE.md` (`VIEW-30`, `VIEW-31`). Regenerate the reference images that change. Moved from Phase 11

## Phase 11.6 — UX/UI: layout

- [ ] Write in `VIEW-24` the smallest supported window, decided with the product owner (1280 by 720 is proposed), and keep the HUD, the hand and the board from overlapping at any size from it up to 1920 by 1080. The reference image of `resize.spec.ts` at 1100 by 620 shows the end turn button over the edge of the table; whether that size has to work depends on the minimum chosen
- [ ] Decide with the product owner, and write in `VIEW-14`, whether the side panel ends above the HUD buttons or covers them while it is open: today the buttons are drawn over the panel
- [ ] Check whether the side panel (`VIEW-14`) covers the hovered card when it is in the zone of a rival on the right side (`VIEW-13`). If it does, write in `VIEW-14` that the panel is shown on the left side of the screen when the hovered card is in the right half of the screen, and implement it
- [ ] Check, at the smallest window of the first bullet and with 10 players, whether the expanded hand covers a slot of the own zone (`VIEW-16`). Record the result in this bullet, and if it does, fix it

## Phase 11.7 — UX/UI: learnability

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
- [ ] Stop the pulse of the gold frame when its slot is destroyed (`VIEW-20`): `ZoneSlotView.preDestroy` only removes the listener of `pulseReadyMark`, so `pulseTurnGlow` keeps running on `UPDATE` and reads `this.scene.time` of a destroyed slot. Found on 2026-11-14 recording the elimination of a rival in a game of three without reduced motion: the error `Cannot read properties of undefined (reading 'time')` repeats on every frame, the animations freeze, the zone never shows its veil (`VIEW-11`) and gameplay stays disabled (`UI-4`). The browser tests run with `reducedMotion: 'reduce'`, which skips the read of the clock, so none catches it: add one without reduced motion. `showReadyMark` also removes the listener of `pulseTurnGlow`, which stops the gold pulse of a leader that can attack
- [ ] Make a card of a zone on the left or right side shake from top to bottom on the screen, along its zone, instead of from left to right: seen on 2026-11-14 by the product owner in the recording of the death of a leader in the left zone of a game of three. It contradicts `VIEW-5`, which says that the target moves horizontally on the screen: change `VIEW-5` first, with the direction for each side (`VIEW-1`, `VIEW-13`)
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
- Centralized audio and sounds for placement, attack, death, turn and round changes, victory and defeat, and a click refused while attacking (`VIEW-9`), with more variants for rarer cards once `VIEW-22` is resolved (`VIEW-21`)
- Advanced trolling cards, green/red indicators, center-table behavior
- Interface skins chosen by each player, and turning the effects off by group (`FX-10` to `FX-15`)
- Settings screen, with the graphics quality and reduced motion options (`UI-27` to `UI-29`), audio settings, a color-blind palette chosen in the settings, responsive and touch layouts. The accessibility of the MVP is Phase 11.1
