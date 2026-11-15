# Skins

Proposals of skins for the HUD, chosen by the product owner on 2026-11-15 from ten styles recorded as prototypes. They are reference material to recreate each style later, not specification: nothing here is a rule, and the skins themselves are **[Post-MVP]** (`FX-10` to `FX-15` in `agents/specs/VISUAL-EFFECTS.md`).

Each skin restyles the whole HUD, not only its colors, without changing its layout or behavior (`FX-10`):

- The turn panel, at the top left corner, with the round and whose turn it is.
- The end turn button as the primary action, and the surrender button as the destructive one.
- The confirmation dialog: its panel, its question, "Sí" in the destructive style and "No" in the neutral one.

## Shared by every skin

- **Pointer over a button.** Its look goes to the hover state in 150 ms, slowing down at the end, and back in 150 ms in the same way (`VIEW-28`, `VIEW-31`). A pointer that leaves halfway goes back from the state reached. A skin that raises the button never goes above its raised position.
- **Sizes.** In pixels on a screen of 1920 by 1080; they scale with the HUD (`VIEW-24`). The dialog panel is 520 by 200 px. The text of a button keeps the padding given by its skin, and the shape is drawn around the text and its padding.
- **Fonts.** The typefaces are the ones installed with Windows. A skin that ships needs its font as an asset of the game, and adding a font file is decided first.

## Skins

| Folder | Look |
|---|---|
| `fantasy/` | Dark plates with cut corners and a double gold border that lights up, serif type |
| `parchment/` | Notes of aged paper with a ribbon, that rise from the table under the pointer |
| `neon/` | Dark glass with a glowing outline, cyan or magenta, spaced monospaced capitals |
| `sci-fi/` | Slanted plates with an accent bar that sweeps across, and corner brackets |
| `arcade-blocks/` | Arcade blocks with depth and a black outline, whose top face rises |
| `wood/` | Wooden signs with grain and nails, a warm glow, the turn hanging from ropes |

Every folder has a `README.md` with the exact values and these captures, taken from the recordings:

- `overview.jpg`: the whole screen, at rest.
- `turn.png`: the turn panel.
- `buttons.png`: the two buttons at rest.
- `buttons-hover-end-turn.png` and `buttons-hover-surrender.png`: each button under the pointer.
- `dialog.png`: the confirmation dialog, with the pointer over "No".

## Prototype

`prototype/` has the code that drew and recorded them, as a reference only: it is not production code and does not follow the guides of `agents/`.

- `HudPrototype.ts`: the six skins. `window.__hudVariant` picks one by the name of its folder.
- `GameHudView.patch`: the hook in `frontend/src/game/hud/GameHudView.ts`, from commit `dbe1348`.
- `hudStyles.record.spec.ts` and `playwright.config.ts`: the recording, with Playwright, of each skin and of the HUD of that commit (`actual`).

To record them again: copy `HudPrototype.ts` to `frontend/src/game/hud/`, apply the patch with `git apply`, copy the other two files to `frontend/prototypes/`, and run `npx playwright test --config prototypes/playwright.config.ts` from `frontend/`. The videos are in `frontend/prototypes/results/`. Then undo the patch and remove the copies.
