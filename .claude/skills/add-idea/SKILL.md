---
name: add-idea
description: Records a proposal not decided yet as docs/ideas/NNN-slug.md, with the next IDEA-NNN, and adds its row to the Ideas section of docs/index.md. Use it with /add-idea or when asked to add, write down or keep an idea. It only captures: it does not write rules nor plan the idea.
argument-hint: "<title of the idea>"
---

# add-idea

Captures one idea in `docs/ideas/`, following `docs/ideas/readme.md`. It writes no rule and no roadmap bullet: an idea becomes work only after the product owner accepts it and its rules are in `docs/specs/`.

## Before writing

1. **A title is given.** If not, ask for it; do not invent one.
2. **It is an idea.** A bug or a debt is a pending task of `docs/roadmap/roadmap.md`, and a change to an existing rule is made in `docs/specs/` when the user asks for it. If it is not an idea, say so and stop.
3. **It is not there already.** Search the titles and proposals of `docs/ideas/` and the Post-MVP section of `docs/roadmap/roadmap.md`. If a similar one exists, show it and ask whether to extend it instead.

## Steps

1. **Number.** The highest `IDEA-NNN` of the files of `docs/ideas/`, whatever their status, plus one, with three digits. A number is never reused.
2. **Slug.** The title in English, lowercase and kebab-case, short.
3. **File** `docs/ideas/NNN-slug.md`:

   ```markdown
   ---
   id: IDEA-NNN
   title: <title>
   status: idea
   date: <today>
   rules: []
   phase: null
   ---

   # IDEA-NNN — <title>

   ## Problem or opportunity

   ## Proposal

   ## Open questions

   ## Decision
   ```

   - Only what the user said. Each gap is a question under `Open questions`, never an assumption. A question the product owner must answer is marked **[OPEN]**.
   - Cite the existing rules it touches by identifier (`VIEW-4`), and the ideas it depends on by `IDEA-NNN`.
   - If it comes from the Post-MVP section of the roadmap, move the text here and remove its bullet in the same commit.
   - Images or prototypes the user gives go in `docs/ideas/NNN-slug/`.
4. **Index.** Add its row to the Ideas section of `docs/index.md`, ordered by number, with status `idea` and `—` in rules and phase.
5. **Commit** only the files of the idea, the index and the roadmap if a bullet left it, following the commit rules of `CLAUDE.md`, for example `add the idea of the health bar on the card`.

## Do not

- Write or change rules of `docs/specs/`, or add roadmap bullets.
- Set a status other than `idea`: accepting or discarding is decided by the product owner (`CLAUDE.md`, Workflow).
- Fill the `Decision` section.
