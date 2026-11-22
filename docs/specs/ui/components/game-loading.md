# Game: loading screen

What a player sees while the game loads (`UI-12`, `UI-22`) and when the board replaces the loading screen. The durations and curves are in `docs/specs/ui/motion-base.md`. Decided with the product owner on 2026-11-15.

- **VIEW-29** The loading screen shows its progress bar and its texts on a panel in the palette of the HUD, with the retry button styled like the buttons of the HUD (`VIEW-28`). Everything is centered on the window and placed again when the window changes size, as in `VIEW-24`. Nothing is shown about which players have not confirmed.
  - **Loading screen out.** When the load ends, the loading screen fades out in 400 ms, speeding up (`VIEW-30`, `VIEW-31`), and is then removed.
  - **Board in.** When the loading screen is gone, the board fades in in 400 ms, slowing down at the end. Between the two fades nothing is drawn over the background of the page.
  - **Timing.** The change takes 800 ms. Gameplay stays disabled until the board has faded in (`UI-4`), also when entering a game in progress (`LOAD-6`).
  - In a new game, the board fades in without the leaders, and their placement (`VIEW-12`) starts when it has faded in.
  - **Effects** (`UI-26`). The panel, the bar, the texts and the retry button are essential: they show the progress of the load, its failures and the wait for the other players. The fades are non-essential: without them, the board replaces the loading screen at once.

## Scenarios

**New game**
- Given a player whose load ends after `GAME_START`
- When the board is shown
- Then the loading screen fades out in 400 ms, the board fades in without the leaders in 400 ms, and then the leaders are placed (`VIEW-12`)

**Game in progress**
- Given a player who reloads the page in a game in progress (`LOAD-6`)
- When the load ends
- Then the loading screen fades out and the board fades in with every card in its slot, and gameplay is disabled until it has faded in

**Window resized during the load**
- Given the loading screen shown
- When the window changes size
- Then the panel, the bar, the texts and the retry button stay centered on the window
