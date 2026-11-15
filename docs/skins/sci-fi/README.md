# Sci-fi

**HUD:** Slanted plates with an accent bar that sweeps across under the pointer, corner brackets and capitals. **Battlefield:** The deck of a hangar, with metal plates, a landing circle, hazard stripes and corner brackets.

The code is in `hud.ts` and `battlefield.ts`. Name in `docs/skins/prototype/registry.ts`: `sci-fi`. The HUD was recorded as `scifi`.

![Overview](overview.jpg)

# HUD

## Text

- Bahnschrift, 22 px, in capitals, with 2 px between letters.
- Buttons: `#d6e4f5`, and white under the pointer.
- Padding of the buttons: 34 px left, 24 px right, 10 px top and bottom.

## Buttons

![Buttons](buttons.png) ![End turn under the pointer](buttons-hover-end-turn.png) ![Surrender under the pointer](buttons-hover-surrender.png)

The accent color: primary `#ffb000`, destructive `#ff3b30`, neutral `#8aa0b4`.

- **Shape.** A parallelogram slanted to the right: the top edge starts 10 px to the right of the bottom one, and the bottom edge ends 10 px to the left of the top one.
- **Fill.** `#1c232b` at 94%.
- **Accent bar.** A parallelogram with the same slant on the left edge, 6 px wide, in the accent color.
- **Outline.** 1 px of the accent color at 35%.
- **Under the pointer.** The accent sweeps from the bar to the right edge, filling the button with the accent color at 28%. The outline goes to 85%. A corner bracket of 2 px of the accent color fades in over the top right corner: its corner is 2 px to the right of it and 4 px above it, with an arm of 12 px to the left and one of 8 px down.

## Turn panel

![Turn panel](turn.png)

- A rectangle with its top left and bottom right corners cut 14 px, fill `#141a20` at 94%, and an outline of 1 px of the accent color at 50%.
- An accent bar 4 px tall over the top edge, starting 18 px from the left, 120 px long or 40% of the width if it is shorter.
- A corner bracket of 2 px with arms of 16 px, its corner 4 px to the right of and 4 px below the bottom right corner.
- Accent `#ffb000` on the turn of the local player, `#8aa0b4` otherwise. Text `#ffb000` on the turn of the local player, `#d6e4f5` otherwise.

## Dialog

![Dialog](dialog.png)

- The turn panel at 520 by 200 px, with the accent `#ffb000`.
- Question in `#d6e4f5`, in capitals. "Sí" uses the destructive button, "No" the neutral one.

# Battlefield

![Battlefield in detail](battlefield-detail.jpg)

- **Bands.** 50 units under the left and right edges in `#1a2027`, and under the near edge in `#1f262e`, all with an outline of 2 units of `#0b0f13`. A light strip of 4 units of `#ffb000` at 80% runs along the near band, 25 units below the edge.
- **Seams.** The whole board in `#12171c`.
- **Plates.** A grid of 6 by 6 plates, each one 1.2% of its side smaller on every edge, in `#262e37`, `#2a333d` or `#232a32`, chosen at random and always the same. Each plate has a rivet near each corner, at 6% of its side from both edges: a square of 0.016 `h` of `#5c6b7a`.
- **Hazard stripes.** Along the far and the near edge, a band from 0.02 `h` to 0.08 `h` inside the edge, of 24 slanted stripes, alternately `#ffb000` and `#111111` at 85%, leaning 80% of the height of the band.
- **Landing circle.** Centered on the middle: a ring of radius 0.3 `h`, 8 units of `#ffb000` at 55%; a ring of 0.24 `h`, 2 units at 40%; and a cross of 0.32 `h` by 0.32 `h`, 3 units at 35%.
- **Corner brackets.** At each corner, 0.9 `h` from the middle, two arms of 0.12 `h` along the edges, 5 units of `#ffb000`.
- **Outline.** 3 units of `#5c6b7a` on the edge of the board.
