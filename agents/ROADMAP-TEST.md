# ROADMAP-TEST

The equivalent of `ROADMAP.md` for tests: everything that has to be tested and is not written with the code of a phase. One phase per session, with the `Started at` and `Finished at` of `ROADMAP.md`. Mark bullets `- [x]` in the same commit as the tests that complete them.

Unit and per-feature tests do not go here: they are written in the same commit as their code (`CLAUDE.md`, Workflow). What goes here is cross-cutting tests, visual regression and what has only been checked by hand.

The number of a test phase is that of the phase of `ROADMAP.md` it belongs to. T2.6 to T6 and T13 are part of the MVP (`ROADMAP.md`, Phase 13). T2.6 to T5.5 are done after T6 and before Phase 7 of `ROADMAP.md`.

## How the view is tested

The main goal is that, when something changes, the table, the board, the hand and the tooltip keep looking more or less the same and keep working.

- The screenshots start from a prepared game, with a local double of the backend and test textures of their own, so that the art of the cards and the random deal do not change them. A real service is never used.
- The comparison allows a margin of pixel differences. WebGL varies between machines, so the reference images are always generated in the same environment.
- A phase that changes the view on purpose approves its new reference images in that same phase.
- The tests run with Playwright against the real application, with doubles of REST and the socket at the network boundary (decided with the user). Nothing that exists only for the tests goes in `src/`.
- The reference images are generated and compared on the developer's machine for now (decided with the user). Moving them to Docker must stay trivial: one more script and regenerating the images, without touching any test. That is why the render settings live only in `playwright.config.ts`, no test depends on the operating system, the images are stored in a folder per platform, and the version of Playwright is exact so that it can match the tag of its official image.
- Each area of the screen has its own limit of different pixels, measured from the real noise of several runs: 1% of the whole screen is more than the size of a card of the board, which could disappear unnoticed.

## T1 to T2.5

Phases 1, 2 and 2.5 of `ROADMAP.md` have no test phase: their tests were written with their code, and what was left to check of them is in T13 or in "Pending checks".

## T2.6 — Game resource loading

Needs the tooling of T6.

- [ ] The loading screen shows the progress of the downloads and then the wait for the other players, and `/ready` is only sent after the downloads (`UI-22`, `LOAD-2`)
- [ ] A failed download shows the failure and does not send `/ready`, and retrying requests only what failed and reaches the wait (`UI-12`)

## T3 — Authoritative game state and hand

Needs the tooling of T6.

- [ ] Reloading the page in the middle of a game shows the board again from `GAME_SYNC`, downloading the `fixed` resources without sending `/ready` (`CON-23`, `LOAD-6`)
- [ ] Reloading the page in the middle of the load goes back to the loading screen from `GAME_LOADING` and still confirms `/ready` (`CON-23`, `LOAD-2`)

## T4 — Core gameplay

Needs the tooling of T6.

- [ ] Dragging a warrior onto an occupied slot of its zone shows both cards swapped while the server answers, and both go back to their slots with the message when it rejects the move (`BOARD-7`, `UI-6`)
- [ ] While an attack is being aimed the arrow is red outside a valid target, and Escape or a click outside the cards cancels the selection (`VIEW-4`)
- [ ] Reference image approved by a person while an attack is being aimed: the attacker marked in red, the cards it can attack in green, and a card with its attack used or a protected card not marked (`UI-5`). The marks disappear when the attack is made or cancelled

## T5 — Elimination and game end

- [ ] Backend integration test of three players with a fixed clock: when the cleanup run deletes the player with the turn, the player is eliminated, the turn passes and the party drops them when it unlocks (`ABSENT-3`). Each step has its unit test, but not the chain

## T5.5 — Combat feedback

Needs the tooling of T6.

- [ ] When the attack that kills the last rival leader and the end of the game arrive one right after the other, the result appears only after the last animation (`UI-4`, `VIEW-12`)


## T6 — Visual regression and smoke test

Started at: `e92fea0`

Done before Phase 7 of `ROADMAP.md`, so that the next phases have a safety net.

**Tooling:**
- [x] Update `FRONTEND-TESTS.md` and `FRONTEND-CODESTYLE.md`, which forbid a real `Phaser.Game` and testing the appearance, and allow in `CLAUDE.md` that `npm run test:e2e` starts Vite
- [x] Add `@playwright/test` with an exact version, its configuration and the `test:e2e` and `test:e2e:update` scripts, and check that Phaser starts with WebGL in a headless browser
- [x] Local double of the backend, prepared game state and test textures, failing on any request it does not expect

**Visual regression:**
- [ ] Reference images approved by a person of the table, the board, the hand and the tooltip, with cards in the rival hands (`HAND-3`)
- [ ] The board, the slots and the arrow keep their shape at zooms from 0.5 to 1.1 (`PHASER4-SPECS.md`)
- [ ] Cover the sharpness of the cards and texts, so that it can leave "Pending checks"

**Smoke test:**
- [ ] Phaser starts with WebGL and reaches the main menu with no console errors other than the expected 400 of `/user` without a session
- [ ] Hovering a card of the hand expands the hand and shows the side panel, and leaving the card closes the panel (`VIEW-14`)
- [ ] Dragging a warrior from the hand to a valid slot sends `PUT_ACTION` with the row of that slot (`CON-14`) and the board shows it, with `dragenter` and `drop` reaching the slot under the pointer
- [ ] Clicking an own card and moving over a valid target draws the green arrow and shows the target in the side panel (`VIEW-4`, `UI-5`)
- [ ] Clicking the target attacks: its health goes down, and an attacker cannot attack again in the turn (`COMBAT-11`)
- [ ] In a game of three players, hover, drag and drop and targets work on the rotated side zones (`VIEW-2`)

## T13 — Remaining checks

Checks done by hand in a real browser, with two clients against a local backend, to validate the migration of Phase 6, so that they no longer have to be checked by hand.

**Startup:**
- [ ] No file uses `Phaser` as a value without importing it (`PHASER4-SPECS.md`). It was checked with a script over the TypeScript AST, because `tsc` does not catch it

**Party and game start:**
- [ ] A party is created, a second client joins with its code, and the start button is only enabled from 2 members (`UI-18`, `UI-20`)
- [ ] Starting the game downloads the resources, confirms `/ready` and reaches the board on both clients (`LOAD-2`)

**Board:**
- [ ] The local zone is at the bottom and the rival at the top, each with its leader placed (`VIEW-1`)
- [ ] A card whose image does not exist keeps `card.unknown` and does not interrupt the game (`UI-21`)

**Hand and placement:**
- [ ] A warrior dropped on a slot whose row towards the leader is not full is not placed and stays in the hand
- [ ] Dragging a warrior between slots of its zone moves it (`BOARD-7`)
- [ ] Dropping an equipment on a warrior of the board removes it from the hand and adds its values to the card

**Combat:**
- [ ] During an attack the attacker pulses, the floating damage text rises and fades, and the HUD buttons are dimmed and gameplay disabled until the animations end (`VIEW-5`, `VIEW-6`, `UI-4`)
- [ ] A leader cannot be attacked while its zone has a warrior, and can be once there is none (`PROT-6`)
- [ ] A warrior that dies, also with equipment, disappears from the board drawn afterwards (`COMBAT-7`, `EQUIP-8`, `VIEW-7`, `VIEW-18`)
- [ ] A dead leader shrinks and fades out with its own animation (`ELIM-3`, `VIEW-7`)

**Turns and rejections:**
- [ ] The HUD shows the round and whose turn it is, ending the turn passes it, and the round advances after the last player (`UI-3`)
- [ ] The player without the turn cannot act (`UI-4`)
- [ ] An action the server rejects out of turn gets a 400 with `exception.player-action.allowed_only_on_turn`, shows "No es tu turno" and puts the card back in the hand (`UI-6`)

**Camera:**
- [ ] The wheel changes the zoom, and dragging with the right button pans by the distance moved divided by the zoom
- [ ] The hand stays pinned to the same place of the screen at zooms from 0.5 to 1.1 and after panning

**End of the game:**
- [ ] Surrendering asks for confirmation and "Sí" ends the game (`UI-15`, `ELIM-2`)
- [ ] The result covers the board with "Victoria" or "Derrota", the winner and the countdown, and gameplay stays disabled (`WIN-4`)
- [ ] Killing the last rival leader ends the game, and both clients go back to the party when the countdown ends (`WIN-5`)
- [ ] A second game can be started from the same party, with the game scene starting again and no console errors from the first game (`UI-17`)

**Visual regression:**
- [ ] Reference images approved by a person of the attack arrow, the confirmation dialog and the result

**Cross-cutting:**
- [ ] E2E game-flow tests
- [ ] Reconnection, spectator mode and game completion tests

## Pending checks

Not a phase. What could not be verified from the agent environment, for a person to check, and why it has no test.

- [ ] A person judges the sharpness of the cards and texts on Phaser 4 in a real browser, at several zoom levels (`agents/PHASER4-SPECS.md`), and compares the start of a game with Phaser 3, where the HUD and the card panel are cut off at the initial zoom of 1.1. Not checked: it needs a person's eye, and the comparison needs the old version. A two-player game was played on Phaser 4 from the agent environment and covered the rest of the view
- [ ] A person starts the backend and checks that the Socket.IO server listens on port 9092. No test: the rules of `CLAUDE.md` do not allow a real port, and `SocketIOConfigurationTest` covers the start and stop of the server
- [ ] A person tests a real browser connection with the session cookie. No test: the doubles of T6 replace the server that sets the cookie, and `SocketFactory.test.ts` already covers `withCredentials`
- [ ] A person checks against a running server that the row of an action reaches the slot that was clicked (`CON-14`). No test: T6 checks the row that is sent, and what is left needs a real backend
- [ ] A person checks that `/resources` arrives through the Vite proxy (`CON-29`). No test: the doubles of T6 answer before the proxy
- [ ] A person double-clicks End Turn against the running server and checks that only one turn passes, and that the clients apply the events in `sequence` order (`CON-12`, `CON-22`). No test: each half has its own (`CardController.test.ts`, `GameEventQueue.test.ts` and the backend concurrency tests), and joining them needs the real Socket.IO server
- [ ] A person attacks in a real browser and judges the look of the combat feedback (`VIEW-5`, `VIEW-6`, `VIEW-7`): the attacker grows and shrinks back, the target shakes and flashes red, the armor and health count down, a killed card shrinks and fades out and a killed leader shakes first and lasts longer. No test: a screenshot in the middle of a tween depends on timing, T13 covers that the animations happen and `AnimationSystem.test.ts` their order
- [ ] A person looks at the animation of the cards received in the hand (`VIEW-8`). No test: same reason as the combat feedback, and `HandController.test.ts` covers when it starts
- [ ] Find the frontend test that failed once in a full run (1 of 454, `npx vitest run`) and passed in the next runs: its name was not recorded, and it may be a flaky test. Not a test to write: without its name there is nothing to cover
- [ ] A person renders `class_diagram-actions`, `-card`, `-dealer` and `-effect` and `activity-player_actions` and `usecases` in `docs/development/diagrams/` and checks that they draw. Not checked: they were rewritten against the code, and no PlantUML renderer is available in the agent environment
- [x] A person pushes a commit and checks that both jobs of `.github/workflows/maven.yml` run and pass. Not checked: the workflow only runs on GitHub
