# IDEAS

Proposals that are not planned yet: what the game could do or how it could look, before it is a rule. One file per idea, `NNN-slug.md`, created with `/add-idea`. Ideas of a different kind are not kept here: a bug or a debt is a pending task of `docs/roadmap/roadmap.md`, and an item out of the MVP waits in its Post-MVP section until it starts being worked out.

## Life of an idea

| Status | Meaning | What changes |
|---|---|---|
| `idea` | Captured, not decided | Its open questions are answered by the product owner |
| `accepted` | The product owner chose it | Before it is planned, its rules are written in `docs/specs/` and listed in `rules` |
| `discarded` | Not done | `Decision` says why and when. The file stays, and its number is never reused |
| `done` | Built | The commit that closes its phase sets it, with the phase in `phase` |

- An accepted idea is planned as bullets of a phase or as a pending task, which cite its rules, never the idea: the rules are the source of truth (`docs/specs/readme.md`).
- An idea never moves to another folder: its status says where it is, so the paths that cite it do not break.
- Images and prototypes of an idea go in a folder with its name, `NNN-slug/`, next to its file.
- Rejected options of an accepted idea are written in its `Decision`, so they are not proposed again.

The list of the ideas, with their status, is the Ideas section of `docs/index.md`.
