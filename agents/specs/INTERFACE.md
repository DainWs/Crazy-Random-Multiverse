# Interface behavior

How the interface behaves. Its appearance is in `../VIEW-SPECS.md`.

## Navigation

- **UI-1** The flow is: main menu → create a party, party list or join by code → party → loading → game → result → party.
- **UI-2** All texts are in Spanish and prepared to be translated. **[Post-MVP]** English and dynamic localization.

## Game

- **UI-3** The interface shows whose turn it is and the current round.
- **UI-4** The interface disables gameplay when it is not the player's turn, while an action is pending, for a spectator and after the game ends.
- **UI-5** The interface disables what the state already shows to be invalid, and highlights valid targets using `targetable`.
- **UI-6** If the server rejects an action, the card goes back to where it was and a brief message explains the reason, based on the error key.
- **UI-7** Rival hands show only how many cards they hold.
- **UI-8** A spectator or eliminated player sees the board with all interaction disabled.

## Connection and failures

- **UI-9** If the connection is lost during a game, a notice covers the table and disables interaction while the client retries on its own. When the connection returns, the state is restored from `GAME_SYNC`.
- **UI-10** If the session has expired, or the game no longer exists and the user is not in a party (`CON-23`), the client goes back to the main menu and explains what happened. An expired session starts as a new user (`USER-5`).
- **UI-11** If the server does not respond, the client goes back to the main menu, explains what happened and offers to retry.
- **UI-12** If loading the resources of a game fails, the client shows the failure and offers to retry, without confirming `/ready`. If the player closes the game, `LOAD-3` applies.

## Menu

- **UI-13** The name is edited from the main menu. There is no settings screen in the MVP.
