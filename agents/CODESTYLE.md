# CRM Game — Code Style Guide

General mandatory conventions for `backend/` and `frontend/`. Language-specific rules live in:

- `agents/BACKEND-CODESTYLE.md` — Backend (Java 17, Spring Boot, Socket.IO).
- `agents/FRONTEND-CODESTYLE.md` — Frontend (TypeScript, Vue 3, Phaser 3, Vite).

**Golden rule: do not break existing patterns.** The repository already contains design decisions (Template, Decorator, Strategy, Factory, Facade in the domain; static systems in the frontend). New code follows the rules in this guide; existing code is not refactored just because it does not comply. If a rule clashes with a pattern already established in the module you are touching, the module's pattern wins and you flag it.

---

## 0. Tie-break rule

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

## 1. Language

- **Code, names, logs and comments in English.**
- Existing exception messages in Spanish are tolerated; new ones are written in English.
- Documentation in `docs/` is written in English. Existing `TODO`s in Spanish are tolerated.
- Text the player sees does not live in the code: it is identified by key (`exception.*`, card `name` and `description`) and translated on the client (see `docs/Languages.md`).

---

## 2. Architecture

The system is made of two applications:

```text
frontend (Vue + Phaser)  ──REST (actions, party, user)──►  backend (Spring Boot)
        ▲                                                        │
        └────────────── Socket.IO (game events) ◄────────────────┘
```

**The backend is the authority over the game state.** The frontend is a view: it sends commands and renders the events it receives; it neither decides nor mutates game state before the server confirms.

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

The concrete backend package structure is in `agents/BACKEND-CODESTYLE.md` and the frontend's in `agents/FRONTEND-CODESTYLE.md`.

### Dependency rule

- An outer ring may use any inner ring.
- An inner ring does not know the outer ones, **except to make a request** through an interface defined in `domain`.
- `domain` imports nothing from outside `domain`: no other project packages, no Spring, no Jackson. This holds today and is maintained. (`slf4j` is tolerated for logging.)
- In the frontend, `domain` does not import Phaser, Vue or `api`.

### When to create an abstraction

This is where clean architecture degenerates into over-engineering.

The rule is literal:
> **Two implementations that exist today → interface. Only one → concrete class.**

For the cases without an interface, testability is solved with dependency injection and a fake object in the tests. Interfaces are not created "just in case", unless their purpose is justified.

Exceptions already established in the repository, which are respected:

- The repository ports in `domain/repositories` (the in-memory implementation lives in `persistence/memory`).
- The `*Controller` interfaces carrying the HTTP annotations (see backend).
- The domain extension points that already exist: `Action`, `GameFlow`, `GameModeStrategy`, `DealStrategy`, `GameModeFactory`, `GameModeEventDispatcher`, `BattlefieldViewStrategy`, etc.

Outside those cases, interfaces are not created "just in case". Testability is solved with dependency injection and a fake in the tests.

---

## 3. Composition over inheritance

- For **new** code, inheritance is limited to exceptions and to the schemes that already exist in the module (Template: `AbstractActionManager`, `ActionContextTemplate`; Decorator: `ArchiveConditionDecorator`). If you add an action, an AI goal or a mode strategy, you follow the existing scheme.
- **Inheritance to reuse code is forbidden** outside those schemes. If two classes share logic, it is extracted into a function or an injected collaborator.
- Maximum depth: one level.

---

## 4. Names

- Follow the Java community naming conventions for Java code, and the TypeScript ones for TypeScript code.
- Forbidden as a full name: `data`, `info`, `manager`, `helper`, `utils`, `handler`, `process`, `tmp`, `obj`.
- Boolean variables are affirmative: `isEnabled`, never `isNotDisabled`.
- No abbreviations except the universal ones: `id`, `dto`, `ui`, `ai`, `io`, `url`, `json`.
- The name says **what**, the code says **how**. If a comment is needed to explain what a function does, the name is bad.
- Names follow the game's domain vocabulary (see `docs/Requirements.md`): `Party`, `Game`, `Player`, `Zone`, `Board`, `Leader`, `Warrior`, `Spell`, `Equipment`, `Hand`, `Deck`, `Turn`. The same concept has the same name in backend and frontend.
- Entity codes are value objects with the `Code` suffix in the backend (`GameCode`, `PartyCode`, `PlayerCode`, `UserCode`, `CardCode`) and type aliases in the frontend.

---

## 5. No magic values

No numeric or text literal with meaning appears embedded in the logic.

- **Enum** (Java) or **literal union / `as const`** (TypeScript) for closed sets: `ActionType`, `CardType`, `WarriorRarity`, `GameModes`, `EventCode`.
- **Module constant** for fixed values: in the frontend, `src/core/Constants.ts`.
- **Configuration** for whatever an operator may want to change without recompiling: `application.properties` in the backend, `src/env.ts` / Vite environment variables in the frontend. Gameplay tuning (cooldowns, health, card damage) lives in the domain or in the card data, not scattered through the logic.
- Credentials: outside the repository (see section 10).

A value cannot live in two places. Event names and exception codes shared between backend and frontend are a contract: they are declared once per side and must match (`EventCode` ↔ `GameEventCode.ts`, `ActionType` ↔ `ActionDto.ts`).

---

## 6. Functions and modules

- A function does one thing. If its name needs an `and`, they are two functions.
- Target: fewer than 30 lines. It is a signal, not a hard limit; exceeding it must be justified.
- Maximum 3 positional parameters. Beyond that, they are grouped into a value object. (For backend constructors the maximum is also 3: see `BACKEND-CODESTYLE.md`.)
- Boolean parameters are forbidden in public signatures: turn it into two functions or an enum. A boolean at the call site forces you to open the definition to know what it means.
- Modules by responsibility, not by type.
- No `import *` or `import package.*`. Explicit imports.

---

## 7. Errors

- In the backend, game rules reject an invalid action with an exception from `domain.core.exception` (`GameException`, `PlayerActionException`, `NotAllowedException`…) carrying an `ExceptionCode`. These exceptions **are part of the game flow**: they are published to clients through `ExceptionPublisher` and the player receives them as an event. They represent rejected domain actions, not a generic flow-control mechanism.
- Infrastructure failures (network, socket, serialization) are not disguised as game errors.
- Catch the specific. The generic error is only caught as a last net after the specific `catch` blocks, when it needs to be handled, logged or translated, and never to ignore it. If it is propagated, the original cause is preserved.
- Errors carry context (game code, player code, action), not just a message.
- Exceptions from external libraries are translated into own errors in the adapter (frontend: `SocketService`, `*Api`; backend: `controller/events`), preserving the original cause where appropriate.
- Resource cleanup (listeners, sockets, tweens, Phaser objects) goes in `try/finally`, try-with-resources where applicable, or in the object's own destroy method. A listener that is not unsubscribed accumulates in every game.

---

## 8. Debuggability

- Logging through SLF4J in the backend. **Never `System.out`.**
- Structured logging. **Never write directly to the console** (`System.out`, `console.log`).
- The start and end of each step are logged, with measured duration.
- Levels: `debug` for adapter detail, `info` for state transitions, `warning` for recoverable situations, `error` for a step failure, `critical` for critical errors.
- Log entries for a game include its `GameCode`; those for a player, their `PlayerCode`.
- **Logging sessions, tokens or the contents of `.env.local.*` is forbidden.** A player's hand (private information) is not logged at any level above `trace`.
- Messages describe facts, not moods.

---

## 9. Tests

- Specific style guides: `agents/BACKEND-TESTS.md` (backend) and `agents/FRONTEND-TESTS.md` (frontend).
- **Unit tests do not touch the network, the real disk or a database.** If a test needs any of that, it is an integration test and is kept separate from the unit tests.
- **Fakes before mocks.** The backend already has `DummyGameStrategy`, `DummyPlayer`, `DummyZone`, builders (`CardBuilder`, `GameBuilder`, `PlayerBuilder`…) and monitors (`EventMonitor`, `ExceptionMonitor`): reuse them before creating new ones.
- No logic in tests: no `if`, no loops over cases. For several cases, use parameterized tests.
- Coverage percentages are not pursued. Cover what breaks in production.
- Every failure found in production enters first as a failing test, and is then fixed.
- Backend integration tests are named `*IntegrationTest` (excluded from `mvn test`, run with the `integration-tests` profile).

---

## 10. Security

- Never secrets or passwords in code, in versioned configuration files, in logs or in error messages.
- Backend: the player's identity is determined by the session (session `User`), **never by a request field**. Every use case that receives an `ActionDto` checks that the `gameCode` and the `sourcePlayerCode` belong to the session user (see `PlayerUsecase.performAction`).
- The frontend never trusts another player's hidden state: it neither receives nor stores the opponent's hand.
- Local configuration and credentials in `application.local.properties` (backend) and `.env.local.*` (frontend), outside the repository.

---

## 11. Git

- Small, atomic commits, in English, imperative and without prefix. The full format is in `CLAUDE.md`.
- The message explains the why when it is not obvious; the what is already in the diff.
- Refactoring is not mixed with functional changes in the same commit.

---

## 12. Definition of "done"

Before considering a task finished:

- [ ] If the task includes code and logic, and tests were generated, they must pass
- [ ] New tests for the added behavior
- [ ] No magic values
- [ ] No secret in code, log or test
- [ ] External resources are released on the error path as well
- [ ] If a DTO, an `EventCode` or an `ActionType` changes: **both** sides of the contract are updated
- [ ] Documentation updated if the contract or the configuration changes

---

## 13. Banned anti-patterns

Rejected outright in review:

- Interfaces with a single implementation outside the exceptions in section 2
- "Future-proofing" abstraction layers
- Inheritance to share code
- New `utils`, `helpers`, `common` modules
- Catching the generic exception and ignoring it
- Direct console output (`System.out`, `console.log`) in production code
- Magic values
- Untyped dictionaries crossing layers
- Code used only by tests outside the tests folder: production files hold nothing that exists only to be tested or to build fixtures
- Business logic or game rules in the controller, in the `api` layer or in a Phaser view
- The frontend mutating the authoritative game state before the backend confirms
- Tests that verify calls instead of results
- Design patterns applied without a concrete problem that justifies them

---

## 14. Comments and specification

- Minimal comments: only the *why* when it is not obvious. Never comments that repeat what the code says.
- **Information that is not defined is not invented.** If the specification or the external contract does not say what a call returns, what fields a response has or what format a value uses, do not assume: do not parse it, do not model it and do not return it. Ask.
- `TODO`s carry enough context to act on; no `TODO` is added without an owner or a reason.
