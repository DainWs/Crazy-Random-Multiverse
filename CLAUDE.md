# CLAUDE.md

Persistent project context. Read it in full before any task.

## Project

The game is a strategic showdown in which each player receives a random leader card, which is displayed publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

Monorepo with two applications:

- `backend/` — Java 17, Spring Boot 3.1, Socket.IO (`netty-socketio`). Authority over the game state. In-memory state. Tests: `mvn test` (the `*IntegrationTest` ones with `mvn verify -P integration-tests`, see `agents/BACKEND-TESTS.md`, section 14).
- `frontend/` — TypeScript, Vue 3, Phaser 4, Vite. View of the server state. Tests: `npm run test:run`; browser tests: `npm run test:e2e`; lint: `npm run lint`.

## Reference documentation

**Always** read these files before writing code:

- `agents/SPECS.md` — functional specification and index of `agents/specs/`. Source of truth for behavior.
- `agents/specs/CONTRACT.md` — the backend ↔ frontend contract.
- The files holding the rules cited by the bullets of the phase, and the files of the rules those rules cite directly. For a bullet that cites no rule, the file of its area. `agents/SPECS.md` has the index of prefixes.
- `agents/ROADMAP.md` — phased work plan and table of already-closed decisions.

Read these only when the task needs them:

- `agents/ROADMAP-ARCHIVE.md` — the closed phases of the roadmap. When the history of a closed phase is needed.
- `agents/ROADMAP-TEST.md` — the equivalent of the roadmap for tests: cross-cutting tests, visual regression and pending checks. When working on a test phase or recording something that could not be verified.
- `agents/VIEW-SPECS.md` — appearance of the interface. When the task changes how the interface looks, animates or sounds.
- `agents/PHASER4-SPECS.md` — known effects of Phaser 4 on the view: symptom, likely cause and where to look. When working on Phaser views or when something in the view looks or behaves wrong.
- `agents/CODESTYLE.md` — general conventions and architecture. When writing code in either application. They are not suggestions.
- `agents/BACKEND-CODESTYLE.md` — mandatory conventions for the backend. When writing backend code. They are not suggestions.
- `agents/FRONTEND-CODESTYLE.md` — mandatory conventions for the frontend. When writing frontend code. They are not suggestions.
- `agents/BACKEND-TESTS.md` — mandatory conventions for the backend tests. When writing backend tests. They are not suggestions.
- `agents/FRONTEND-TESTS.md` — mandatory conventions for the frontend tests. When writing frontend tests. They are not suggestions.

If anything you are about to do contradicts those documents, stop and ask. For code that does not comply with the guides, the golden rule of `agents/CODESTYLE.md` applies instead.

The PlantUML diagrams in `docs/development/diagrams/` (domain model, class diagrams, use cases) may be consulted at any time. They are only edited when user allow to do it.

The backend ↔ frontend contract is in `agents/specs/CONTRACT.md`. Do not invent what it does not define: ask.

---

## Absolute restrictions

### You do not run anything against real infrastructure

It is forbidden to run, in any context including tests:

- SSH or SCP connections to any host.
- Connections to deployed game servers or webhooks.
- Any outbound network access other than installing declared dependencies.

Starting the backend or the frontend locally to see a change is only done by a person, unless explicitly requested. The one exception is `npm run test:e2e`, which starts Vite on a local port for the browser tests.

Your job is to **write the code and its tests**. Execution against real systems is done by a person.

### Tests do not touch infrastructure

- Unit tests do not use the network, real ports, or disk outside `tmp`.
- Integration tests use local doubles (in-memory repositories, test populators, simulated `fetch` and socket). Never a real service.
- Browser tests only reach the local Vite server. REST and the socket are local doubles at the network boundary.
- Fakes before mocks.
- Test style guides: `agents/BACKEND-TESTS.md` and `agents/FRONTEND-TESTS.md`.

## Workflow

Work on **one roadmap phase per session**. Do not start the next one.

1. Read the indicated phase in `agents/ROADMAP.md`, or in `agents/ROADMAP-TEST.md` for a test phase.
2. Propose a short plan and wait for confirmation before writing code.
3. Before the first change, record in the phase the commit it starts from (the current `HEAD`): `Started at: <short hash>`.
4. Implement bullet by bullet.
5. Write the tests in the same commit as the code they test.
6. Record progress in the roadmap of the phase by changing `- [ ]` to `- [x]` on each completed bullet, in the same commit as the work that completes it.
7. When the phase is finished, close it in one last commit: write `Finished at: <short hash>`, the `HEAD` before that commit (the last commit of the phase), and move a closed phase of `agents/ROADMAP.md` to `agents/ROADMAP-ARCHIVE.md`. A test phase of `agents/ROADMAP-TEST.md` stays in its file. Then summarize what was done.

When asked to add a pending task to the roadmap, put it in the "Pending tasks" section by default. If the task is essential to complete a specific phase, put it in that phase instead.

Whenever something could not be verified (a check that needs a person, a real browser, a running server or anything outside the agent environment), record it as a `- [ ]` bullet in the "Pending checks" section of `agents/ROADMAP-TEST.md`, saying what to check and why it could not be done.

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
