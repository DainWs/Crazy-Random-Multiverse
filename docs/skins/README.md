# Skins

Proposals of skins chosen by the product owner. They are reference material to recreate each style later, not specification: nothing here is a rule. The rules are `FX-10` to `FX-15` in `agents/specs/VISUAL-EFFECTS.md`, and every skin is **[Post-MVP]**.

## Skins by element

There is no skin of the whole interface. Each element of the interface has skins of its own, and the player chooses one for each element on its own (`FX-10`, `FX-12`): the battlefield of one style goes with the HUD of any other, such as a fantasy battlefield with an arcade HUD. An element without a skin chosen keeps the look of the game.

| Folder | Element | What a skin of it restyles |
|---|---|---|
| `huds/` | HUD (`UI-3`, `VIEW-28`) | The turn panel at the top left corner; the end turn button as the primary action and the surrender button as the destructive one, with their reaction under the pointer; and the confirmation dialog, with "Sí" in the destructive style and "No" in the neutral one |
| `battlefields/` | Battlefield | The surface under the zones, the slots and the cards, and what is seen around it. It can be any surface, such as a table, a floor or a map. The zones, the slots and the cards keep their look |

Each skin has its own folder inside the folder of its element, named after its style. Two skins of different elements can share a style, such as `huds/fantasy/` and a fantasy battlefield, but neither depends on the other.

### HUDs

Chosen on 2026-11-15 from ten styles recorded as prototypes.

| Folder | Look |
|---|---|
| `huds/fantasy/` | Dark plates with cut corners and a double gold border that lights up, serif type |
| `huds/parchment/` | Notes of aged paper with a ribbon, that rise from the table under the pointer |
| `huds/neon/` | Dark glass with a glowing outline, cyan or magenta, spaced monospaced capitals |
| `huds/sci-fi/` | Slanted plates with an accent bar that sweeps across, and corner brackets |
| `huds/arcade-blocks/` | Arcade blocks with depth and a black outline, whose top face rises |
| `huds/wood/` | Wooden signs with grain and nails, a warm glow, the turn hanging from ropes |

A HUD folder has:

- `README.md`: its look in exact values.
- `hud.ts`: the code that draws it.
- Captures with the battlefield of the game, the window at 1920 by 1080 and a game of two players:
  - `overview.jpg`: the whole screen, at rest.
  - `turn.png`: the turn panel.
  - `buttons.png`: the two buttons at rest.
  - `buttons-hover-end-turn.png` and `buttons-hover-surrender.png`: each button under the pointer.
  - `dialog.png`: the confirmation dialog, with the pointer over "No".

### Battlefields

Chosen by the product owner from sixty candidates recorded on 2026-11-15, ten for each of six styles: fantasy, parchment, neon, sci-fi, arcade blocks and wood. Until they are chosen, `battlefields/` is empty.

A battlefield folder has:

- `README.md`: its look in exact values.
- `battlefield.ts`: the code that draws it.
- Captures with the HUD of the game, the window at 1920 by 1080 and a game of two players:
  - `overview.jpg`: the whole screen, at rest.
  - `detail.jpg`: the battlefield zoomed in with four steps of the wheel.

## Shared values

- **Pointer over a HUD button.** Its look goes to the hover state in 150 ms, slowing down at the end, and back in 150 ms in the same way (`VIEW-28`, `VIEW-31`). A pointer that leaves halfway goes back from the state reached. A skin that raises the button never goes above its raised position.
- **HUD sizes.** In pixels on a screen of 1920 by 1080; they scale with the HUD (`VIEW-24`). The dialog panel is 520 by 200 px. The text of a button keeps the padding given by its skin, and the shape is drawn around the text and its padding.
- **Battlefield sizes.** The board is a square of side `2h` in board units, from its far left corner `(-h, -h)` to its near right one `(h, h)`; `h` grows with the number of players (`VIEW-2`), and is 1600 with two. Positions on it are given as fractions of `h` and are seen in perspective. The surroundings reach from -5600 to 5600 across and from -6000 to 3400 from far to near, which covers the screen at the start zoom. Heights over the ground are in board units too. The bands that hang from the edges of the board, and the widths of the lines, are in units of the battlefield layer, which scale with the zoom of the camera but not with the perspective.
- **Battlefield order.** The surroundings first, then the bands of the left, right and near edges, then the surface, its marks and its outline. What stands on the ground is drawn from far to near. The lines of a same color and width are drawn as one path, so their transparency does not pile up where they cross (`VIEW-26`).
- **Fonts.** The typefaces are the ones installed with Windows. A skin that ships needs its font as an asset of the game, and adding a font file is decided first.

## Code

Reference only: it is not production code, it does not follow the guides of `agents/` and it is not compiled from here. It was written against commit `4b3ca73` of the frontend. A battlefield with many shapes is slow to draw, and the game draws the battlefield again with every board; a version for production draws it once.

`prototype/` has the code shared by every skin:

- `kit.ts`: the types of a skin of each element (`HudSkin`, `BattlefieldSkin`) and the helpers to draw colors, shapes on the screen, and shapes on the board and its surroundings in perspective.
- `registry.ts`: the skins of each element by the name of their folder (`HUDS`, `BATTLEFIELDS`), and the one chosen for each element with `window.__hudSkin` and `window.__battlefieldSkin`.
- `hud.ts`: draws the chosen HUD skin behind the texts of the HUD, follows them on every frame and plays the hover.
- `battlefield.ts`: draws the chosen battlefield skin instead of the table, through the projection of the board.
- `GameHudView.patch` and `BattlefieldView.patch`: the hooks in `frontend/src/game/hud/GameHudView.ts` and `frontend/src/game/battlefield/BattlefieldView.ts`. Without a skin chosen, the element draws as in the game.
- `capture.spec.ts` and `playwright.config.ts`: the Playwright test that takes the captures of every skin folder, each element with the other one as the game draws it.

A skin imports only from `prototype/kit.ts`. Adding a skin is adding its folder with its code inside the folder of its element, and its line in `registry.ts` and in `HUDS` or `BATTLEFIELDS` of `capture.spec.ts`.

### Take the captures again

From the root of the repository, with Git Bash:

```sh
mkdir -p frontend/src/skins frontend/prototypes
(cd docs/skins && find . -name '*.ts' ! -name 'capture.spec.ts' ! -name 'playwright.config.ts' -exec cp --parents {} ../../frontend/src/skins/ \;)
cp docs/skins/prototype/capture.spec.ts docs/skins/prototype/playwright.config.ts frontend/prototypes/
git apply docs/skins/prototype/GameHudView.patch docs/skins/prototype/BattlefieldView.patch
cd frontend && npx playwright test --config prototypes/playwright.config.ts
```

The test writes the captures straight into the folder of each skin. It renders on the GPU, because software WebGL is too slow for the hover (`agents/PHASER4-SPECS.md`). Then undo the hooks and remove the copies:

```sh
git apply -R docs/skins/prototype/GameHudView.patch docs/skins/prototype/BattlefieldView.patch
rm -rf frontend/src/skins frontend/prototypes
```

To see skins in the running game instead, install them in the same way and set `window.__hudSkin` and `window.__battlefieldSkin` to the names of their folders before the game scene starts, each one on its own.
