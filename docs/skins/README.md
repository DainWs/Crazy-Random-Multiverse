# Skins

Proposals of skins chosen by the product owner on 2026-11-15. They are reference material to recreate each style later, not specification: nothing here is a rule, and the skins themselves are **[Post-MVP]** (`FX-10` to `FX-15` in `agents/specs/VISUAL-EFFECTS.md`).

A skin restyles two separate elements of the interface, without changing their layout or behavior (`FX-10`):

- **HUD.** The turn panel at the top left corner; the end turn button as the primary action and the surrender button as the destructive one; and the confirmation dialog, with "Sí" in the destructive style and "No" in the neutral one. Chosen from ten styles recorded as prototypes.
- **Battlefield.** The surface under the zones, the slots and the cards: today a table with legs, in a skin any surface, such as a floor or a map. The zones, the slots and the cards keep their look.

Each element can be chosen on its own, so the HUD of one skin can go with the battlefield of another.

## Skins

| Folder | HUD | Battlefield |
|---|---|---|
| `fantasy/` | Dark plates with cut corners and a double gold border that lights up, serif type | A floor of stone slabs with a gold inlay and a rune circle |
| `parchment/` | Notes of aged paper with a ribbon, that rise from the table under the pointer | A campaign map with a compass rose, mountains and a route |
| `neon/` | Dark glass with a glowing outline, cyan or magenta, spaced monospaced capitals | A synthwave grid floor in magenta with a cyan outline |
| `sci-fi/` | Slanted plates with an accent bar that sweeps across, and corner brackets | The deck of a hangar, with a landing circle and hazard stripes |
| `arcade-blocks/` | Arcade blocks with depth and a black outline, whose top face rises | A floating platform of grass blocks over layers of dirt |
| `wood/` | Wooden signs with grain and nails, a warm glow, the turn hanging from ropes | A deck of staggered planks with nails, in a frame of beams |

## Content of a skin folder

- `README.md`: the look of the HUD and of the battlefield in exact values.
- `hud.ts`: the code that draws its HUD.
- `battlefield.ts`: the code that draws its battlefield.
- Captures, both elements of the skin together, with the window at 1920 by 1080 and a game of two players:
  - `overview.jpg`: the whole screen, at rest.
  - `battlefield-detail.jpg`: the battlefield zoomed in with four steps of the wheel.
  - `turn.png`: the turn panel.
  - `buttons.png`: the two buttons at rest.
  - `buttons-hover-end-turn.png` and `buttons-hover-surrender.png`: each button under the pointer.
  - `dialog.png`: the confirmation dialog, with the pointer over "No".

## Shared by every skin

- **Pointer over a button.** Its look goes to the hover state in 150 ms, slowing down at the end, and back in 150 ms in the same way (`VIEW-28`, `VIEW-31`). A pointer that leaves halfway goes back from the state reached. A skin that raises the button never goes above its raised position.
- **HUD sizes.** In pixels on a screen of 1920 by 1080; they scale with the HUD (`VIEW-24`). The dialog panel is 520 by 200 px. The text of a button keeps the padding given by its skin, and the shape is drawn around the text and its padding.
- **Battlefield sizes.** The board is a square of side `2h` in board units, from its far left corner `(-h, -h)` to its near right one `(h, h)`; `h` grows with the number of players (`VIEW-2`). Positions on it are given as fractions of `h` and are seen in perspective. The bands that hang from its edges, and the widths of the lines, are in units of the battlefield layer, which scale with the zoom of the camera but not with the perspective.
- **Battlefield order.** The bands of the left, right and near edges first, then the surface, then its marks and last its outline. The lines of a same color and width are drawn as one path, so their transparency does not pile up where they cross (`VIEW-26`).
- **Fonts.** The typefaces are the ones installed with Windows. A skin that ships needs its font as an asset of the game, and adding a font file is decided first.

## Code

Reference only: it is not production code, it does not follow the guides of `agents/` and it is not compiled from here. It was written against commit `4b3ca73` of the frontend.

`prototype/` has the code shared by every skin:

- `kit.ts`: the types of a skin (`HudSkin`, `BattlefieldSkin`) and the helpers to draw colors, shapes on the screen and shapes on the board.
- `registry.ts`: every skin by the name of its folder, and the choice of each element with `window.__hudSkin` and `window.__battlefieldSkin`.
- `hud.ts`: draws the chosen HUD skin behind the texts of the HUD, follows them on every frame and plays the hover.
- `battlefield.ts`: draws the chosen battlefield skin instead of the table, through the projection of the board.
- `GameHudView.patch` and `BattlefieldView.patch`: the hooks in `frontend/src/game/hud/GameHudView.ts` and `frontend/src/game/battlefield/BattlefieldView.ts`. Without a skin chosen, the interface draws as before.
- `capture.spec.ts` and `playwright.config.ts`: the Playwright test that takes the captures of every skin folder.

A skin imports only from `prototype/kit.ts`. Adding a skin is adding its folder with `hud.ts` and `battlefield.ts`, and its line in `registry.ts` and in `SKINS` of `capture.spec.ts`.

### Take the captures again

From the root of the repository, with Git Bash:

```sh
mkdir -p frontend/src/skins frontend/prototypes
for d in docs/skins/*/; do
  name=$(basename "$d"); mkdir -p "frontend/src/skins/$name"
  find "$d" -maxdepth 1 -name '*.ts' ! -name 'capture.spec.ts' ! -name 'playwright.config.ts' -exec cp {} "frontend/src/skins/$name/" \;
done
cp docs/skins/prototype/capture.spec.ts docs/skins/prototype/playwright.config.ts frontend/prototypes/
git apply docs/skins/prototype/GameHudView.patch docs/skins/prototype/BattlefieldView.patch
cd frontend && npx playwright test --config prototypes/playwright.config.ts
```

The test writes the captures straight into `docs/skins/<skin>/`. It renders on the GPU, because software WebGL is too slow for the hover (`agents/PHASER4-SPECS.md`). Then undo the hooks and remove the copies:

```sh
git apply -R docs/skins/prototype/GameHudView.patch docs/skins/prototype/BattlefieldView.patch
rm -rf frontend/src/skins frontend/prototypes
```

To see a skin in the running game instead, install it in the same way and set `window.__hudSkin` and `window.__battlefieldSkin` to the name of its folder before the game scene starts.
