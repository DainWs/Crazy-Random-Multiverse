# CLAUDE.md

Persistent project context. Read it in full before any task.

## Project

The game is a strategic showdown in which each player receives a random leader card, which is displayed publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

Monorepo with two applications:

- `backend/` — Java 17, Spring Boot 3.1, Socket.IO (`netty-socketio`) and WebSocket. Authority over the game state. In-memory state. Tests: `mvn test` (the `*IntegrationTest` ones with `mvn verify -P integration-tests`).
- `frontend/` — TypeScript, Vue 3, Phaser 3, Vite. View of the server state. Tests: `npm run test:run`; lint: `npm run lint`.

## Reference documentation

Always read these files before writing code:

- `agents/SPECS.md` — functional specification. Source of truth for behavior. **Still to be created**; in the meantime, `docs/Requirements.md` and `docs/AISystem.md`.
- `agents/ROADMAP.md` — phased work plan and table of already-closed decisions.- `agents/CODESTYLE.md` — general conventions and architecture. They are not suggestions.
- `agents/BACKEND-CODESTYLE.md` — mandatory conventions for the backend. They are not suggestions.
- `agents/FRONTEND-CODESTYLE.md` — mandatory conventions for the frontend. They are not suggestions.

If anything you are about to do contradicts those documents, stop and ask. Existing code that does not comply is not refactored on your own initiative: respect the patterns of the module you are touching.

The backend ↔ frontend contract is partly unresolved (`agents/ROADMAP.md`, Phase 1). Do not invent it: ask.

---

## Absolute restrictions

### You do not run anything against real infrastructure

It is forbidden to run, in any context including tests:

- SSH or SCP connections to any host.
- Connections to deployed game servers or webhooks.
- Any outbound network access other than installing declared dependencies.

Starting the backend or the frontend locally to see a change is only done by a person, unless explicitly requested.

Your job is to **write the code and its tests**. Execution against real systems is done by a person.

### Tests do not touch infrastructure

- Unit tests do not use the network, real ports, or disk outside `tmp`.
- Integration tests use local doubles (in-memory repositories, test populators, simulated `fetch` and socket). Never a real service.
- Fakes before mocks.
- Test style guides: `agents/BACKEND-TESTS.md` and `agents/FRONTEND-TESTS.md`.

## Workflow

Work on **one roadmap phase per session**. Do not start the next one.

1. Read the indicated phase in `agents/ROADMAP.md`.
2. Propose a short plan and wait for confirmation before writing code.
3. Implement bullet by bullet.
4. Write the tests in the same commit as the code they test.
5. Record progress in `agents/ROADMAP.md` by changing `- [ ]` to `- [x]` on each completed bullet, in the same commit as the work that completes it.
6. When the phase is finished, summarize what was done.

## Commits

- In English, imperative, with a lowercase initial and no prefix
- Concise title: maximum 80 characters.
- One commit per significant checkpoint; not one per file nor one per whole phase.
- Never mix refactoring with functional changes in the same commit.
- Do not add signatures, co-authorships or references to tools.

## Language

- Markdown files are always written in English.
- When communicating with the user, reply in the user's language.

## Output style

- **Minimal comments.** Only the *why* when it is not obvious. Never comments that repeat what the code says.
- Do not generate files nobody asked for
- Do not write long summaries in the chat. What matters goes into the code or the documentation.

## Ask before doing anything if

- You are going to add a new dependency.
- You are going to create an abstraction, interface or layer that is not in `agents/CODESTYLE.md`.
- You are going to change something in the roadmap's table of closed decisions.
- A roadmap bullet is ambiguous or depends on a measurement that does not exist yet.

## Style reminder

The rules most often broken:

1. **KISS above all.** Interfaces with a single implementation: no. "Future-proofing" layers: no.
2. **No magic values.** Every literal with meaning is an enum, a constant or configuration.
3. **The backend rules.** The frontend does not mutate the game state before the server confirms.
