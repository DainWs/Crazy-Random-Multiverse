---
name: frontend-conventions
description: Mandatory conventions for writing, changing or reviewing the code and the tests of CRM Game in frontend/ (TypeScript, Vue 3, Phaser 4, Vite) — structure, state and communication, systems, TypeScript, Phaser, errors, the interface hierarchy (HudSystem, ScenerySystem), formatting, comments and the style of the tests. Load it before touching any file of frontend/. The absolute rules are in docs/constitution.md, which wins over this skill.
---

# frontend-conventions

How the code of `frontend/` is written. These conventions are mandatory, not suggestions. They sit under `docs/constitution.md`: read it first, because its rules win over anything here. For code that does not follow these conventions, its golden rule applies (`docs/constitution.md`, section 1).

- The tests follow besides `.claude/skills/frontend-conventions/frontend-tests.md`: read it when the task writes or changes a test.
- The general conventions are the same in `backend-conventions` and `frontend-conventions`: a change to them goes to both skills in the same commit.
- A section that moved to the constitution keeps its number and points to it, so the old citations by section still lead somewhere.

The frontend is a **view of the server state**: Vue mounts the application and the menus; Phaser draws and animates the game. The backend is the authority: the frontend sends commands and renders the confirmed events.

---

## General conventions

### Language

- **Code, names, logs and comments in English.**
- Existing exception messages in Spanish are tolerated; new ones are written in English.
- Documentation in `docs/` is written in English. Existing `TODO`s in Spanish are tolerated.
- Text the player sees does not live in the code: it is identified by key (`exception.*`, card `name` and `description`) and translated on the client (`frontend/src/core/Texts.ts`, `UI-2`). The name of a user is data, not an interface text: it is shown as it is, also the default name the server assigns (`USER-2`).

### Names

- Follow the Java community naming conventions for Java code, and the TypeScript ones for TypeScript code.
- Forbidden as a full name: `data`, `info`, `manager`, `helper`, `utils`, `handler`, `process`, `tmp`, `obj`.
- Boolean variables are affirmative: `isEnabled`, never `isNotDisabled`.
- No abbreviations except the universal ones: `id`, `dto`, `ui`, `io`, `url`, `json`.
- The name says **what**, the code says **how**. If a comment is needed to explain what a function does, the name is bad.
- Names follow the game's domain vocabulary (see `docs/specs/`): `Party`, `Game`, `Player`, `Zone`, `Board`, `Leader`, `Warrior`, `Spell`, `Equipment`, `Hand`, `Deck`, `Turn`. The same concept has the same name in backend and frontend.
- Entity codes are value objects with the `Code` suffix in the backend (`GameCode`, `PartyCode`, `PlayerCode`, `UserCode`, `CardCode`) and type aliases in the frontend.

### Functions and modules

- A function does one thing. If its name needs an `and`, they are two functions.
- Target: fewer than 30 lines. It is a signal, not a hard limit; exceeding it must be justified.
- Maximum 2 levels of nesting per method or function, and a conditional is never nested in another conditional (`if () { if () { } }`). The two levels are only a loop with a conditional (or another loop) inside, or the other way around: `if () { for }`, `for { if }`. Deeper code is split into methods.
- Avoid whenever possible the early `return;` (a `return` with no value that cuts a method short), `break` and `continue`: they break the flow. Structure the code with a condition or a local variable instead. The exception is a guard: a `return;` at the start of a method or function that discards a case.
- `switch` is banned (`docs/constitution.md`, section 12): a `Map` of handlers is used instead.
- Maximum 3 positional parameters. Beyond that, they are grouped into a value object. (For backend constructors the maximum is also 3: `.claude/skills/backend-conventions/SKILL.md`, section 9.)
- Boolean parameters are forbidden in public signatures: turn it into two functions or an enum. A boolean at the call site forces you to open the definition to know what it means.
- Modules by responsibility, not by type.
- No `import *` or `import package.*`. Explicit imports.

#### Intermediate variables for transformations

> Good code is not code with fewer lines. It is code that another developer can understand quickly.

The result of a transformation (a Stream API pipeline, an array method chain, a calculation) is not written inside the arguments of another call. It is first assigned to a local variable named after the purpose of the resulting data, and that variable is passed.

**Preferred:**

```java
List<CardDto> equipmentDtos = combatant.getEquipment().stream() //
		.map(ModelMapper::mapCardToDto) //
		.toList();

cardDto.setEquipment(equipmentDtos);
```

**Avoid:**

```java
cardDto.setEquipment(
		combatant.getEquipment().stream() //
				.map(ModelMapper::mapCardToDto) //
				.toList()
);
```

Readability, maintainability and ease of debugging come before minimizing the number of lines.

### Logging

- Logging through SLF4J in the backend, structured. Direct console output is banned (`docs/constitution.md`, section 12); the only exception is the communication trace of the frontend `api/` (`.claude/skills/frontend-conventions/SKILL.md`, section 7).
- Log entries for a game include its `GameCode`; those for a player, their `PlayerCode`.
- What is never logged: `docs/constitution.md`, section 8.
- Messages describe facts, not moods.

### Comments

- Minimal comments: only the *why* when it is not obvious. Never comments that repeat what the code says.
- `TODO`s carry enough context to act on; no `TODO` is added without an owner or a reason.

### Commits

The format of the commits is in `CLAUDE.md`. Refactoring is not mixed with functional changes in the same commit, and the message explains the why when it is not obvious; the what is already in the diff.

---

## 1. Structure

| Folder (`src/`) | Purpose |
|---|---|
| `api/` | Single point of contact with the backend: REST (`*Api.ts`, using `fetch`), Socket.IO (`SocketService`, `SocketEventHandler`, `SocketReconnectHandler`). |
| `controllers/` | Connect interaction and actions (`CardController`, `HandController`). They send commands to the backend; they do not mutate the authoritative state. |
| `core/` | Static cross-cutting systems: `StoreSystem`, `SessionSystem`, `AnimationSystem`, `EffectSettings`, `ResourceSystem`, `CameraSystem`, `ProjectionSystem`, plus `cameras/`, `interactions/`, `visual_effects/`. |
| `domain/` | Frontend model (`Card`, `Zone`, `Player`, `Party`, `Battlefield`, `Action`…). No Phaser, no Vue, no `api`. |
| `game/` | Phaser views: `battlefield`, `cards`, `hand`, `hud`, `zone`, `perspectives`. They only draw and animate. |
| `scenes/` | Phaser scenes. They orchestrate, they contain no rules. |
| `views/` | Vue screens of the menus (main menu, party). They show state and call `controllers/`; no logic of their own, except `FocusTrap.ts`, the DOM focus helper of their notices (`UI-32`). Their texts come from `core/Texts.ts`, a temporary key to Spanish text module that will be replaced by real localization. |
| `main.ts`, `App.vue`, `AppController.ts` | Vue and Phaser bootstrap. |
| `env.ts`, `core/Constants.ts` | Configuration and constants. |

### Dependency rule

In `docs/constitution.md`, section 4.

---

## 2. State and communication

- The game state lives in `StoreSystem`, only in memory, because `GAME_SYNC` restores it (`CON-11`). It is the single source of truth on the client; views read from it.
- The authoritative state only changes as `docs/constitution.md`, section 3, says.
- Flow of an action: interaction → `CardController` → `gameApi` (REST) → the server validates → Socket.IO event → `SocketEventHandler` → `GameStateApi`, whose `GameEventQueue` applies the events in `sequence` order (`CON-12`) → `StoreSystem` → views update, after the animations of the earlier events (`AnimationSystem`, `UI-4`).
- Network events are identified with `GameEventCode`, which must match the backend's `EventCode`.
- Codes travel as plain text inside JSON bodies, and in Base64 URL-safe only as part of a URL path (`CON-6`): there, always through `toBase64UrlSafe` / `fromBase64UrlSafe`.
- The session state (the party and the user state, `CON-23`) lives in `SessionSystem`, not in `StoreSystem`: it is not game state, and the game only uses it for the session: `GameLoad` reads the active game and the user state and calls `abandonGame` (`UI-12`), and the leave button of a spectator goes through `PartyController`, which reads the party (`SPEC-3`). The local user, from which the own player is identified (`CON-24`), is in `StoreSystem`. It is exposed as read-only `shallowRef`s so that Vue components can react to it. Vue reactivity is used only there; `StoreSystem` and everything Phaser touches stay plain objects, never wrapped in a Vue proxy.
- Which menu screen is shown is decided in `App.vue` from the user state (`UI-17`). Phaser scenes only switch when the state enters loading or game.

---

## 3. Systems and classes

- The systems in `core/` are classes with static methods and module state (`StoreSystem`). This is the established pattern; it is followed for new cross-cutting systems, but **a new one is not created** if the behavior fits in an existing one.
- Phaser views are classes (`CardView`, `ZoneView`, `HandView`) that extend Phaser classes. The remaining pieces (layout calculations, resolvers, strategies) are functions or small classes with no Phaser state, so they can be tested with Vitest.
- A line must not exceed 130 characters. When it does, define variables or find another way to make it shorter while keeping or improving readability.
- Every calculation of the size or position of an object `X` lives in its `XLayout` class (`GameHudLayout`, `ZoneLayout`, `ZoneSlotLayout`); the view `X` only applies the results.
- Geometry and layout calculations go in pure classes/functions separated from the view (`HandLayoutCalculator`, `ZoneLayout`, `CardStackLayoutHelper`, `CameraCalculations`). That separation is what makes the visual layer testable: it is kept.
- View strategies: `BattlefieldViewStrategy` and its dispatcher. A new board mode adds a strategy, not an `if` per mode.
- `api/` modules are exported as objects or namespaces from `api/index.ts` (`gameApi`, `partyOwnerApi`…). A new API function is added to the module it belongs to and re-exported there. (The API can only be used through `api/index.ts`.)
- One file = one responsibility. Default export for the file's main class (like `StoreSystem`, `Party`, `Card`); named exports for functions and types.
- `export`s always go at the end; `export class CardView {...` is **forbidden**.

---

## 4. TypeScript

- `strict` is on; it is not disabled nor silenced with `// @ts-ignore`.
- `any` is at `warn` in ESLint: it is not introduced in new code. If the type is unknown, use `unknown` and narrow it.
- Data types: `type` for unions and aliases (`type PlayerCode = string`), `interface` for extensible object shapes, classes for entities with behavior.
- A 64-bit value (such as a card code) arrives from the backend as a `string` and is converted to the domain type in the `api` layer.
- The DTOs in `api/dtos` are declared with `type`/`interface`, and converted to `domain` in the `api` layer. A DTO is never passed to a view.
- Closed sets are modeled with a literal union or `as const`; `enum` only where it is already used.
- A literal union that mirrors a backend enum uses the backend's text, in uppercase (`'PHYSICAL'`, not `'physical'`).
- Whenever a type is imported it must use `import type`, and these go first in the import order.
- `@/` alias to import from `src/` (`@/api`, `@/domain/Card`), and in the browser tests also from `e2e/` (`@/support/test`, `.claude/skills/frontend-conventions/frontend-tests.md`, section 14); **relative paths are forbidden**.
- Unused parameters are prefixed with `_` (ESLint rule).

---

## 5. No magic values

The rule is in `docs/constitution.md`, section 5.

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
- The panels, buttons, texts and accents of the HUD, the notices, the result, the dialogs and the rejection message are created with `game/hud/HudPieces.ts` from the active `HudSkin` (`game/hud/HudSkin.ts`), never with `scene.add.text` or `scene.add.rectangle` and a style written in the view. The view only places them.
- Colors: a name in `PaletteColor` (`game/utils/Palette.ts`) that says its meaning, read with `paletteFill` (numbers), `paletteText` (`#rrggbb`) or `paletteRgba` (canvas gradients). No hexadecimal is written outside it.
- Environment configuration (server URL, debug flags): `src/env.ts` / `import.meta.env`. `isDevelopment` controls what only exists in development.
- `.env.local.*` stays out of the repository.

---

## 6. Phaser

- Phaser objects are created in the scene (`create`) or in the view; views expose a method to destroy them, and whoever creates them destroys them.
- Listeners (`scene.events.on`, `input.on`) are unsubscribed in `destroy`/`shutdown` (`docs/constitution.md`, section 7).
- A tween is created only by `playMotion` (`core/visual_effects/Motion.ts`), never with `scene.tweens.add`. It takes one of the three speeds (`FAST`, `MEDIUM`, `SLOW`) or, for a named exception of the effect, the milliseconds as a constant; one of the four curves (`ENTER`, `LEAVE`, `TRAVEL`, `STRIKE`) or an ease kept as a constant; and the kind of effect (`ESSENTIAL`, `NON_ESSENTIAL`), which `EffectSettings` asks before playing. It resolves when the tween ends or the scene shuts down. Motions are described in `core/visual_effects` or in the view's animation module; they are not mixed with rules logic.
- `update` does not allocate new objects nor create closures per frame.
- `setScrollFactor(0)` keeps the HUD, the dialogs and the result in place when the camera pans, but does not undo the zoom, so their layout compensates it (`GameHudLayout`). The player's hand does not use it: `HandView` follows the camera on every `prerender` and is scaled by `1 / zoom` (`docs/guides/phaser4-troubleshooting.md`). A card that leaves the hand gets a scroll factor of `1`.
- All interaction goes through `core/interactions` (`CardInputManager`, `DragAndDrop`, `CardClickHandler`); a view does not register mouse handlers on its own.

---

## 7. Errors and logging

- Network errors are handled in `api/`: they are translated into a result or typed exception and shown through an `Overlay`/scene, never as an `alert`.
- An action rejected by the backend (a 400 response with an `exception.*` key, `CON-18`) reverts any visual preview and shows the translated key.
- `fetch` always checks `response.ok` in new code; existing functions that do not follow it, the golden rule (`docs/constitution.md`, section 1).
- `console.*` only in `api/` to trace communication, guarded by `isDevelopment` in new code. What is never logged: `docs/constitution.md`, section 8.
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
- Class and type files in `PascalCase.ts` (`CardView.ts`); `camelCase.ts` only for `index.ts`, `env.ts` and `main.ts`.
- `npm run lint` must pass with no new errors.
- `.editorconfig` also states 4 spaces, with CRLF. A whole file is not reformatted except in a separate commit.

---

## 9. Tests

In `.claude/skills/frontend-conventions/frontend-tests.md`. The absolute rules of the tests are in `docs/constitution.md`, sections 10 and 11.

---

## 10. Comments

- In English, only the *why*. One-sentence TSDoc for constants and public functions in `core/` when the unit or the reason is not obvious.
- Existing `TODO`s in Spanish are tolerated; new ones are in English.

---

## 11. Interface hierarchy

Which part of the interface belongs to which, and which system of the frontend creates it. Reviewed and decided by the product owner on 2026-11-22. What each part looks like is in `docs/specs/ui/`, and what is drawn over what in `docs/specs/ui/draw-order.md` (`VIEW-68`).

### Tree

Every part of the interface has one place in this tree, and a part that is added is placed here. The tree says what a part belongs to and who creates it, not where it is drawn or what is drawn over it: the marks of the board belong to the HUD, are created by `HudSystem` and are drawn on the slots (`VIEW-24`). The animations, the sounds and the effects are not parts of the tree (`FX-22`). A part marked as single exists only once on the screen (see "Creating"). Decided by the product owner on 2026-11-22.

The two elements with skins (`FX-10`) hang from the system that creates their parts: the battlefield from `ScenerySystem` and the HUD from `HudSystem`. The rest of the game screen is created by its own views, with no skin, and nothing drawn by Vue has a skin: with a skin chosen, the HUD changes and the panels of Vue keep their look, a limitation accepted by the product owner on 2026-11-22 (`FX-10`).

```
Interface
├── Vue, with no skin
│   ├── Main menu (UI-1)
│   ├── Party screen (UI-17)
│   └── Panels over the game screen
│       ├── Game menu (UI-36, VIEW-60)
│       ├── Settings screen (UI-33)
│       ├── Help panel (UI-34, VIEW-58)
│       └── Notices of the session and the connection (UI-9, UI-10, UI-24)
└── Phaser
    └── Game screen (UI-17)
        ├── ScenerySystem ── BattlefieldSkin
        │   └── Battlefield (FX-10)
        │       ├── Surroundings: what is seen around the table
        │       ├── Effect layer behind the table, with no skin (FX-23)
        │       ├── Darkening of the accessible mode, with no skin (VIEW-45)
        │       ├── Table: its surface, its edge and its grid (VIEW-26), and its sides and legs (VIEW-57)
        │       └── Effect layer over the table, with no skin (FX-23)
        ├── HudSystem ── HudSkin
        │   ├── HUD (VIEW-62)
        │   │   ├── Buttons
        │   │   │   ├── End turn and surrender (VIEW-43)
        │   │   │   ├── Leave, of a spectator (UI-8)
        │   │   │   └── Game menu (VIEW-60), single
        │   │   ├── Label of a spectator (VIEW-28), single
        │   │   ├── Round and turn (VIEW-44), single
        │   │   ├── Side panel of a card (VIEW-14), single
        │   │   ├── Notices of turn, round and elimination (VIEW-15, VIEW-11)
        │   │   ├── Message of a rejected action (UI-6)
        │   │   ├── Confirmation dialog (UI-15)
        │   │   ├── Labels of a zone
        │   │   │   ├── Name (VIEW-49)
        │   │   │   ├── Health bar of the leader (VIEW-50)
        │   │   │   └── Mark of who plays next (VIEW-51)
        │   │   └── Marks of the board (VIEW-58)
        │   │       ├── Own zone (VIEW-27)
        │   │       ├── Card that can attack (VIEW-17)
        │   │       ├── Leader with the turn (VIEW-20)
        │   │       ├── Slot where the dragged card can go (VIEW-32)
        │   │       ├── Slot the dragged card comes from (VIEW-32)
        │   │       ├── Valid target (VIEW-4)
        │   │       ├── Target that cannot be attacked (VIEW-4)
        │   │       └── Eliminated zone, with its veil and its label (VIEW-11)
        │   └── Result (VIEW-23), not part of the HUD
        ├── Board, with no skin
        │   └── Zones (VIEW-13)
        │       └── Slots
        │           └── Cards
        │               └── Equipment (VIEW-36)
        └── Hand (VIEW-16), with no skin
            └── Cards
```

The darkening of the accessible mode (`VIEW-45`) is drawn by `ScenerySystem` with no skin, because the accessible mode does not change the base look (`UI-31`). Decided by the product owner on 2026-11-22.

**[OPEN]** Who draws the loading screen (`VIEW-29`), which the pending task about `GameLoad.ts` of `docs/roadmap/roadmap.md` finds out. It goes in the tree when it is known; until then `GameLoad` creates its texts with a style of its own, outside `HudSystem`, because it is not part of the HUD (`VIEW-62`). Whether the cards become an element with skins of its own is open in `FX-10`.

### Layers

What is drawn over what is `VIEW-68` (`docs/specs/ui/draw-order.md`). Each of its layers has a name, instead of the depths spread over `core/Constants.ts`: making it is Phase 11.9 of `docs/roadmap/roadmap.md`, which checks first what the `Layer` of Phaser 4 allows with containers (`docs/guides/phaser4-troubleshooting.md`). Decided by the product owner on 2026-11-22.

- **Today.** The button to leave and the confirmation dialog are drawn over the result (`LEAVE_BUTTON_DEPTH`, `CONFIRM_DIALOG_DEPTH`); the notices and the message of a rejected action (`TURN_NOTICE_DEPTH`, `REJECTION_MESSAGE_DEPTH`) are over the confirmation dialog; and each card of the hand takes its depth in `HandView`. `VIEW-68` changes the three.
- **`hide()` stays.** The order of the layers puts the result over the HUD, but `VIEW-23` asks that the HUD is not drawn at all, not that it is under the veil.

### The two systems

`HudSystem` (`core/HudSystem.ts`) and `ScenerySystem` (`core/ScenerySystem.ts`) are systems of `core/` that always exist, as the other systems (section 3). Each one holds the active skin of its element, `DEFAULT_HUD_SKIN` and the default battlefield skin until Phase 15, and the skin chosen in the settings is given to it with `setSkin` (`FX-12`, `UI-27`), also when no game is shown. Each one is the only one that creates the parts of its element: a view that shows one of them asks the system for it, and never creates it with `scene.add` and a style of its own. `core/` already imports views of `game/` (`CameraSystem`, `core/interactions/`), so both follow an existing pattern. Decided by the product owner on 2026-11-22.

```
core
├── HudSystem ── HudSkin
│   ├── createButton / createPanel / createText / createFocusFrame / createMark(scene, options)
│   │     → a SkinnedPart of the HUD
│   ├── getTurnPanel / getMenuButton / getSpectatorLabel / getCardSidePanel(scene)
│   │     → the single part, created on the first call
│   ├── createResult(scene)  → the panel of the result and its texts
│   ├── accentColor / accentAlpha / buttonFill / panelBackground  → values of the active skin
│   ├── hide() / show()  → the parts of the HUD, not those of the result
│   └── setSkin(skin)  → restyles every part it created
└── ScenerySystem ── BattlefieldSkin
    ├── createBattlefield(scene, options)  → the SkinnedPart of each part of the battlefield, the darkening and the two effect layers
    ├── effectLayer(place) / battlefieldArea()  → where an effect of the battlefield draws, and inside what
    └── setSkin(skin)  → restyles every part it created
```

- **Creating.** One method for each kind of piece, never one for each part: what tells one part from another of the same kind goes in the options the method receives, so a new part does not add a method. A button to leave is `createButton(scene, { text: getText('ui.game.leave'), role: 'NEUTRAL' })`, not `createLeaveButton(scene)`, and its text comes from `core/Texts.ts`, as every text. The method receives the scene, because the system exists before any scene, and returns a `SkinnedPart`.
  - For the HUD: `createButton`, `createPanel`, `createText`, `createFocusFrame` and `createMark`. `createMark` receives which mark of the legend of `VIEW-58` it is, as a key of a literal union (section 4): `ZoneSlotView` asks `HudSystem.createMark(this.scene, { mark: 'ATTACK_NOT_ALLOWED' })`, gives it the corners of its slot and keeps the mark as a child.
  - For the battlefield: `createBattlefield(scene, { battlefield })`, whose mode picks how it is drawn.
  - **Single parts.** A part that exists only once on the screen has a method of its own, which creates it on the first call and returns the same instance on the next ones: `getTurnPanel` (`VIEW-44`), `getMenuButton` (`VIEW-60`), `getSpectatorLabel` (`VIEW-28`) and `getCardSidePanel` (`VIEW-14`). They are the only parts with a method of their own, besides the result (`createResult`, see `HudSystem`).
  - **Values of the skin.** `accentColor`, `accentAlpha`, `buttonFill` and `panelBackground` give a value of the active skin to a view that needs it, read at every call, so a view never keeps one.
  - **[OPEN]** Which piece of `FX-17` draws the health bar of a leader (`VIEW-50`), the veil of the confirmation dialog, the veil of the result and the background and the shadow of the side panel of a card, which have none today. Until it is decided they keep the colors of `Palette`, and a skin does not change them.

  Decided by the product owner on 2026-11-22.
- **Placing and sizing.** A view asks the system for a part; the system creates it, or takes the single one, and gives it back. The view then places and sizes it with the methods of the part, when its kind allows it: every part has a position; a panel and a focus frame, a width and a height; a mark, the corners of its slot; a text and a button take their size from their text. The view can change them at any time, as the panel of the turn when its text changes, and the part is drawn again inside them. They are methods of the part, with no interface of TypeScript: one becomes an interface when two implementations of it exist (`docs/constitution.md`, section 4). The system draws only inside the size of the part (`FX-18`), does not place, does not animate and does not know the game state. The second signal of a mark (`VIEW-39`) is not of the skin (`FX-10`) nor of the game state: `HudSystem` reads it from `EffectSettings`, which reads it once when the page loads (`UI-31`). Decided by the product owner on 2026-11-22.
- **Keeping the parts.** Each system keeps the `SkinnedPart`s it created and forgets one when it is destroyed (the `DESTROY` event): the board is drawn again on every change (`GameScene.renderZones`), and its marks and its table with it. A part taken out of its view without being destroyed would be kept forever, so a test draws the board several times and checks that the system keeps as many parts as one drawing creates. A single part is forgotten the same way, and the next call creates it again: a scene that restarts destroys every object, so the system never returns a part of a scene that no longer exists. Decided by the product owner on 2026-11-22.
- **`setSkin(skin)`.** Every part kept takes the style of the new skin, so no view takes part. The skin only gives the style of a part: its colors, alphas, fonts, frames and thicknesses, and the look of each mark, which is a style too. What a part shows is of the view, which changes it on the part at any time: the text of a button or of the turn panel, the fill of a health bar, the corners of the slot of a mark. So a new style never brings back an old text or an old shape. Decided by the product owner on 2026-11-22.
- **Animations.** The view animates its part: the pulse of the end turn button (`VIEW-38`) and of the frame of a card that can attack (`VIEW-17`) stay in their views (`FX-22`). An animation that changes a color of the part, such as the pulse of the end turn button or the change of a button under the pointer, reads the color from the active skin, by the role of the part, at every step, and never keeps one from when it started: after a `setSkin` it takes the colors of the new skin. Decided by the product owner on 2026-11-22.

#### `SkinnedPart`

One part drawn with a skin. A concrete class, generic over the type of the skin, used by composition from both systems, with no interface and no inheritance (`docs/constitution.md`, section 4). Decided by the product owner on 2026-11-22.

- **Two layers.** It has a container of the view, whose place, visibility, alpha and tweens are of the view. Inside, the layer it draws, which only the `SkinnedPart` touches. So showing the HUD again does not show a mark that the view had hidden, such as the frame of a card lifted as the attacker (`VIEW-4`). A container has no origin, and its scroll factor only reaches its children with `updateChildren`, which the input of a button fixed on the screen needs: what building it finds goes in `docs/guides/phaser4-troubleshooting.md`.
- **Role.** The view never gives a part a color: it gives it a role of the skin, that is a level of text, an accent (`LOCAL_TURN`, `POSITIVE`, `NEGATIVE`, `DISABLED`) or a kind of button, and changes it at any time. The text of the turn takes `LOCAL_TURN` on the turn of the local player, and the title of the result `POSITIVE` or `NEGATIVE`.
- **Style.** It keeps the function that gives the style of the skin to its layer, and its role. `restyle(skin)` calls it again with the new skin, the role it has and what the layer shows at that moment: a text keeps its text and its role and takes the font and the color of the skin for that role, and a mark is drawn again over the corners it has, with the look of the skin. So a new skin never takes away the color of the turn.
- **Hidden.** `hide()` and `show()` hide or show its layer. They do not touch the input: Phaser 4 does not send the pointer to a hidden object nor to the children of a hidden container (`InputManager.inputCandidate`), so a hidden button cannot be clicked. The keyboard handlers of a view are not covered by it, which is why the result closes the confirmation dialog (`VIEW-23`).

#### `HudSystem`

- **The HUD and the result.** The result is drawn with the same pieces (`FX-10`) but is not part of the HUD, so it has a method of its own, `createResult(scene)`, which returns the panel of the result and its texts as `SkinnedPart`s and keeps them apart from those of the HUD: `setSkin` restyles both, and `hide()` and `show()` only touch the parts of the HUD.
- **`hide()` and `show()`.** Every part of the HUD is hidden or shown at once, and a part of the HUD created while it is hidden is created hidden. The result calls `hide()` when its veil starts (`VIEW-23`), and the confirmation dialog closes then without being answered, so no hidden part listens to the keyboard. `GameScene` calls `show()` when it is created, so the HUD hidden by the result of a game is not hidden in the next one.

Decided by the product owner on 2026-11-22.

#### `ScenerySystem`

- **Its parts.** The parts of the battlefield of `FX-10`: the surface under the zones, its edge, its grid, its sides and its legs (`VIEW-57`), and what is seen around it. The zones, the slots and the cards are not its parts, since the battlefield does not change them (`FX-10`).
- **The surroundings.** Today what is seen around the table is the background image of the page (the `background-image` of `html` and `body` in `App.vue`), which the menus share. `createBattlefield` draws it in Phaser, so a skin of the battlefield changes it and the menus keep the background of the page.
- **The darkening of the accessible mode** (`VIEW-45`). `createBattlefield` draws it, with no skin, between the effect layer behind the table and the table (`VIEW-68`). Today it is the background color of the camera (`GameScene.init`), under the whole canvas, which the surroundings would cover once Phaser draws them.
- **Mode and skin.** The mode of the board picks how the battlefield is drawn, with `BattlefieldViewStrategy` and its dispatcher (section 3), and the skin only gives its values. The mode is `battlefieldType`, which today is in `domain/BattlefieldSkin` (`battlefield.skin.battlefieldType`) and moves to `domain/Battlefield` with the value it has today, while the skin leaves the domain: it is a preference of the player, not game state (`FX-12`).
- **No `hide()` nor `show()`**: no rule hides the battlefield, and the result leaves it under its veil (`VIEW-23`).

Decided by the product owner on 2026-11-22.

### Effects over a skinned element

An effect changes how an element is seen for a while, without changing its skin nor its layout (`FX-10`, `FX-15`): it is drawn over the parts of the element by the effects of `core/visual_effects/`, and the system of the element only gives it the place to draw. Decided by the product owner on 2026-11-22.

```
Event confirmed by the server (CON-17)
└── queue of AnimationSystem (CON-12)
    └── animation of the event
        └── effect of the card (FX-22), or else of its rarity (FX-1, FX-16), described by data (FX-3)
            ├── effectLayer() of the system of the element  → where it draws, over the parts of the element
            ├── area of the element  → the shape it draws inside
            └── draws, plays, and empties the layer
```

- **The two effect layers of the battlefield.** `createBattlefield` creates, besides the surroundings, the darkening and the table, two empty layers with no skin: one behind the table and over its surroundings, and one over the table and under the zones. An effect says in its data which one it draws in, and asks for it with `effectLayer('BEHIND_TABLE')` or `effectLayer('OVER_TABLE')`. `ScenerySystem` creates both once for each scene and keeps them when the board is drawn again (`GameScene.renderZones`): they are taken out of what is destroyed and put back at their place in the new board, so an effect goes on while the next events play (`FX-23`). It never draws in them: only the effects do, so the zones, the slots and the cards stay over every effect of the battlefield (`FX-23`). They are created with the first effect of the battlefield, which is Post-MVP (`FX-23`), and not before: until then `createBattlefield` draws only the surroundings, the darkening and the table. Decided by the product owner on 2026-11-22.
- **The darkening of the accessible mode** (`VIEW-45`) is over the layer behind the table, so an effect there is darkened as the surroundings are, and the board keeps standing out over it.
- **The skin stays under the effect.** The parts of the element are not changed, and a `setSkin` during an effect restyles them under it. When the effect ends, its layer is empty and the element shows its skin again, with nothing to restore.
- **The effect is data.** Which effect plays is found from the card (`FX-22`), then from its rarity (`FX-1`), with no branch in the code of each card (`FX-3`). An effect of a new kind adds its code once to `core/visual_effects/`, and any card or rarity uses it by data.
- **Settings.** The effects are non-essential (`FX-2`): with low quality or reduced motion they do not play (`FX-13`).
- **The HUD.** The same scheme gives an effect layer to `HudSystem` when an effect of the interface needs one (`FX-2`). None is specified yet, so it is not created.

### Migration

The steps from the code of today to these systems are Phase 11.9 of `docs/roadmap/roadmap.md`, in order. Decided by the product owner on 2026-11-22.
