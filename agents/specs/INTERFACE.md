# Interface behavior

How the interface behaves. Its appearance is in `../VIEW-SPECS.md`.

## Navigation

- **UI-1** The flow is: main menu → create a party, party list or join by code → party → loading → game → result → party.
- **UI-2** All texts are in Spanish and prepared to be translated. **[Post-MVP]** English and dynamic localization.
- **UI-17** The screen shown follows the user state (`CON-23`): no party → main menu; in a party → party screen; loading → loading; game in progress → game, after the load of `LOAD-6` if it applies. The client waits for `user:synced` before choosing one, and changes screen whenever the state changes afterwards. It keeps the game state from `GAME_LOADING` on, whatever scene is active (`LOAD-6`), and drops it when the user no longer has a game.

## Game

- **UI-3** The interface shows whose turn it is and the current round.
- **UI-4** The interface disables gameplay when it is not the player's turn, while an action is pending, while animations are still playing (`CON-12`), for a spectator and after the game ends. Waiting for the animations keeps what is shown in step with the state.
- **UI-5** The interface disables what the state already shows to be invalid, and highlights valid targets using `targetable`.
- **UI-6** If the server rejects an action, the card goes back to where it was and a brief message explains the reason, based on the error key.
- **UI-7** Rival hands show only how many cards they hold.
- **UI-8** A spectator or eliminated player sees the board with all interaction disabled, except a button to leave (`SPEC-3`).
- **UI-15** Surrendering asks for confirmation (`ELIM-2`), and so do leaving the party (`PARTY-6`), kicking a member (`UI-23`) and leaving the game as a spectator (`SPEC-3`).

## Connection and failures

- **UI-9** If the connection is lost during a game, a notice covers the table and disables interaction while the client retries on its own. When the connection returns, the state is restored from `GAME_SYNC`.
- **UI-10** If the session has expired, or the game no longer exists and the user is not in a party (`CON-23`), the client goes back to the main menu and explains what happened. An expired session starts as a new user (`USER-5`).
- **UI-11** If the server does not respond, the client goes back to the main menu, explains what happened and offers to retry.
- **UI-12** If the manifest, a `fixed` resource or `/ready` fails during the load (`LOAD-2`, `LOAD-6`), the client shows the failure and offers to retry, without confirming `/ready`. Retrying repeats only what failed. If the player closes the game, `LOAD-3` applies. A rejection with `exception.game.not_found` or `exception.access_denied.wrong_game` offers no retry: the client goes back to the party or, if the user is not in one, follows `UI-10`. `exception.user.not_found` follows `USER-8`.
- **UI-21** The image of a card is downloaded the first time the card has to be shown, or during the load for the leaders of the game (`LOAD-2`), using the manifest (`CON-30`). Until it arrives, the card shows `card.unknown`, and the image replaces it when it does. A failed download keeps `card.unknown`, does not interrupt the game and is attempted again the next time the card is shown. A card the manifest does not list also keeps `card.unknown`.
- **UI-22** The loading screen shows the progress of the downloads and, after confirming `/ready`, a text saying that it is waiting for the other players (`LOAD-3`).

## Menu

- **UI-13** The name is edited from the main menu. The interface does not offer it inside a party, although the server accepts it (`USER-3`). There is no settings screen in the MVP.
- **UI-14** The party list is loaded when its screen opens and with a refresh button (`PARTY-4`). Each party shows its name and its members out of the capacity, and a full one shows the join button disabled (`PARTY-5`, `UI-5`). A rejected join is shown as a brief message based on its key, as in `UI-18`, and the list is loaded again, because it was out of date.
- **UI-18** The main menu creates a party with one action, using the default capacity and the Classic mode (`PARTY-2`, `PARTY-3`), and joins one with a field for the party code. A rejection (`exception.party.*`) is shown as a message below the field, based on its key.

## Party

- **UI-16** The party screen disables starting the game, leaving, kicking and the configuration while the party is locked (`PartyDto.locked`).
- **UI-19** The party screen shows the name, the number of members out of the capacity, the members with the owner marked, and the code with a button to copy it (`PARTY-5`, `PARTY-11`). Any member can leave from it (`PARTY-6`).
- **UI-20** Only the owner sees the start button. It is disabled while the party is locked (`UI-16`) or has fewer than 2 members (`PARTY-9`). A rejected start (`PARTY-9`, `DECK-4`) is shown as a brief message below the button, based on its key, as in `UI-18`.
- **UI-23** Only the owner sees the configuration controls: the capacity, from 2 to 10 (`PARTY-2`), the game mode selector, with Classic as its only option (`PARTY-3`, `SCOPE-3`), and a button to kick each member except themselves (`PARTY-6`). A rejection is shown as a brief message based on its key, as in `UI-18`.
