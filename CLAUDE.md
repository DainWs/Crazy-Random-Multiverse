# CLAUDE.md

Persistent project context. Read it in full before any task.

## Project

The game is a strategic showdown in which each player receives a random leader card, which is displayed publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

Monorepo with two applications:

- `backend/` — Java 17, Spring Boot 3.1, Socket.IO (`netty-socketio`). Authority over the game state. In-memory state. Tests: `mvn test` (the `*IntegrationTest` ones with `mvn verify -P integration-tests`).
- `frontend/` — TypeScript, Vue 3, Phaser 3, Vite. View of the server state. Tests: `npm run test:run`; lint: `npm run lint`.

## Reference documentation

Always read these files before writing code:

- `agents/SPECS.md` — functional specification and index of `agents/specs/`, with one file per area. Source of truth for behavior. Read the files of the area you touch.
- `agents/VIEW-SPECS.md` — appearance of the interface.
- `agents/ROADMAP.md` — phased work plan and table of already-closed decisions.
- `agents/CODESTYLE.md` — general conventions and architecture. They are not suggestions.
- `agents/BACKEND-CODESTYLE.md` — mandatory conventions for the backend. They are not suggestions.
- `agents/FRONTEND-CODESTYLE.md` — mandatory conventions for the frontend. They are not suggestions.

If anything you are about to do contradicts those documents, stop and ask. Existing code that does not comply is not refactored on your own initiative: respect the patterns of the module you are touching.

The PlantUML diagrams in `docs/development/diagrams/` (domain model, class diagrams, use cases) may be consulted at any time. They are only edited when explicitly asked to.

The backend ↔ frontend contract is in `agents/specs/CONTRACT.md`. Do not invent what it does not define: ask.

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
3. Before the first change, record in the phase the commit it starts from (the current `HEAD`): `Started at: <short hash>`. In the same edit, close the previous phase with `Finished at: <short hash>`, which is that same `HEAD` (the last commit of the previous phase).
4. Implement bullet by bullet.
5. Write the tests in the same commit as the code they test.
6. Record progress in `agents/ROADMAP.md` by changing `- [ ]` to `- [x]` on each completed bullet, in the same commit as the work that completes it.
7. When the phase is finished, summarize what was done. Do not record `Finished at` yet: it is written when the next phase starts.

When asked to add a pending task to the roadmap, put it in the "Pending tasks" section by default. If the task is essential to complete a specific phase, put it in that phase instead.

Whenever something could not be verified (a check that needs a person, a real browser, a running server or anything outside the agent environment), record it as a `- [ ]` bullet in the "Pending checks" section of `agents/ROADMAP.md`, saying what to check and why it could not be done.

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

When a decision is the user's to make, ask it with a questionnaire (the `AskUserQuestion` tool, with options and a recommended one first), not with open questions in the chat text. The questionnaire does not replace the report: first give all the relevant information (findings, context, trade-offs, the plan), then show the questionnaire.

## Style reminder

The rules most often broken:

1. **KISS above all.** Interfaces with a single implementation: no. "Future-proofing" layers: no.
2. **No magic values.** Every literal with meaning is an enum, a constant or configuration.
3. **The backend rules.** The frontend does not mutate the game state before the server confirms.
