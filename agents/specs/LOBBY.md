# Lobby

## Users

- **USER-1** A user is anonymous: there are no passwords or persistent profiles. A user exists for as long as their session lasts and has not been deleted for being disconnected.
- **USER-2** The server assigns a default name to a new user, which follows `USER-4`.
- **USER-3** A user can change their name outside a game.
- **USER-4** A name has 3 to 20 characters, counted after trimming its surrounding spaces. Two users can have the same name.
- **USER-5** A user with an expired session, or with a valid session whose user has been deleted, is a new user.
- **USER-6** `POST /register` creates the session's user with a default name, or returns the existing one. When it starts, the client calls `GET /user` and, on `exception.user.not_found`, `POST /register`.
- **USER-7** A session expires after 24 hours without requests (configurable). If it expires during a game, `ABSENT-3` applies.
- **USER-8** The client detects an expired session through `exception.user.not_found` in a response or through a refused connection (`CON-2`), and then follows `UI-10`.

## Parties

- **PARTY-1** Any user who is not in a party can create one and becomes its owner. A user belongs to at most one party.
- **PARTY-2** The owner sets the capacity between 2 and 10. The default is 4. It cannot be set below the current number of members.
- **PARTY-3** The owner chooses the game mode from the selector. Classic is the only option in the MVP.
- **PARTY-4** Every party without a game in progress appears in the public list. There are no private parties in the MVP.
- **PARTY-5** A user joins from the list or with the party code. The party screen shows the code to be copied, and its format is up to the server. Nobody can join during a game or when the party is full.
- **PARTY-6** A member can leave and the owner can kick a member, except during a game. A spectator is the exception (`SPEC-3`). The owner cannot kick themselves: they leave instead.
- **PARTY-7** If the owner leaves, the member who has been in the party the longest becomes the owner.
- **PARTY-8** A party is removed when it becomes empty.
- **PARTY-9** The owner can start the game at any moment if the party has at least 2 members. No confirmation from the other members is needed.
- **PARTY-10** Every member receives the updated party when it changes (`party:info`), including when a member changes their name.
- **PARTY-11** The name of a party is the current name of its owner. It changes when the owner changes (`PARTY-7`) or renames themselves.
- **PARTY-12** A kicked user receives a last `party:info` in which they no longer appear in `users`, and the client goes back to the main menu. If they are disconnected, they do not receive it, and they find out when a socket is bound again (`CON-23`) or through the error of their next request.

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

- **LOAD-1** When the owner starts the game, the party locks and every player loads the game (`GAME_LOADING`).
- **LOAD-2** Each client confirms with `POST /game/{gameCode}/ready`. The game starts (`GAME_START`) when every player has confirmed. Confirming again has no effect, because a client that reconnects loads again (`CON-23`).
- **LOAD-3** The wait has no time limit. A disconnected player who has not confirmed blocks the start until their user is deleted, which removes them from the game (`ABSENT-3`). A player who stays connected without confirming, for example after a failed load (`UI-12`), blocks it indefinitely. Both are accepted risks of the MVP.
- **LOAD-4** If that leaves fewer than 2 players, the game is cancelled (`GAME_CANCELLED`) and the party unlocks. The client goes back to the party and explains what happened.

### Scenario

**Load blocked by a deleted user**
- Given a game of three loading, where A and B have confirmed
- When the user of C is deleted
- Then the game starts with A and B
