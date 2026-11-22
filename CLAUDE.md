# CLAUDE.md

Persistent project context. Read it in full before any task.

## Project

The game is a strategic showdown in which each player receives a random leader card, which is displayed publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

Monorepo with two applications:

- `backend/` — Java 17, Spring Boot 3.1, Socket.IO (`netty-socketio`). Authority over the game state. In-memory state. Tests: `mvn test` (the `*IntegrationTest` ones with `mvn verify -P integration-tests`, see `.claude/skills/backend-conventions/backend-tests.md`, section 14).
- `frontend/` — TypeScript, Vue 3, Phaser 4, Vite. View of the server state. Tests: `npm run test:run`; browser tests: `npm run test:e2e`; lint: `npm run lint`.

## Reference documentation

`docs/index.md` is the only index of the documentation: where each thing is and who writes it, which file holds each rule, and the list of the ideas. Paths are always written from the root of the repository.

**Always** read these files before writing code:

- `docs/constitution.md` — the absolute rules of the project: authority of the backend, architecture, no magic values, errors, security, concurrency, tests, banned anti-patterns and the definition of done.
- `docs/specs/readme.md` — conventions of the specification, architecture constraints and MVP scope. The specification is the source of truth for behavior.
- `docs/specs/contract.md` — the backend ↔ frontend contract.
- The files holding the rules cited by the bullets of the phase, and the files of the rules those rules cite directly. For a bullet that cites no rule, the file of its area. `docs/index.md` says which file holds each rule.
- `docs/roadmap/roadmap.md` — phased work plan.
- `docs/roadmap/decisions.md` — the decisions already closed.

Read these only when the task needs them:

- `docs/roadmap/roadmap-archive.md` — the closed phases of the roadmap. When the history of a closed phase is needed.
- `docs/roadmap/roadmap-test.md` — the equivalent of the roadmap for tests: cross-cutting tests, visual regression and pending checks. When working on a test phase or recording something that could not be verified.
- `docs/specs/ui/` — appearance of the interface: `effects/` for what happens after an action or an event, `components/` for each piece of the screen, the shared bases in its root, and in `docs/specs/ui/readme.md` the `VIEW` rules not moved yet to a file of their own. A component lists the effects it plays (`docs/index.md`, Appearance). When the task changes how the interface looks, animates or sounds.
- `docs/ideas/` — proposals not planned yet, with their status. When the task is about an idea, or a phase is planned from one. An idea is never a rule: what it says is built only once it is written in `docs/specs/`.
- `docs/guides/phaser4-troubleshooting.md` — known effects of Phaser 4 on the view: symptom, likely cause and where to look. When working on Phaser views or when something in the view looks or behaves wrong.

Before writing, changing or reviewing code or tests, load the skill of the application: `backend-conventions` for `backend/` and `frontend-conventions` for `frontend/` (`.claude/skills/`), with the mandatory conventions of the application and of its tests. A task that touches both loads both. They are not suggestions.

If anything you are about to do contradicts those documents, stop and ask. For code that does not comply with the conventions, the golden rule of `docs/constitution.md`, section 1, applies instead.

The PlantUML diagrams in `docs/diagrams/` (domain model, class diagrams, use cases) may be consulted at any time. They are only edited when user allow to do it.

The backend ↔ frontend contract is in `docs/specs/contract.md`. Do not invent what it does not define: ask.

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

The rules are in `docs/constitution.md`, section 11.

## Workflow

Work on **one roadmap phase per session**. Do not start the next one.

1. Read the indicated phase in `docs/roadmap/roadmap.md`, or in `docs/roadmap/roadmap-test.md` for a test phase.
2. Propose a short plan and wait for confirmation before writing code.
3. Before the first change, record in the phase the commit it starts from (the current `HEAD`): `Started at: <short hash>`.
4. Implement bullet by bullet.
5. Write the tests in the same commit as the code they test.
6. Record progress in the roadmap of the phase by changing `- [ ]` to `- [x]` on each completed bullet, in the same commit as the work that completes it.
7. When the phase is finished, close it in one last commit: write `Finished at: <short hash>`, the `HEAD` before that commit (the last commit of the phase), and move a closed phase of `docs/roadmap/roadmap.md` to `docs/roadmap/roadmap-archive.md`. A test phase of `docs/roadmap/roadmap-test.md` stays in its file. Then summarize what was done.

When asked to add a pending task to the roadmap, put it in the "Pending tasks" section by default. If the task is essential to complete a specific phase, put it in that phase instead.

When asked to add an idea, or a proposal comes up that nobody has decided, record it with `/add-idea` instead of the roadmap. Its status changes only by decision of the product owner, in the same commit that applies it: `accepted` once chosen, with its rules listed when they are written; `done` in the closing commit of the phase that builds it; `discarded` with the reason. Update its row of the Ideas section of `docs/index.md` in that commit.

Whenever something could not be verified (a check that needs a person, a real browser, a running server or anything outside the agent environment), record it as a `- [ ]` bullet in the "Pending checks" section of `docs/roadmap/roadmap-test.md`, saying what to check and why it could not be done.

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
- You are going to create an abstraction, interface or layer that `docs/constitution.md`, section 4, does not allow.
- You are going to change something in `docs/constitution.md`.
- You are going to change something in `docs/roadmap/decisions.md`.
- A roadmap bullet is ambiguous or depends on a measurement that does not exist yet.

When a decision is the user's to make, ask it with a questionnaire (the `AskUserQuestion` tool, with options and a recommended one first), not with open questions in the chat text. The questionnaire does not replace the report: first give all the relevant information (findings, context, trade-offs, the plan), then show the questionnaire.

## Style reminder

The rules most often broken, all of them in `docs/constitution.md` (sections 2, 5 and 3):

1. **KISS above all.** Interfaces with a single implementation: no. "Future-proofing" layers: no.
2. **No magic values.** Every literal with meaning is an enum, a constant or configuration.
3. **The backend rules.** The frontend does not mutate the game state before the server confirms.
