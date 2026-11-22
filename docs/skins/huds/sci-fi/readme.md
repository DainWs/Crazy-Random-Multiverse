# Sci-fi

Slanted plates with an accent bar that sweeps across under the pointer, corner brackets and capitals.

The code is in `hud.ts`. Every part of the HUD is drawn with the base pieces of `FX-17`: the turn panel with the HUD panel and the label text, the end turn button with the primary button, the surrender button and "Sí" with the destructive one, "No" with the neutral one, and the confirmation dialog with the notice panel and the body text. The other parts of the HUD of `FX-10` will use the same pieces.

Name in `docs/skins/prototype/registry.ts`: `sci-fi`. The HUD was recorded as `scifi`.

![Overview](overview.jpg)

## Text levels

| Level | Typeface | Size | Other |
|---|---|---|---|
| Title | Bahnschrift | 40 px | Bold, capitals, 3 px between letters |
| Body | Bahnschrift | 22 px | Capitals, 2 px between letters |
| Label | Bahnschrift | 22 px | Capitals, 2 px between letters |
| Numbers | Bahnschrift | 24 px | |

## Accent colors

- Turn of the local player `#ffb000`, positive `#5ad17a`, negative `#ff3b30`, disabled `#5c6b7a`.

The title and numbers levels and the positive, negative and disabled accents were proposed on 2026-11-15 and are not used by any part yet.

## Panels

![Turn panel](turn.png) ![Dialog](dialog.png)

- **Shape.** A rectangle with its top left and bottom right corners cut 14 px, fill `#141a20` at 94%, and an outline of 1 px of its accent at 50%.
- **Accent bar** 4 px tall over the top edge, starting 18 px from the left, 120 px long or 40% of the width if it is shorter; and a corner bracket of 2 px with arms of 16 px, its corner 4 px to the right of and 4 px below the bottom right corner.
- **HUD panel** with the accent `#8aa0b4`, and `#ffb000` when highlighted. **Notice panel** always with `#ffb000`.
- Text `#d6e4f5`. Padding 34 px left, 24 px right, 10 px top and bottom.

## Buttons

![Buttons](buttons.png) ![End turn under the pointer](buttons-hover-end-turn.png) ![Surrender under the pointer](buttons-hover-surrender.png)

- **Accent**: primary `#ffb000`, destructive `#ff3b30`, neutral `#8aa0b4`.
- **Shape.** A parallelogram slanted to the right: the top edge starts 10 px to the right of the bottom one. Fill `#1c232b` at 94%, and an accent bar of the same slant, 6 px wide, on its left edge.
- **Outline** of 1 px of the accent at 35%.
- **Text** `#d6e4f5`, and white under the pointer. Padding 34 px left, 24 px right, 10 px top and bottom.
- **Under the pointer.** The accent sweeps from the bar to the right edge at 28%, the outline goes to 85%, and a corner bracket of 2 px fades in over the top right corner: its corner 2 px to the right and 4 px above, with an arm of 12 px to the left and one of 8 px down.
