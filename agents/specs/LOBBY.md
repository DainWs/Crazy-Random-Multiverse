# Lobby

## Users

- **USER-1** A user is anonymous: there are no passwords or persistent profiles. A user exists for as long as their session lasts and has not been deleted for being disconnected.
- **USER-2** The server assigns a default name to a new user: `Jugador` followed by 4 random digits, for example `Jugador 4821`. It follows `USER-4`, so two users can get the same one.
- **USER-3** A user can change their name, except while they have a game: from the start of its loading until the server removes it (`LOAD-1`) or they leave it as a spectator (`SPEC-3`).
- **USER-4** A name has 3 to 20 characters, counted after trimming its surrounding spaces, and it is stored trimmed. Two users can have the same name.
- **USER-5** A user with an expired session, or with a valid session whose user has been deleted, is a new user.
- **USER-6** `POST /register` creates the session's user with a default name, or returns the existing one. When it starts, the client calls `GET /user` and, on `exception.user.not_found`, `POST /register`.
- **USER-7** A session expires after 24 hours without requests (configurable). Only requests renew it: an open socket does not. When it expires, the user is deleted at that moment and their sockets are closed. If they were playing, they are eliminated as in `ABSENT-3`.
- **USER-8** The client detects an expired session through `exception.user.not_found` in a response or through a refused connection (`CON-2`), and then follows `UI-10`.

## Parties

- **PARTY-1** Any user who is not in a party can create one and becomes its owner. A user belongs to at most one party.
- **PARTY-2** The owner sets the capacity between 2 and 10. The default is 4. It cannot be set below the current number of members. Both limits are rejected with `exception.party.max_users_out_of_range`.
- **PARTY-3** The owner chooses the game mode from the selector. Classic is the only option in the MVP. The capacity and the mode cannot change while the party is locked (`exception.party.locked`).
- **PARTY-4** Every party that is not locked (`LOAD-1`) appears in the public list, also when it is full. The list has no defined order. There are no private parties in the MVP.
- **PARTY-5** A user joins from the list or with the party code. The party screen shows the code to be copied, and its format is up to the server. Nobody can join while the party is locked or when it is full.
- **PARTY-6** A member can leave and the owner can kick a member, except while the party is locked. A spectator is the exception (`SPEC-3`). The owner cannot kick themselves: they leave instead. Leaving a party one does not belong to, or kicking a user who is not a member, is rejected with `exception.party.user_not_in_party`.
- **PARTY-7** If the owner leaves, the member who has been in the party the longest becomes the owner.
- **PARTY-8** A party is removed when it becomes empty. Its game, if any, is removed with it, and the wait of `WIN-5` is cancelled.
- **PARTY-9** The owner can start the game whenever the party has at least 2 members and is not locked (`exception.party.locked`). No confirmation from the other members is needed.
- **PARTY-10** Every member receives the updated party when it changes (`party:info`), including when a member changes their name. The lock of `LOAD-1` is the exception and sends none, because every member is in the game.
- **PARTY-11** The name of a party is the current name of its owner. It changes when the owner changes (`PARTY-7`) or renames themselves.
- **PARTY-12** A kicked user receives a last `party:info` in which they no longer appear in `users`, and the client goes back to the main menu with a brief message saying that they were kicked. If they are disconnected, they do not receive it, and they find out when a socket is bound again (`CON-23`) or through the error of their next request. A kicked user can join again like any other user.

### Scenarios

**Owner leaves**
- Given a party whose owner is A, where B joined before C
- When A leaves
- Then B is the owner and the party still exists

**Capacity below members**
- Given a party with 5 members
- When the owner sets the capacity to 4
- Then the change is rejected

**Not enough members**
- Given a party with only its owner
- When the owner starts the game
- Then the action is rejected

## Game loading

- **LOAD-1** When the owner starts the game, the party locks and every player loads the game (`GAME_LOADING`). The party stays locked during the load, the game and the result, until the server removes the game (`LOAD-4`, `WIN-5`).
- **LOAD-2** Each client requests the manifest (`CON-28`), downloads the `fixed` resources it does not have yet, tries to download the images of the leaders of the game, and only then confirms with `POST /game/{gameCode}/ready`. A leader image that fails does not stop the load (`UI-21`). The other `dynamic` resources are not part of the load. The game starts (`GAME_START`) when every player has confirmed. Confirming again has no effect, because a client that reconnects loads again (`CON-23`).
- **LOAD-3** The wait has no time limit. A disconnected player who has not confirmed blocks the start until their user is deleted, which removes them from the game (`ABSENT-3`). A player who stays connected without confirming, for example after a failed load (`UI-12`), blocks it indefinitely. Both are accepted risks of the MVP.
- **LOAD-4** A player removed during the load is eliminated like any other (`PLAYER_DIE`) and keeps their seat (`ROUND-2`). If that leaves fewer than 2 players, the game is cancelled (`GAME_CANCELLED`) instead of ending (`WIN-1`), the server removes it from memory and the party unlocks. The client goes back to the party and explains what happened.
- **LOAD-5** A `GAME_CANCELLED` received during the load stops it, the client does not confirm, and `LOAD-4` applies.
- **LOAD-6** A client without the `fixed` resources that enters a game in progress, for example after reloading the page or because `GAME_START` arrives during its load, downloads them before showing the table and does not send `/ready`. The events received meanwhile are applied to the state.
- **LOAD-7** A file of the load that does not finish in 30 seconds counts as failed, so a stalled download cannot hold the load without offering a retry (`UI-12`).

### Scenarios

**Load blocked by a deleted user**
- Given a game of three loading, where A and B have confirmed
- When the user of C is deleted
- Then the game starts with A and B

**Page reloaded during a game**
- Given a player whose game is in progress
- When they reload the page and receive `GAME_SYNC`
- Then the client downloads the `fixed` resources, shows the table and does not send `/ready`
