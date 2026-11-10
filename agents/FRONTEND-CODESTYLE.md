# Frontend Code Style Guide

Mandatory conventions for `frontend/` (TypeScript, Vue 3, Phaser 4, Vite 6, Socket.IO client, Vitest). Complements `agents/CODESTYLE.md`.

The frontend is a **view of the server state**: Vue mounts the application and the menus; Phaser draws and animates the game. The backend is the authority: the frontend sends commands and renders the confirmed events.

---

## 1. Structure

| Folder (`src/`) | Purpose |
|---|---|
| `api/` | Single point of contact with the backend: REST (`*Api.ts`, using `fetch`), Socket.IO (`SocketService`, `SocketEventHandler`, `SocketReconnectHandler`). |
| `controllers/` | Connect interaction and actions (`CardController`, `HandController`). They send commands to the backend; they do not mutate the authoritative state. |
| `core/` | Static cross-cutting systems: `StoreSystem`, `EventSystem`, `CameraSystem`, `ProjectionSystem`, plus `cameras/`, `interactions/`, `visual_effects/`. |
| `domain/` | Frontend model (`Card`, `Zone`, `Player`, `Party`, `Battlefield`, `Action`…). No Phaser, no Vue, no `api`. |
| `game/` | Phaser views: `battlefield`, `cards`, `hand`, `hud`, `zone`, `perspectives`. They only draw and animate. |
| `scenes/` | Phaser scenes. They orchestrate, they contain no rules. |
| `views/` | Vue screens of the menus (main menu, party). They show state and call `controllers/`; no logic of their own. Their texts come from `core/Texts.ts`, a temporary key to Spanish text module that will be replaced by real localization. |
| `main.ts`, `App.vue`, `AppController.ts` | Vue and Phaser bootstrap. |
| `env.ts`, `core/Constants.ts` | Configuration and constants. |

### Dependency rule

```text
scenes → controllers → core, game → domain
scenes/controllers → api (to talk to the backend)
api → domain (maps DTO ↔ domain), core/StoreSystem (applies game events)
domain → (nothing)
```

- `domain` does not import Phaser, Vue or `api`.
- `game/*` (views) does not call `api` directly: commands go through `controllers/`.
- Only `api/` knows the URLs, the Socket.IO event names and the backend DTOs. The rest works with `domain` types.
- Vue (`.vue`) is used for the shell and menus. No game logic goes into Vue components.

---

## 2. State and communication

- The game state lives in `StoreSystem`, only in memory, because `GAME_SYNC` restores it (`CON-11`). It is the single source of truth on the client; views read from it.
- The authoritative state only changes when an event arrives from the backend (`CON-17`). **Optimistically mutating the board, the hand or the turn is forbidden**, except for purely visual previews that are reverted.
- Flow of an action: interaction → `CardController` → `gameApi` (REST) → the server validates → Socket.IO event → `SocketEventHandler` updates the `StoreSystem` → views update.
- Internal UI events (`EventSystem`) are independent of network events. UI event names are declared in the `Event` union in `EventSystem.ts`; loose strings and `rawEmit` are not used in new code.
- Network events are identified with `GameEventCode`, which must match the backend's `EventCode`.
- Codes travel as plain text inside JSON bodies, and in Base64 URL-safe only as part of a URL path (`CON-6`): there, always through `toBase64UrlSafe` / `fromBase64UrlSafe`.
- Other players' hands are never stored.
- The session state (the party and the user state, `CON-23`) lives in `SessionSystem`, not in `StoreSystem`: it is not game state and the game never reads it. It is exposed as read-only `shallowRef`s so that Vue components can react to it. Vue reactivity is used only there; `StoreSystem` and everything Phaser touches stay plain objects, never wrapped in a Vue proxy.
- Which menu screen is shown is decided in `App.vue` from the user state (`UI-17`). Phaser scenes only switch when the state enters loading or game.

---

## 3. Systems and classes

- The systems in `core/` are classes with static methods and module state (`EventSystem`, `StoreSystem`). This is the established pattern; it is followed for new cross-cutting systems, but **a new one is not created** if the behavior fits in an existing one.
- Phaser views are classes (`CardView`, `ZoneView`, `HandView`) that extend Phaser classes. The remaining pieces (layout calculations, resolvers, strategies) are functions or small classes with no Phaser state, so they can be tested with Vitest.
- A line must not exceed 130 characters. When it does, define variables or find another way to make it shorter while keeping or improving readability.
- Every calculation of the size or position of an object `X` lives in its `XLayout` class (`GameHudLayout`, `ZoneLayout`, `ZoneSlotLayout`); the view `X` only applies the results.
- Geometry and layout calculations go in pure classes/functions separated from the view (`HandLayoutCalculator`, `ZoneLayout`, `CardStackLayoutHelper`, `CameraCalculations`). That separation is what makes the visual layer testable: it is kept.
- View strategies: `BattlefieldViewStrategy` and its dispatcher. A new board mode adds a strategy, not an `if` per mode.
- `api/` modules are exported as objects or namespaces from `api/index.ts` (`gameApi`, `partyOwnerApi`…). A new API function is added to the module it belongs to and re-exported there. (The API can only be used through `api/index.ts`.)
- One file = one responsibility. Default export for the file's main class (like `EventSystem`, `Party`, `Card`); named exports for functions and types.
- `export`s always go at the end; `export class CardView {...` is **forbidden**.

---

## 4. TypeScript

- `strict` is on; it is not disabled nor silenced with `// @ts-ignore`.
- `any` is at `warn` in ESLint: it is not introduced in new code. If the type is unknown, use `unknown` and narrow it.
- Data types: `type` for unions and aliases (`type PlayerCode = string`), `interface` for extensible object shapes, classes for entities with behavior.
- A 64-bit value (such as a card code) arrives from the backend as a `string` and is converted to the domain type in the `api` layer.
- The DTOs in `api/dtos` are declared with `type`/`interface`, and converted to `domain` in the `api` layer. A DTO is never passed to a view.
- Closed sets are modeled with a literal union or `as const`; `enum` only where it is already used.
- A literal union that mirrors a backend enum uses the backend's text, in uppercase (`'FRIENDLY'`, not `'friendly'`).
- Whenever a type is imported it must use `import type`, and these go first in the import order.
- `@/` alias to import from `src/` (`@/api`, `@/domain/Card`), and in the browser tests also from `e2e/` (`@/support/test`, `FRONTEND-TESTS.md`, section 14); **relative paths are forbidden**.
- Unused parameters are prefixed with `_` (ESLint rule).

---

## 5. No magic values

General rules in `agents/CODESTYLE.md`, section 5.

```ts
// BAD
if (distance > 10) { startDrag(); }
this.cameras.main.setZoom(0.2);

// GOOD
if (distance > DRAG_DISTANCE_THRESHOLD) { startDrag(); }
this.cameras.main.setZoom(CAMERA_MIN_ZOOM);
```

- Interaction, camera, card dimension and animation timing constants: `src/core/Constants.ts` or the module constant of their folder (`CardDimensions.ts`). Each constant with meaning carries a one-sentence TSDoc comment with its unit (px, ms).
- Texture, audio and scene keys: constants, not repeated loose strings.
- Colors in `game/utils/ColorUtils.ts` or constants, not inline hexadecimals.
- Environment configuration (server URL, debug flags): `src/env.ts` / `import.meta.env`. `isDevelopment` and `showDebugBoxes` control what only exists in development.
- `.env.local.*` stays out of the repository.

---

## 6. Phaser

- Phaser objects are created in the scene (`create`) or in the view; views expose a method to destroy them, and whoever creates them destroys them.
- Listeners (`EventSystem.on`, `scene.events.on`, `input.on`) are unsubscribed in `destroy`/`shutdown`. Every `on` without its `off` is a bug.
- Tweens are created in `core/visual_effects` or in the view's animation module; they are not mixed with rules logic.
- `update` does not allocate new objects nor create closures per frame.
- The player's hand is pinned to the screen with `setScrollFactor(0)`; placed cards go back to `1`.
- All interaction goes through `core/interactions` (`CardInputManager`, `DragAndDrop`, `CardClickHandler`); a view does not register mouse handlers on its own.

---

## 7. Errors and logging

- Network errors are handled in `api/`: they are translated into a result or typed exception and shown through an `Overlay`/scene, never as an `alert`.
- An action rejected by the backend (a 400 response with an `exception.*` key, `CON-18`) reverts any visual preview and shows the translated key.
- `fetch` always checks `response.ok` in new code; existing functions that do not follow the golden rule of `agents/CODESTYLE.md`.
- `console.*` only in `api/` to trace communication, guarded by `isDevelopment` in new code. Never log the hand or tokens.
- New code leaves no debugging `console.log`.

---

## 8. Formatting

Enforced by Prettier (`.prettierrc.js`) and ESLint (`eslint.config.js`); it is not debated by hand.

- 4-space indentation, single quotes, semicolons, no trailing commas, `printWidth` 130, `arrowParens: always`.
- Every `if`, `for` and `while` declares its scope with `{}`, even when the body is one statement (`if (x) y();` is not written).
- Inside a function body, statements are grouped by the object they build: the local variables it needs (`const veilColor = ...`), its creation and its configuration (`veilShape.setOrigin(0, 0);`) go together. A single blank line separates each group from the next, and also separates the shared setup at the start (`const { veil, panel } = dialog;`) from the first group. There are no blank lines inside a group, and never more than one in a row.
- A Phaser `GameObject` is created into a variable and configured in separate statements on it (`veilShape.setOrigin(0, 0);` then `veilShape.setInteractive();`), not chained after `this.scene.add.*`.
- Private (not exported) functions of a module are `function name() {}` declarations, as in `ZoneDto.ts`, not `const name = () => {}`. A private function goes right below the one that uses it, not grouped at the end.
- An arrow function that is a method or a named function (`const toActiveGame = (...) => { ... }`) is written in full: with `{}` and an explicit `return` when it returns something, never the one-line expression body. Inline callbacks (`computed(() => x)`, `some((known) => known.equals(leader))`) may keep the short form.
- A callback with more than one statement is not written inline: it goes to a named method or function, passed by reference (`this.onClickYes.bind(this)`).
- No wildcard imports. Order: libraries (`phaser`, `vue`, `socket.io-client`), `@/api`, `@/domain`, `@/core`, the rest.
- Class and type files in `PascalCase.ts` (`CardView.ts`); modules with functions and domain utilities in `camelCase.ts` only where they already exist (`cardFactory.ts`).
- `npm run lint` must pass with no new errors.
- `.editorconfig` also states 4 spaces, with CRLF. A whole file is not reformatted except in a separate commit.

---

## 9. Tests

- Vitest with `jsdom`, `globals: true` and `vitest.setup.ts` (canvas mock for Phaser). Run with `npm run test:run`.
- Tests live in `frontend/test/` with the same structure as `src/` and the `.test.ts` suffix.
- What can be isolated is tested: `api/` (with `fetch` and the socket simulated), DTO ↔ domain mapping, `core/` (resolvers, camera, interactions), layout calculations and utilities. **In Vitest, appearance is not tested and no real `Phaser.Game` is created.** The browser tests of `FRONTEND-TESTS.md`, section 14, cover both.
- Simulate `fetch` with `vi.spyOn(globalThis, 'fetch')`. Restore with `vi.restoreAllMocks()` in `beforeEach`.
- For Phaser, minimal fake objects with the shape the code under test uses, not chained mocks of the whole module.
- Structure: one `describe` per unit, `it` with an English sentence that states behavior and result; Arrange / Act / Assert separated by a blank line.
- A change in the contract with the backend (`EventDto`, `ActionDto`, `GameEventCode`) comes with its test in `test/api/ApiMappers.test.ts` or equivalent.

---

## 10. Comments

- In English, only the *why*. One-sentence TSDoc for constants and public functions in `core/` when the unit or the reason is not obvious.
- Existing `TODO`s in Spanish are tolerated; new ones are in English.
