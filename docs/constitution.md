# CONSTITUTION

The absolute rules of CRM Game. They hold for `backend/` and `frontend/`, in every phase, and they are not traded for convenience: code that breaks one is rejected in review, whatever the task. How the code is written in each application (structure, names, formatting, style of the tests) is in the `backend-conventions` and `frontend-conventions` skills (`.claude/skills/backend-conventions/SKILL.md`, `.claude/skills/frontend-conventions/SKILL.md`), which are mandatory too but gives way to this file when they disagree.

A rule here changes only by decision of the user, asked first (`CLAUDE.md`), like a closed decision of `docs/roadmap/decisions.md`.

---

## 1. Applying the conventions

**Golden rule: do not break existing patterns.** The repository already contains design decisions (Template, Strategy, Factory, Facade in the domain; static systems in the frontend). This paragraph is the only rule for code that does not comply with the conventions. New code follows the conventions, also inside a module that does not. Only when a convention clashes with a design pattern established in the module does the module win, and you flag it. Existing code is fixed only when the task already changes that function or test, in a separate commit; the rest is not touched.

---

## 2. Priorities

Principles conflict with each other. When that happens, the order is:

```text
1. KISS        the simplest solution that solves today's problem
2. YAGNI       do not build what nobody asked for
3. Readability code is read far more often than it is written
4. DRY         remove real duplication, not superficial similarity
5. Extensible  make foreseeable change easy, not every imaginable change
```

**KISS always wins.** If an abstraction needs to be argued for, it is not needed.

Practical corollary on DRY: two pieces of code that look alike today but change for different reasons are **not duplication**. Unifying them creates coupling that will cost more than the repetition. The rule of three applies: factor out on the third occurrence, not before.

---

## 3. The backend is the authority

The system is made of two applications:

```text
frontend (Vue + Phaser)  ──REST (actions, party, user)──►  backend (Spring Boot)
        ▲                                                        │
        └────────────── Socket.IO (game events) ◄────────────────┘
```

- **The backend is the authority over the game state.** The frontend is a view: it sends commands and renders the events it receives; it neither decides nor mutates game state before the server confirms.
- The authoritative state of the frontend only changes when an event arrives from the backend (`CON-17`). **Optimistically mutating the board, the hand or the turn is forbidden**, except for purely visual previews that are reverted.
- The player's identity is determined by the session (session `User`), **never by a request field**. Every use case that receives an `ActionDto` checks that the `gameCode` and the `sourcePlayerCode` belong to the session user (see `PlayerUsecase.performAction`).
- The frontend never trusts another player's hidden state: it neither receives nor stores the opponent's hand.

---

## 4. Architecture and dependencies

The backend follows a hexagonal architecture in rings:

```text
┌──────────────────────────────────────────────┐
│ Adapters: input  (controllers, events)       │
│           output (persistence, clients)      │
│   ┌──────────────────────────────────────┐   │
│   │ Use cases and services               │   │
│   │   ┌──────────────────────────────┐   │   │
│   │   │ Domain                       │   │   │
│   │   └──────────────────────────────┘   │   │
│   └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

The concrete packages and folders are in the skills of each application (`.claude/skills/backend-conventions/SKILL.md`, section 1, and `.claude/skills/frontend-conventions/SKILL.md`, section 1).

### Dependency rule

- An outer ring may use any inner ring.
- An inner ring does not know the outer ones, **except to make a request** through an interface defined in `domain`.
- `domain` imports nothing from outside `domain`: no other project packages, no Spring, no Jackson. This holds today and is maintained. (`slf4j` is tolerated for logging.)
- In the frontend:

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

### When to create an abstraction

This is where clean architecture degenerates into over-engineering.

The rule is literal:
> **Two implementations that exist today → interface. Only one → concrete class.**

For the cases without an interface, testability is solved with dependency injection and a fake object in the tests. Interfaces are not created "just in case", unless their purpose is justified.

Exceptions already established in the repository, which are respected:

- The repository ports in `domain/repositories` (the in-memory implementation lives in `persistence/memory`).
- The `*Controller` interfaces carrying the HTTP annotations (`.claude/skills/backend-conventions/SKILL.md`, section 1).
- The domain extension points that already exist: `Action`, `GameFlow`, `GameModeStrategy`, `DealStrategy`, `GameModeFactory`, `GameModeEventDispatcher`, `BattlefieldViewStrategy`, etc.

### Composition over inheritance

- For **new** code, inheritance is limited to exceptions and to the schemes that already exist in the module (Template: `ActionContextTemplate`). If you add an action or a mode strategy, you follow the existing scheme.
- **Inheritance to reuse code is forbidden** outside those schemes. If two classes share logic, it is extracted into a function or an injected collaborator.
- Maximum depth: one level.

---

## 5. No magic values

No numeric or text literal with meaning appears embedded in the logic.

- **Enum** (Java) or **literal union / `as const`** (TypeScript) for closed sets: `ActionType`, `CardType`, `WarriorRarity`, `GameModes`, `EventCode`.
- **Module constant** for fixed values: in the frontend, `src/core/Constants.ts`.
- **Configuration** for whatever an operator may want to change without recompiling: `application.properties` in the backend, `src/env.ts` / Vite environment variables in the frontend. Gameplay tuning (cooldowns, health, card damage) lives in the domain or in the card data, not scattered through the logic.
- Credentials: outside the repository (section 8).

A value cannot live in two places. Event names and exception codes shared between backend and frontend are a contract: they are declared once per side and must match (`EventCode` ↔ `GameEventCode.ts`, `ActionType` ↔ `ActionDto.ts`).

---

## 6. Specification and contract

- **Information that is not defined is not invented.** If the specification or the external contract does not say what a call returns, what fields a response has or what format a value uses, do not assume: do not parse it, do not model it and do not return it. Ask.
- No game rule that the code or the specification (`docs/specs/`) does not back is assumed, in the code or in a test.
- A change of the contract (a DTO, an `EventCode`, an `ActionType`) updates **both** sides and comes with a test that pins it down on each side.

---

## 7. Errors and resources

- In the backend, an action rejected by the game rules is expected behavior: it is returned as a result carrying an `ExceptionCode`, not thrown (`.claude/skills/backend-conventions/SKILL.md`, section 8). The player receives the code in the HTTP response to their request (`docs/specs/contract.md`, `CON-18`).
- When performing an action, everything that can reject it is validated before any state changes; an action never mutates the game and then undoes the change.
- Infrastructure failures (network, socket, serialization) are not disguised as game errors.
- Catch the specific. The generic error is only caught as a last net after the specific `catch` blocks, when it needs to be handled, logged or translated, and never to ignore it. If it is propagated, the original cause is preserved. Never an empty `catch`, nor one that swallows the error without logging it.
- Errors carry context (game code, player code, action), not just a message.
- Exceptions from external libraries are translated into own errors in the adapter (frontend: `SocketService`, `*Api`; backend: `controller/events`), preserving the original cause where appropriate.
- Resource cleanup (listeners, sockets, tweens, Phaser objects) goes in `try/finally`, try-with-resources where applicable, or in the object's own destroy method. A listener that is not unsubscribed accumulates in every game: every `on` without its `off` is a bug.

---

## 8. Security and private data

- Never secrets or passwords in code, in versioned configuration files, in logs or in error messages.
- Local configuration and credentials in `application.local.properties` (backend) and `.env.local.*` (frontend), outside the repository.
- **Logging sessions, tokens or the contents of `.env.local.*` is forbidden.** A player's hand (private information) is not logged at any level above `trace`, and the frontend never logs it.
- The identity of the player and the hidden state of the others: section 3.

---

## 9. Concurrency

Several players act on the same game at the same time.

- All the actions on a game are serialized: one writer at a time per game (a lock per `GameCode`). Every player goes through the same path.
- The game reacts to its events in the thread that published them (`GameEventMulticaster`), so an action ends after its consequences and the next one sees the state they left. Sending to the clients goes to the executor. An exception in a reaction reaches the action, which is answered as an unexpected failure (`CON-18`), so reactions do not throw game exceptions: the action is already applied and must not look rejected (`TURN-6`).
- **In-memory repositories must be safe under concurrency**: concurrent collections and atomic operations (`compute`, `computeIfAbsent`, `merge`), never `get` followed by `put`, without exposing the internal collections.
- Events and value objects are immutable once published.
- No shared mutable `static` state.
- Threads are created through a managed `ExecutorService`, never with `new Thread`. An `InterruptedException` is never swallowed: the interrupt flag is restored with `Thread.currentThread().interrupt()`.
- Concurrency has tests (`.claude/skills/backend-conventions/backend-tests.md`, section 15).

---

## 10. Time and randomness

- The backend domain does not call `Instant.now()`, `LocalDate.now()`, `System.currentTimeMillis()` nor `Math.random()`. The clock is injected as a `Clock` and randomness as a `RandomGenerator` (seeded in tests).
- Tests are deterministic: they do not depend on the real clock, on real waits (`Thread.sleep()`, real `setTimeout`) nor on uncontrolled randomness. A value the test asserts is set explicitly, never left to chance: a test cannot pass or fail depending on the draw.

---

## 11. Tests

- **Unit tests do not touch the network, real ports, a database or the disk outside a temporary folder** (`tmp`, or `@TempDir` in the backend). If a test needs any of that, it is an integration test and is kept separate from the unit tests.
- Integration tests use local doubles (in-memory repositories, test populators, simulated `fetch` and socket). Never a real service.
- Browser tests only reach the local Vite server. REST and the socket are local doubles at the network boundary.
- Nothing that exists only for the tests goes in production code: production files hold nothing that exists only to be tested or to build fixtures.
- **Fakes before mocks.** The backend already has `DummyGameStrategy`, `DummyPlayer`, `DummyZone`, builders (`CardBuilder`, `GameBuilder`, `PlayerBuilder`…) and monitors (`EventMonitor`): reuse them before creating new ones (`.claude/skills/backend-conventions/backend-tests.md`, section 9; `.claude/skills/frontend-conventions/frontend-tests.md`, section 9).
- A test checks results, not calls. Asserting calls is only acceptable at a system boundary (what was sent to `fetch` or to the socket).
- No logic in tests: no `if`, no loops over cases. For several cases, use parameterized tests.
- Coverage percentages are not pursued. Cover what breaks in production.
- Every failure found in production enters first as a failing test, and is then fixed.

---

## 12. Banned anti-patterns

Rejected outright in review:

- Interfaces with a single implementation outside the exceptions in section 4
- "Future-proofing" abstraction layers
- Inheritance to share code
- New `utils`, `helpers`, `common` modules in production code. The shared fakes of the tests are not one (`.claude/skills/frontend-conventions/frontend-tests.md`, section 9)
- Catching the generic exception and ignoring it
- Direct console output (`System.out`, `console.log`) in production code, except the communication trace of the frontend `api/` (`.claude/skills/frontend-conventions/SKILL.md`, section 7)
- Magic values
- `switch`, in any form
- Untyped dictionaries crossing layers
- Code used only by tests outside the tests folder
- Business logic or game rules in the controller, in the `api` layer or in a Phaser view
- The frontend mutating the authoritative game state before the backend confirms
- Tests that verify calls instead of results
- Design patterns applied without a concrete problem that justifies them

---

## 13. Definition of done

Before considering a task finished:

- [ ] If the task includes code and logic, and tests were generated, they must pass
- [ ] New tests for the added behavior
- [ ] No magic values
- [ ] No secret in code, log or test
- [ ] External resources are released on the error path as well
- [ ] If a DTO, an `EventCode` or an `ActionType` changes: **both** sides of the contract are updated
- [ ] Documentation updated if the contract or the configuration changes
