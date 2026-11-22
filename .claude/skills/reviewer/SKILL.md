---
name: reviewer
description: Review of a roadmap phase before closing it — read-only auditors in parallel, the closed decisions, the rule → test table and the integration executed here with its real output. Ends with a VERDICT line; a phase is closed only when approved.
argument-hint: <phase, e.g. 12 or T13>
---

# reviewer

The review of a phase, before its closing commit (`CLAUDE.md`, "Workflow", step 9). It checks the work from the `Started at` of the phase to `HEAD` against:

1. The bullets of the phase, in `docs/roadmap/roadmap.md` or `docs/roadmap/roadmap-test.md`.
2. The rules they cite, in `docs/specs/`, and the contract, `docs/specs/contract.md`.
3. `docs/constitution.md` and the conventions skill of each application touched.
4. The closed decisions of `docs/roadmap/decisions.md`.

Verdict: `approved`, `approved with observations` or `changes requested`. **By default, `changes requested`**, until the evidence says otherwise.

## Usage

```
/reviewer 12
```

## Pre-flight (blocks)

1. The phase exists and has `Started at: <hash>`. If not: "The phase has not started." STOP.
2. Every bullet is `- [x]`. If one is not, list it and ask whether to review anyway.
3. `git status` is clean, apart from the `Review` lines of this phase (step 7). Work that is not committed is not reviewed: say so and STOP.
4. **Ceiling of rounds:** count the `Review N: changes requested` lines of the phase. **If there are already 2**, there is no third round: stop and escalate to the person with what the two reviews asked for, what is still open and a proposal (split the phase, change the approach or accept with observations).
5. Files of the phase: `git diff --name-only <Started at>..HEAD`. Print them, and which auditors will run.

## Workflow

### Step 1 — Load

- The phase, the files of the rules its bullets cite and of the rules those rules cite directly (`docs/index.md` says which file holds each rule), and `docs/specs/contract.md`.
- `docs/constitution.md`, `docs/roadmap/decisions.md`, and the skill of each application in the diff (`backend-conventions`, `frontend-conventions`) with its tests file.
- The diff itself: `git diff <Started at>..HEAD`. Never judge code without reading it.

### Step 2 — Auditors in parallel

**One single message** with the two `Agent` calls, each with the phase, its rules and the files of the diff:

| Auditor | What it checks |
|---|---|
| `spec-drift-checker` | Each rule implemented as written; behavior the specification does not back, `[OPEN]` and `[Post-MVP]`; both sides of the contract; cited paths; `docs/index.md`; bullets marked against the diff |
| `constitution-auditor` | `docs/constitution.md` and the conventions skill of each application, only on what the phase changes |

They are read-only: ask for the report **in their final answer**, with `file:line` and severity (critical, high, medium, low), of 12 000 characters at most. If a report does not arrive or arrives cut, ask for the missing part with `SendMessage` before declaring that dimension "not concluded". Never take it as clean without a report.

### Step 3 — Closed decisions

For each row of `docs/roadmap/decisions.md` that the phase touches, check that the code keeps it: for example the realtime transport (Socket.IO), the commands by REST, rejected requests answered by HTTP (`CON-18`) and the order of the events by `sequence` (`CON-12`). A new dependency that was not asked for (`CLAUDE.md`, "Ask before doing anything if") is a finding.

### Step 4 — Rule → test table

For **each rule cited by the bullets of the phase**, and each rule that the changed code cites, find the test that exercises it. Tests cite the rule in a comment above them (`// UI-6`), so search `backend/src/test/`, `frontend/test/` and `frontend/e2e/` for the identifier.

| Rule | Bullet | Test (`file:line "name"`) | Edge cases | Status |
|---|---|---|---|---|
| `PARTY-9` | 1 | `backend/src/test/.../PartyTest.java:NN "rejects a start on a locked party"` | 1, 4 | Covered |
| `UI-20` | 4 | — | 1 | **Orphan (critical)** |
| `VIEW-61` | 6 | — (only visible on screen) | — | Pending check |

**Edge cases**: the categories that apply to the rule, each one with its test or `N/A: <reason that can be checked>`:

1. Invalid input — an action out of turn, a slot out of range, a card that is not in the hand.
2. Boundary — 0, 1 or many cards; an empty zone; the last leader.
3. Failure of a dependency — the socket drops, a REST request fails or never answers.
4. Concurrency — two players act on the same game at once (`docs/constitution.md`, section 9).
5. Unexpected data — an event for an unknown card, an event out of order or repeated (`CON-12`).
6. Security — identity from the session and not from the request, the hand of another player (`docs/constitution.md`, sections 3 and 8).
7. Idempotence — a double click, a command sent twice.

A rule without a test is critical. A rule that only a person can check (it is only visible on screen, or needs a running server) is not an orphan if it is recorded in "Pending checks" of `docs/roadmap/roadmap-test.md`; if it is not, it is critical. A missing edge case is an observation.

### Step 5 — Integration (you run it: the auditors only read)

For each application in the diff, from its folder:

```bash
# backend/
mvn verify -P integration-tests   # the unit tests and the *IntegrationTest ones

# frontend/
npx --no vue-tsc --noEmit
npm run lint
npm run test:run
npm run test:e2e          # if the phase changes what the browser shows
```

Paste the **real output**, the last lines of each command when it is long, with the number of tests run and failed. Any red is critical.

### Step 6 — Report

In the chat, not in a file, with these sections:

1. **Summary**: one paragraph with the verdict and its reasons.
2. **Verdict** and, for `changes requested`, the critical gates that fail.
3. **Closed decisions**: decision × why it applies × kept (with `file:line` if not).
4. **Findings by auditor**: one subsection per auditor; the ones not concluded, marked so.
5. **Rule → test** (step 4).
6. **Integration**: the commands and their real output (step 5).
7. **Limitations**: what could not be checked. Each one also goes to "Pending checks" of `docs/roadmap/roadmap-test.md`.
8. **Required actions**: a numbered and concrete list, when something has to change.
9. Footer: `Round: N · previous "changes requested": K`.

The **last line** is exactly one of these, without Markdown formatting:

```
VERDICT: approved
VERDICT: approved with observations
VERDICT: changes requested
```

### Step 7 — Record the round

Add below `Started at` of the phase the line ``Review N: <verdict> at `<short HEAD>` ``, like `` Review 1: changes requested at `4ab48d3` ``. It goes in the next commit of the phase: the first fix, or the closing commit.

## Verdict

**`changes requested`** if any critical gate fails:

- The integration is red (typecheck, lint, tests, integration tests or browser tests).
- A rule cited by the phase without a test, and not recorded as a pending check.
- A critical finding of an auditor, or a high finding of `constitution-auditor`: the frontend mutating state before the server confirms, the identity from a request field, private data in a log, a contract changed on one side only, a rule implemented differently, a banned anti-pattern.
- A closed decision broken, or a dependency that was not asked for.
- A path cited in `CLAUDE.md`, `docs/` or `.claude/` that does not exist.

**`approved with observations`** if only medium or low findings fail: names, comments, formatting, missing edge cases, a high finding of `spec-drift-checker` that the person accepts.

**`approved`** if everything is green.

Every finding has a `file:line`; without a concrete path it cannot be acted on and is discarded.

## Closing

1. **`approved`**, or **`approved with observations`** with each observation fixed or explicitly accepted by the person: close the phase as `CLAUDE.md`, "Workflow", step 9, says. Its closing commit carries the `Review` line.
2. **`changes requested`**: the phase is not closed. List the actions; each fix follows the workflow as a bullet of the phase, with its integration and its ceiling of 2 fix cycles, and then `/reviewer` runs again. Say how many rounds are left before the ceiling (2).

## Hard rules

- Never accept code without reading it: you and the auditors read real files.
- The auditors in parallel, in one single message.
- The integration runs here always, even when the phase already pasted it.
- No fixes during the review: you find and describe; the fixes come after, as work of the phase.
- Ceiling of 2 `changes requested` per phase; at the third, stop and escalate.
- Always the `VERDICT:` line at the end of the report.
- Never push, nor remotes.
