# Frontend Test Style Guide

Mandatory conventions for the tests in `frontend/`. Complements `agents/CODESTYLE.md` (section 9) and `agents/FRONTEND-CODESTYLE.md`.

The existing tests already mostly follow this guide. Where the existing code departs from it, the golden rule of `agents/CODESTYLE.md` applies.

---

## 1. Framework and setup

- Vitest with `jsdom`, `globals: true` and `vitest.setup.ts` (`vitest.config.ts`). Run with `npm run test:run` (single run) or `npm test` (watch).
- `vitest.setup.ts` replaces `HTMLCanvasElement.getContext` with a fake 2D context so Phaser code can be imported. Extend that fake instead of mocking the canvas in each test.
- Even though globals are enabled, always import explicitly: `import { beforeEach, describe, expect, it, vi } from 'vitest';`.
- Test files are type-checked by `tsconfig.test.json` and linted by ESLint like any other file.
- No new test libraries (Testing Library, Sinon…) are added without asking first.
- Everything in this guide is about the Vitest tests, except section 14, which is about the browser tests.

---

## 2. Location and names

- Tests live in `frontend/test/`, mirroring the structure of `src/`, with the `.test.ts` suffix: `src/core/StoreSystem.ts` → `test/core/StoreSystem.test.ts`.
- One test file per unit under test. Mapper-style tests that cover several small functions of a layer may share a file (`test/api/ApiMappers.test.ts`).
- Imports use the `@/` alias, like production code. Relative paths are forbidden.
- Type-only imports use `import type` and go first, as in `FRONTEND-CODESTYLE.md` section 4.

---

## 3. Structure

- `describe('UnitName', ...)` at the top, named exactly after the class, module or function under test.
- A nested `describe` per method or per scenario group (`describe('connect', ...)`, `describe('hand', ...)`, `describe('after applying a game', ...)`).
- `it('...')`, not `test`. The message is the name of the test and must be **as concise and descriptive as possible about what is actually being verified**.
  - Format: a verb in the present tense plus the result, plus the condition only when it changes the outcome. `<verb> <result> [when|for|on <condition>]`.
  - No "should", no "test that", no "it", no "correctly", no "properly". The enclosing `describe` already names the unit and the method, so the message does not repeat them.
  - Say the concrete outcome, not a category: the value returned, the state reached, the request sent, the error thrown.
  - Target 3 to 8 words. If it needs more, the test is probably checking more than one behavior: split it.
  - Good: `returns 0 for zero cards`, `throws when game is not initialized`, `sends POST to leave endpoint`, `rejects drop outside a zone slot`, `completes after grab and drop`, `emits GAME_START on socket event`.
  - Bad: `works`, `test 1`, `should work correctly`, `returns correct result`, `handles the case where the user is not logged in and tries to leave the party`, `leaveParty sends POST` (repeats the unit name already in `describe`).
- Names of tests in the same `describe` must be different from each other and must read as a list of behaviors of that unit.
- Order inside a `describe`: constants and helpers, `let` declarations, `beforeEach`, the `it` blocks.

---

## 4. Setup

- Shared data is declared with `let` in the `describe` and assigned in `beforeEach`. Nothing is initialized at module level except pure factories (`function createEvent(...) { ... }`) and constants.
- `beforeEach` always starts by clearing mock state: `vi.clearAllMocks()` for `vi.fn()` and module mocks, `vi.restoreAllMocks()` when `vi.spyOn` was used (as in `PartyApi.test.ts`).
- Prefer a **fresh object per test** over shared mutable state. `afterEach` is only needed to undo what `beforeEach` could not (fake timers, global stubs): `vi.useRealTimers()`, `vi.unstubAllGlobals()`.
- **Module-level singletons** (`StoreSystem`, `EventSystem`) keep state between tests of the same file. Reset them explicitly in `beforeEach` through their own API (`StoreSystem.clearGame()`) or isolate the module with `vi.resetModules()` plus a dynamic `import()`. A test must not depend on the order in which tests run.
- Deterministic data only. Time-dependent code uses `vi.useFakeTimers()`; never real `setTimeout` waits. Randomness is stubbed (`vi.spyOn(Math, 'random')`) when it influences the result.
- Values the test asserts are written explicitly in the test, not computed with the same logic as the code under test.

---

## 5. What to test

A test that covers a rule cites its identifier in a comment above the test: `// UI-6`.

Test what can be isolated from Phaser and the browser:

| Layer | What is tested |
|---|---|
| `api/` | URL, method and body of each REST call; DTO ↔ domain mapping; socket binding, reconnection and event dispatch. |
| `core/` | Load planning (`GameLoadPlanner`), store behavior, camera calculations and movement, interaction managers, tween parameters. |
| `game/` | Pure layout and geometry (`HandLayoutCalculator`, `ZoneLayout`, `CardStackLayoutHelper`), text and color utilities. |
| `domain/` | Behavior of domain classes when they have logic. |

Not tested:

- Appearance (pixels, colors on screen, animation smoothness).
- A real `Phaser.Game`, a real scene or a real canvas.
- Vue components' markup. Their logic belongs in `controllers/` or `core/`, which are tested.

Cases to cover, when applicable: default state, valid inputs, boundaries (0, 1, many; negative values), invalid or out-of-order input, state changes after a call, and the cleanup path (listeners removed, objects destroyed).

Every contract change with the backend (`EventDto`, `ActionDto`, `GameEventCode`, a DTO) comes with a mapping test in `test/api/`.

Every bug found is reproduced first with a failing test, then fixed.

---

## 6. Parameterized tests

They replace loops and copied tests that only change the data. No `for`, `forEach` or `if` inside a test.

```ts
it.each([
    { cards: 1, expected: DEFAULT_SPACE_BETWEEN_CARDS.max },
    { cards: 0, expected: 0 },
    { cards: -1, expected: 0 }
])('returns $expected spacing for $cards cards', ({ cards, expected }) => {
    const calculator = new HandLayoutCalculator();

    expect(calculator.calculateSpaceBetweenCards(cards)).toBe(expected);
});
```

- Prefer an array of objects with named fields over arrays of positional values.
- The expected result is always a field named `expected`.
- Use `it.each` only when the behavior is the same; different behaviors get different tests.

---

## 7. Arrange, Act, Assert

- *Arrange*: create the objects and their initial state.
- *Act*: execute the code under test.
- *Assert*: check the result.

The three steps are separated by a blank line and go in that order. They are not commented. When the act and the assertion are the same expression (`expect(() => ...).toThrow()`, `expect(isFinalRejection(error)).toBe(true)`), only the arrange is separated.

```ts
it('sends POST request to the leave endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({} as Response);
    const partyCode = 'party/test=1';

    await partyMemberApi.leaveParty(partyCode);

    expect(fetchSpy).toHaveBeenCalledWith(`/party/${toBase64UrlSafe(partyCode)}/leave`, { method: 'POST' });
});
```

---

## 8. Assertions

- **One behavior per test.** Several `expect` calls are allowed only when they describe the same behavior (for example the method and the body of one request). Independent results go in separate tests.
- Use the most specific matcher: `toBe` for primitives and references, `toEqual` for structures, `toBeCloseTo` for floating point, `toThrowError('message')` or `toThrow(ErrorClass)` for errors, `toHaveLength` for arrays.
- `expect.objectContaining` / `expect.any(Function)` are for shapes the test does not control. Do not use them to avoid writing the value that matters.
- Promises are awaited: `await expect(promise).rejects.toThrow(...)`. A test never returns before its async work finishes.
- Assert the observable result (return value, store state, emitted event, data sent to the API) before asserting calls. See section 9 for when asserting calls is acceptable.
- No assertions that verify nothing (`expect(true).toBe(true)`), no re-implementing the production logic inside the test, and no `if` guarding an assertion.

---

## 9. Fakes, stubs and mocks

General rules in `agents/CODESTYLE.md`, section 9: fakes before mocks.

### Order of preference

1. **The real object**, when it is pure and cheap (`HandLayoutCalculator`, `planLoad` of `GameLoadPlanner`).
2. **A minimal fake object** with only the members the code under test uses, built inline or by a small factory, and cast once with `as unknown as T` (`mockSocket`, `mockScene`, `createEvent`).
3. **`vi.fn()` stubs** on those fake objects, to control return values and to observe calls at the boundary.
4. **`vi.spyOn`** for browser and global APIs (`globalThis.fetch`, `localStorage`, `Math.random`). Always restored with `vi.restoreAllMocks()`.
5. **`vi.mock('@/path')`** for module-level collaborators that cannot be injected, such as static systems (`CardAnimator`, `CardInteractionDispatcher`, `LocalStorageApi`). The mock factory returns only the exports that the test needs.

### Rules

- Phaser objects are never created for real. Fakes mimic the shape the code uses (`scene.tweens.killTweensOf`, `scene.input.activePointer`), not the whole Phaser API.
- A fake that is needed by more than one test file moves to a shared factory function in `test/fakes/` (for example `test/fakes/createMockScene.ts`), instead of being copied. Not in `test/support/`: `tsconfig.json` resolves `@/` in `src/`, `test/` and `e2e/`, and `@/support/` already names `e2e/support/` (section 14). The `@/` alias of `vitest.config.ts` only resolves `src/` today, so the first shared fake also adds `test/` to it. Create the helper on the second use, not before.
- Dependencies that the class accepts by constructor or options (`SocketService` receives `socketFactory`, `eventHandler`, `reconnectHandler`) are injected as fakes; `vi.mock` is not used for them.
- Asserting calls (`toHaveBeenCalledWith`) is acceptable **at a system boundary**: what was sent to `fetch`, what was emitted on the socket, what was dispatched to another system. It is not acceptable to assert the internal calls between two collaborators of the unit under test.
- `any` in tests is tolerated only to cast fakes (`as any`); prefer `as unknown as T`. New tests do not add `any` for convenience in assertions.
- Network is never real: every `fetch` is stubbed before the code runs. A test that would open a real socket or request fails by design.

---

## 10. Async and timers

- `async`/`await` in tests, never `done` callbacks.
- Timers and `requestAnimationFrame`-based code use `vi.useFakeTimers()` and `vi.advanceTimersByTime(ms)`; `afterEach` restores real timers.
- Event-driven code is tested by invoking the handler registered on the fake (`mockSocket.on.mock.calls`), not by waiting.
- Tween and animation code is tested through the parameters passed to the fake `scene.tweens.add` (target, duration, properties), never through rendering.

---

## 11. Test data

- Create the data each test needs inside the test, or with a small factory function at the top of the file (`createMockGameState()`).
- Factories return a valid object by default and accept overrides: `createCard({ health: 0 })`.
- Use the real domain classes (`Party`, `Card`, `Zone`) when they are simple to build; use plain object fakes otherwise.
- Codes and names are literal and readable (`'player-1'`, `'party-1'`), never random.
- JSON samples of backend payloads live in `test/fixtures/` only if they are reused by more than one test; otherwise they are inline.

---

## 12. Style

- Indentation and quotes follow Prettier (`.prettierrc.js`); the tests are linted by the same ESLint config. `npm run lint` must pass.
- Short tests and descriptive names. No comments explaining obvious steps; a comment is allowed for the *why* of an unusual setup.
- No `console.log`, no `.only`, no `.skip` or `.todo` committed. A skipped test is a bug in the making: fix it or delete it.
- `vitest.config.ts` uses `silent: 'passed-only'`: a passing test prints nothing, a failing one shows its output. Do not add logging to make a test pass.

---

## 13. Definition of done for tests

- [ ] `npm run test:run` passes with no new failures
- [ ] `npm run lint` passes
- [ ] New or changed behavior has tests; changed backend contracts have mapping tests
- [ ] No test depends on execution order, real time, randomness or network
- [ ] Module-level state is reset in `beforeEach`
- [ ] Mocks are cleared or restored in `beforeEach`; timers and global stubs are restored in `afterEach`
- [ ] No `.only`, `.skip`, `console.log` or unnecessary `any`

---

## 14. Browser tests

Playwright tests of what Vitest cannot reach: a real `Phaser.Game` with WebGL, the appearance of the view and the interaction on the canvas.

- They live in `frontend/e2e/` with the `.spec.ts` suffix. Run with `npm run test:e2e`, and `npm run test:e2e:update` to regenerate the reference images. `npm run test:run` does not run them.
- `test.describe` and `test` take the place of `describe` and `it`. Names follow section 3. `test` and `expect` come from `@/support/test`, whose automatic fixture installs the double. The `@/` alias also resolves `e2e/`.
- Playwright starts Vite on a local port. Everything else is a double at the network boundary: `page.route` for REST and the resources, and `page.routeWebSocket` for the socket. A request the double does not expect fails the test.
- Nothing that exists only for the tests goes in `src/`. The canvas has no DOM, so a position on it is a named constant for the fixed viewport, and the result is asserted on what reaches the double or on a screenshot.
- The render settings live only in `playwright.config.ts`, no test depends on the operating system, the reference images are stored per platform, and the version of `@playwright/test` is exact.
- A reference image is committed only after a person approves it. Each area of the screen has its own limit of different pixels, measured from the noise of several runs.
- A person installs the browser with `npx playwright install chromium`, because the download is not a declared dependency.
