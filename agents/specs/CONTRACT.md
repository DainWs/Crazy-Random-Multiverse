# Backend ↔ frontend contract

Differences between this document and the code are tracked in `ROADMAP.md`.

## Connection

- **CON-1** The client opens a Socket.IO connection to the backend (port 9092, `crm.communication.socket-io.port` on the server, and path `/socket.io`; the client may override both) and sends the HTTP session cookie (`SESSION`) in the handshake.
- **CON-2** The server resolves the user from that session, binds the socket to the user and refuses the connection if the session does not belong to a registered user. The refusal closes the socket without a key (`CON-20`), and the client checks its session (`USER-8`).
- **CON-3** When a socket drops, only the socket is unbound. The user, their party and their game are kept until the user has been without an open socket for longer than a grace period (5 minutes, `crm.user.disconnect-grace-period`). A periodic task deletes those users (every minute, `crm.user.cleanup-interval`). See `ABSENT` in `GAME-END.md`.
- **CON-4** Reconnection is performed by the Socket.IO client.
- **CON-5** One setting, `crm.communication.origin`, holds the client origin that REST and the socket allow, with credentials. It is an explicit origin, never `*`, because browsers refuse cookies with it.
- **CON-25** A user can have several sockets bound at once, for example with several tabs. All of them receive the user's events, `CON-23` applies to each socket when it is bound, and the drop of one does not affect the others.

## Server → client channels

| Channel | Payload |
|---|---|
| `game:event` | `EventDto` |
| `party:info` | `PartyDto`, sent to the party members when the party changes (`PARTY-10`), to a kicked user (`PARTY-12`), and to a member when their socket is bound (`CON-23`) |
| `user:synced` | None. It closes the state sent when a socket is bound (`CON-23`) |

## Identifiers

- **CON-6** Codes travel as plain text inside JSON bodies. They are encoded as Base64 URL-safe only when they are part of a URL path.
- **CON-7** Card codes (`CardCodeDto.code`) travel as decimal text so that no digit is lost in JavaScript: the backend keeps them as a `long` and the frontend as a `string`.
- **CON-26** A `CardCodeDto` identifies a card in the catalog, so a code is only unique within its type and all the copies of a card share it. Cards have no unique id: on the board a card is identified by its position, and an action names a card in the hand by its `CardCodeDto`, because its copies are interchangeable (`HAND-4`).
- **CON-8** A field with no value is not sent (the Socket.IO serializer omits `null`), so the frontend types of those fields are optional.

## Events

`EventDto`: `{ code, sequence, details }`.

- **CON-9** `sequence` is a number per game, increased by one for each published event and assigned in publication order. The first event of a game has `sequence` 1. It is removed together with its game (`WIN-5`, `LOAD-4`).
- **CON-10** `details` is an `EventDetailsDto`. It always carries `game` (a `GameDto` with the state right after the event) and optionally the fields in the table below.

| `code` | Published when | Details besides `game` |
|---|---|---|
| `GAME_CREATED` | The game has been created | |
| `GAME_LOADING` | Clients must load the game and confirm with `/ready`. Also sent to a user who reconnects while loading (`CON-23`) | |
| `GAME_CANCELLED` | The loading has been cancelled (`LOAD-4`) | |
| `GAME_START` | Every player has confirmed (`LOAD-2`) | |
| `GAME_SYNC` | A socket is bound to a user with a game in progress, sent only to that socket | `hand` |
| `ROUND_CHANGE` | A new round starts | |
| `TURN_CHANGE` | The turn changes | |
| `PLAYER_RECEIVE_CARD` | A player receives a card | `targetPlayer`, `targetCard` (`CON-13`) |
| `PLAYER_PUT_CARD` | A card has been placed | `sourcePlayer`, `sourceCard`, `targetPlayer`, `targetPosition` |
| `PLAYER_MOVE_CARD` | A card has been moved or swapped | `sourcePlayer`, `sourcePosition`, `targetPlayer`, `targetPosition` |
| `PLAYER_ATTACK_CARD` | An attack has been resolved | `sourcePlayer`, `sourcePosition`, `targetPlayer`, `targetPosition`, `armorDamage`, `healthDamage`, `targetDead` (`CON-21`) |
| `PLAYER_EQUIP_CARD` | A card has been equipped | `sourcePlayer`, `sourceCard`, `targetPlayer`, `targetPosition` |
| `PLAYER_PASS_TURN` | The player has passed the turn | `sourcePlayer` |
| `PLAYER_SURRENDER` | The player has surrendered | `sourcePlayer` |
| `PLAYER_DIE` | A player has been eliminated | `targetPlayer` |
| `GAME_END` | The game is over | |
| `GAME_END_WITH_WINNER` | Follows `GAME_END` and names the winner | `targetPlayer` |
| `GAME_END_WITH_TIE` | **[Post-MVP]** Follows `GAME_END` when no leader is left alive (`SPELL-5`) | |
| `PLAYER_USE_CARD` | **[Post-MVP]** A card has been used | |

Types of the details:

| Field | Type |
|---|---|
| `game` | `GameDto` |
| `sourcePlayer`, `targetPlayer` | `PlayerDto` |
| `sourceCard`, `targetCard` | `CardDto` |
| `sourcePosition`, `targetPosition` | `PositionDto` |
| `hand` | `CardDto[]` |
| `armorDamage`, `healthDamage` | number |
| `targetDead` | boolean |

## Reconnection

- **CON-11** When a socket is bound to a user who plays a game in progress, the server sends `GAME_SYNC`: `details.game` is the `GameDto`, `details.hand` is the hand of the receiving player (only in this event) and `sequence` is the number of the last event published before the snapshot.
- **CON-12** Events can arrive out of order on a socket, so the client keeps them in a queue ordered by `sequence` and applies them one by one in that order. An event that arrives before the previous ones waits in the queue until they arrive or a new `GAME_SYNC` replaces them, for 10 seconds at most (a client constant). After that the client goes on with the next event it holds and discards the missing one if it arrives later. The board recovers, because each event carries the state (`CON-10`), but the hand can stay wrong until the next `GAME_SYNC`, which is an accepted risk of the MVP. `GAME_SYNC` and `GAME_LOADING` set the reference: the queue continues from the next `sequence`, and the events not greater than it are discarded, because the snapshot already reflects them. They are applied also when they belong to a new game. One of the game the queue follows whose `sequence` is lower than that of the last event applied is discarded instead, because it arrived late and would take the client back, for example from the board to the loading screen. When another event changes `game.code`, the queue starts over and waits for `sequence` 1 (`CON-9`). The client remembers the code of the last game it stopped having (`UI-17`): one it left as a spectator (`SPEC-3`), one cancelled (`LOAD-4`) or one already removed after its result (`WIN-5`). It discards every event of that game, snapshots included, so a late one neither brings it back nor restarts the queue of the new one. The animations of the events play in the same order, one after another, without delaying the state (`UI-4`). An event published while the snapshot is being built may already be reflected in it, and the client cannot detect it, because a card in the hand cannot be recognized (`CON-26`). This can leave a wrong hand on the client until the next `GAME_SYNC`. It can only happen when a socket is bound, and it is an accepted risk of the MVP.

## Hand

- **CON-13** `PLAYER_RECEIVE_CARD` carries `targetPlayer` for every player and `targetCard` only for the player who receives the card. The client adds the card to the hand only if the event carries it. A played card leaves the hand with the `PLAYER_PUT_CARD` or `PLAYER_EQUIP_CARD` of its owner: one copy with the same `catalogCode` (`HAND-2`). The client empties the hand when it applies the `PLAYER_DIE` of its own player (`ELIM-3`). After a connection the client clears the hand and restores it from `GAME_SYNC`, not from these events. **[Post-MVP]** The other players know the type and, for a warrior, the rarity of each card in a hand, without knowing which card it is: `PlayerDto.handBacks` is a `CardBackDto[]` (`{ type, rarity }`) in the order of the hand, and the back received is the last one. `fixed` has a back for each type and warrior rarity, whose keys `CON-30` does not define yet.

## Data

### `GameDto`

| Field | Type | Notes |
|---|---|---|
| `code` | text | |
| `round` | number | The current round, starting at 1. Not sent before the first `ROUND_CHANGE` |
| `playerWithTurn` | `PlayerDto` | Not sent before the first `TURN_CHANGE`, nor from `GAME_END` on (`CON-32`) |
| `zones` | `ZoneDto[]` | In turn order (`SETUP-3`), starting with the starting player, and it does not change during the game |

### `PlayerDto`

| Field | Type | Notes |
|---|---|---|
| `code` | text | The public id of the user (`CON-24`) |
| `name` | text | The name of the user when the game was created. It does not change during the game |
| `isAlive` | boolean | |
| `isSpectator` | boolean | `true` from the elimination on (`SPEC-1`), so in the MVP it is always the opposite of `isAlive`. It stays `true` after leaving the game (`SPEC-3`) |

### `ZoneDto`

| Field | Type | Notes |
|---|---|---|
| `owner` | `PlayerDto` | |
| `type` | text | The type each zone declares: `BASE` for a zone with a leader slot, the only type in the MVP |
| `combatants` | `ZoneSlotDto[][]` | See `CON-14` |

`ZoneDto` carries no team (see `TEAM` in `POST-MVP.md`) and no health: the health of a player's leader is in its card. The zone of an eliminated player stays in `zones` (`ELIM-5`).

- **CON-14** `ZoneSlotDto` is `{ allowedCombatant: 'LEADER' | 'WARRIOR', combatant?: CardDto }`. `combatant` is absent when the slot is empty (`CON-8`). Row indices are absolute: row 0 is the leader row, row 1 the back row and row 2 the front row, closest to the center of the table. Row 0 has a single slot, column 0, for the leader, and rows 1 and 2 have 3 slots each (`BOARD-3`). Each zone is shown with its leader at the edge of the table and its rows towards the center (`VIEW-1`).

### `CardDto`

| Field | Type | Notes |
|---|---|---|
| `catalogCode` | `CardCodeDto` | See `CON-26` |
| `name`, `description` | text | Translation keys (`CARD-7`). `description` is absent for a card without one, such as a leader (`CARD-5`) |
| `type` | text | `LEADER`, `WARRIOR`, `EQUIPMENT`, `SPELL` |
| `rarity` | text | Warriors only: `COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`, `MYTHIC` |
| `damage`, `damageType` | number, text | `PHYSICAL`, `MAGIC`, `TRUE`. The type only in combatants (`EQUIP-1`) |
| `armor`, `armorType` | number, text | `PHYSICAL`, `MAGIC`. The type only in combatants (`EQUIP-1`) |
| `health`, `maxHealth` | number | |
| `equipment` | `CardDto[]` | The equipment attached to a combatant (`EQUIP-4`) |
| `protected` | boolean | The card cannot be attacked, because its zone has cards in a row closer to the center (`PROT-1`, `PROT-2`) |
| `attackAvailable` | boolean | The card can attack now: it belongs to the player who receives the event, it is their turn, and the card has not used its attacks this turn, is not in placement cooldown and is not a protected leader (`PROT-4`) |
| `targetable` | boolean | The card is not protected and belongs to another player |

- **CON-33** `damage`, `armor` and `health` are always sent, also with a value of 0, and `maxHealth` on combatants. The damage and armor types are sent too, because they apply to the equipment attached later (`EQUIP-1`).

- **CON-34** In an `EQUIPMENT` card, `damage`, `armor` and `health` are the values it adds, negative when it subtracts, and it has no types, `maxHealth` or `rarity` (`EQUIP-1`).
- **CON-27** `damage`, `armor`, `health` and `maxHealth` are effective values, with the equipment included. `equipment` only lists what the card holds.
- **CON-15** The three flags are computed by the server for the player who receives the event. They are only meaningful in `game.zones` and are always `false` in `sourceCard`, `targetCard`, `hand` and the cards of `equipment`. For a spectator, `attackAvailable` and `targetable` are always `false`.

### Other

- **CON-38** The other types of the contract are the following.

- `CardCodeDto`: `{ code, type }`. See `CON-7` and `CON-26`.
- `PositionDto`: `{ row, column }`.
- `UserDto`: `{ id, username }`. See `CON-24`.
- `PartyDto`: `{ code, name, gameMode, userCount, maxUsers, owner, users, locked }`. `name` is computed by the server (`PARTY-11`), `owner` is a `UserDto`, `users` a `UserDto[]` in the order the users joined the party (`PARTY-7`, `UI-19`), and `locked` says whether the party is locked (`LOAD-1`, `LOAD-4`, `WIN-5`).
- `PartyListDto`: `{ parties }`, a `PartyDto[]` whose `users` are empty: the list shows `userCount` (`UI-14`).
- `gameMode`: `CLASSIC` is the only value in the MVP.
- `ResourceManifestDto`: `{ fixed, dynamic }`, both `ResourceDto[]`. See `CON-28`.
- `ResourceDto`: `{ key, type, url }`. `type` is `IMAGE` or `AUDIO`. See `CON-29` and `CON-30`.

## Commands

- **CON-16** `POST /game/{gameCode}/action` with an `ActionDto`. The identity is the session user: `sourcePlayer` must be that user's player, otherwise the action is denied.

| `ActionDto.type` | Required fields besides `game` and `sourcePlayer` |
|---|---|
| `PUT_ACTION` | `sourceCard`, `targetPosition` |
| `MOVE_ACTION` | `sourcePosition`, `targetPlayer`, `targetPosition` |
| `ATTACK_ACTION` | `sourcePosition`, `targetPlayer`, `targetPosition` |
| `EQUIP_ACTION` | `sourceCard`, `targetPlayer`, `targetPosition` |
| `SURRENDER_ACTION` | none |
| `PASS_TURN` | none |

Types of the fields:

| Field | Type |
|---|---|
| `game`, `sourcePlayer`, `targetPlayer` | Codes as text |
| `sourceCard` | `CardCodeDto` |
| `sourcePosition`, `targetPosition` | `PositionDto` |

- **CON-37** A request whose body or path cannot be read is rejected with `exception.request.malformed`, and so is an action without `type`, `game`, `sourcePlayer` or one of the required fields of its type, or whose `game` is not the `{gameCode}` of the path.

- **CON-17** A valid action changes the state, and the result reaches every client through events, including the client that sent it.
- **CON-18** The response to a request says whether it was accepted: 2xx if it was, 400 with `ExceptionCodeDto` (`{ key }`, an `exception.*` key) if it was rejected. This applies to every endpoint and every expected error (game rules, parties, users, denied accesses, elements not found). The client tells them apart by the key. When a request breaks several rules, the server returns the key of any of them, and the client does not depend on which. A 500 means an unexpected failure and carries no `ExceptionCodeDto`: the client shows it, and any other status that is neither 2xx nor 400, with its own key `exception.unexpected` (`UI-6`).
- **CON-19** The client sends no new action until the previous one has been answered. The server gives no special treatment to duplicates: it validates each action against the current state.
- **CON-20** Errors are only reported in the response to a request. There is no socket channel for errors, because every expected error comes from a request. A refused socket connection (`CON-2`) is reported by Socket.IO itself.

## Event details and order

- **CON-21** In `PLAYER_ATTACK_CARD`, `armorDamage` and `healthDamage` are the armor and health the target actually lost, not the damage of the attack: the damage beyond what the target had is not counted (`COMBAT-4`, `COMBAT-7`). `targetDead` says whether it died. The three are always sent, including a 0 or a `false`.
- **CON-22** Events are published in the following order. The first round and the first turn publish their events like any other.

| Situation | Order |
|---|---|
| Start of a game | Leaders are dealt (`SETUP-2`), `GAME_CREATED`, `GAME_LOADING`, the players confirm, `GAME_START`, and the start of a round |
| Start of a round | `ROUND_CHANGE`, one `PLAYER_RECEIVE_CARD` per card dealt, player by player in the order of `zones`, `TURN_CHANGE` |
| Turn passed | `PLAYER_PASS_TURN`, then `TURN_CHANGE`, or the start of a round if a new one starts |
| Elimination | The cause (`PLAYER_ATTACK_CARD` or `PLAYER_SURRENDER`; none when the user is deleted), `PLAYER_DIE`, and then the cancelled loading if it happens during the load and fewer than 2 players are left (`LOAD-4`), the start of the game if it happens during the load and every player left has confirmed (`LOAD-2`), the end of the game if only one player is left alive (`WIN-1`), or the same as a passed turn if the player had the turn (without `PLAYER_PASS_TURN`). A user deleted after `GAME_END` is not eliminated and publishes nothing (`ABSENT-3`) |
| End of a game | `GAME_END`, `GAME_END_WITH_WINNER` |
| Cancelled loading | `GAME_CANCELLED`, `party:info` |

- **CON-32** `playerWithTurn` only changes with `TURN_CHANGE`: the events before it still name the previous player, even if eliminated. The end of the game is the exception: from `GAME_END` on it is not sent. The `game` of `TURN_CHANGE` already has the attacks and cooldowns of the new turn reset, because no other event refreshes `attackAvailable` before the player acts.

## State on connection

- **CON-23** When a socket is bound to a user, the server sends the state of that user in this order, only to that socket. First, if they have a game, `GAME_SYNC` for a game in progress (`CON-11`) or `GAME_LOADING` for a game that is loading, with `sequence` set as in `CON-11`. A game that has ended sends neither (see the scenario). Then, if they are in a party, `party:info`. Last, always, `user:synced`. A `party:info` with no game state before it means that the user has no game loading or in progress, and the client goes to the party, also when a game that has ended still locks it (`WIN-5`). A `user:synced` with no state before it means that the user has neither a game nor a party, and the client goes to the main menu.

### Scenario

**Game ended while away**
- Given a disconnected player whose game has ended
- When they reconnect before their user is deleted
- Then they receive `party:info` with no game state, go to the party and do not see the result

## User identifiers

- **CON-24** `UserDto.id` is a public id, different from the session id, because it is shared with the other users. `/party/{partyCode}/kick/{userCode}` uses it. `PlayerDto.code` has the same value, so the client identifies its own player without exposing the session.

## Game resources

- **CON-28** `GET /game/{gameCode}/resources` returns the `ResourceManifestDto` of the game: the location of the resources the client needs to show it. `fixed` is downloaded before the game is shown (`LOAD-2`, `LOAD-6`) and `dynamic` when it is needed (`UI-21`). Any player of the game can request it at any moment of the game, also when eliminated, but not after leaving it as a spectator (`SPEC-3`). The errors are `exception.game.not_found` and `exception.access_denied.wrong_game`.
- **CON-29** The backend hosts the files under `/resources`, and each `url` is relative to the server, so the client reaches it the same way as the REST API, which requires both under one origin for the client. The client treats a `url` as opaque and finds a resource only by its `key`. The files need no session. A missing file is answered with a 404 without a key, as an exception to `CON-18`, because the client only reads the result of the download.
- **CON-30** The keys are the following. `<rarity>` is the lowercase `rarity`, and `<code>` is the one in `catalogCode` (`CON-26`).

| List | Resource | Keys |
|---|---|---|
| `fixed` | Statistic icons | `icon.damage.physical`, `icon.damage.magic`, `icon.damage.true`, `icon.armor.physical`, `icon.armor.magic`, `icon.health` |
| `fixed` | Card frames | `frame.common`, `frame.uncommon`, `frame.rare`, `frame.epic`, `frame.legendary`, `frame.mythic`, `frame.leader`, `frame.equipment` |
| `fixed` | Slot marks | `slot.warrior`, `slot.leader` |
| `fixed` | Provisional image (`UI-21`) | `card.unknown` |
| `dynamic` | Card images | `warrior.<rarity>.<code>`, `leader.<code>`, `equipment.<code>` |
| `dynamic` | Combatant audios | `<image key>.<action>` for an action with one variant, and `<image key>.<action>.<n>` for one with several, with `n` from 1 to its number of variants (`VIEW-21`). `<action>` is `put`, `die` or `attack` |

- **CON-31** `dynamic` always lists the whole catalog, even if a file does not exist yet: the client finds out when the download fails (`UI-21`). Every entry of `fixed` must exist, because a failure blocks the load (`UI-12`). In the MVP the client does not download the audios, because sounds are **[Post-MVP]** (`VIEW-9`). Until `VIEW-22` is resolved, every combatant lists 1 variant of `put` and `die` and 3 of `attack`, whatever its rarity, so the manifest does not follow `VIEW-21` yet. **[OPEN]** The keys of the sounds of `VIEW-9` that do not belong to a combatant (turn and round changes, victory and defeat), and whether equipping has an `<action>` of its own.

## REST API

- **CON-35** The endpoints are the following. `Who` is who may call each one: any session, a member of the party, its owner or a player of the game.

| Method and path | Who | Body | Response |
|---|---|---|---|
| `POST /register` | Session | | `UserDto` |
| `GET /user` | Session | | `UserDto` |
| `PUT /user` | Session | `UserDto`, whose `id` is ignored | |
| `POST /party` | Session | `{ gameMode, maxUsers }`, both optional (`PARTY-2`, `PARTY-3`) | `PartyDto` |
| `GET /party/list` | Session | | `PartyListDto` |
| `POST /party/{partyCode}/join` | Session | | `PartyDto` |
| `POST /party/{partyCode}/leave` | Member | | |
| `PUT /party/{partyCode}` | Owner | `{ gameMode, maxUsers }`, both required (`PARTY-2`, `PARTY-3`) | |
| `POST /party/{partyCode}/kick/{userCode}` | Owner | | |
| `POST /party/{partyCode}/start` | Owner | | |
| `GET /game/{gameCode}/resources` | Player | | `ResourceManifestDto` |
| `POST /game/{gameCode}/ready` | Player | | |
| `POST /game/{gameCode}/action` | Player | `ActionDto` | See `CON-18` |

## Errors

- **CON-36** The keys of `CON-18` are the following. `exception.unexpected` and `exception.server_unreachable` are not among them: they are the client's own (`UI-6`, `UI-24`).

| Key | Meaning |
|---|---|
| `exception.access_denied.wrong_game` | The action targets a game the user does not belong to |
| `exception.access_denied.identity_mismatch` | `sourcePlayer` is not the session user's player |
| `exception.{game,player,card,zone,party,user,game_mode}.not_found` | The element does not exist |
| `exception.party.user_is_not_party_owner` | Only the owner can do this |
| `exception.party.user_already_in_party` | The user already belongs to a party |
| `exception.request.malformed` | The body or the path of the request cannot be read, or an action lacks a required field (`CON-37`) |
| `exception.party.locked` | The party is locked (`LOAD-1`, `PARTY-3`, `PARTY-5`, `PARTY-6`, `PARTY-9`) |
| `exception.party.is_full` | The party has reached its capacity |
| `exception.party.cannot_kick_owner` | `PARTY-6` |
| `exception.party.user_not_in_party` | The user who leaves, or the one kicked, is not a member (`PARTY-6`) |
| `exception.party.max_users_out_of_range` | The capacity is outside 2 to 10 or below the current members (`PARTY-2`) |
| `exception.party.not_enough_players` | `PARTY-9` |
| `exception.party.deck_without_leader` | `DECK-4` |
| `exception.user.invalid_username` | `USER-4` |
| `exception.user.in_game` | `USER-3` |
| `exception.player-action.allowed_only_on_turn` | It is not the player's turn |
| `exception.player-action.game_not_in_progress` | The game is not in progress: it is loading or it has ended (`TURN-7`) |
| `exception.player-action.selected_card_not_found` | The card is not in the hand |
| `exception.player-action.selected_card_is_not_combatant` | Only a combatant can be placed |
| `exception.player-action.selected_card_is_not_equipment` | Only equipment can be equipped |
| `exception.player-action.card_cant_be_used` | **[Post-MVP]** The card cannot be used (`SPELL-4`) |
| `exception.player-action.selected_target_position_already_has_combatant` | The slot is occupied |
| `exception.player-action.selected_source_position_has_none_combatant` | The source slot is empty |
| `exception.player-action.selected_target_zone_is_not_source_zone` | A card only moves inside its owner's zone |
| `exception.player-action.selected_source_is_leader` | The leader cannot be moved |
| `exception.player-action.selected_target_position_not_allowed` | The target slot is not allowed |
| `exception.player-action.selected_source_attack_in_cooldown` | The card cannot attack now |
| `exception.player-action.selected_source_leader_is_protected` | `PROT-4` |
| `exception.player-action.selected_target_is_protected` | The target is protected |
| `exception.player-action.selected_target_is_own` | `COMBAT-12` |
| `exception.player-action.selected_target_position_has_none_combatant` | The target slot of an attack or an equipment is empty (`COMBAT-12`, `EQUIP-3`) |
| `exception.player-action.equip_target_not_owned` | `EQUIP-3` |
| `exception.zone.coordinate.out_of_bounds` | The position is outside the zone |
| `exception.zone.coordinate.requires_leader` | The slot only admits a leader. Only a placement checks it (`BOARD-7`), and in the MVP the leader slot is never empty while its owner can act (`ELIM-1`), so such a placement also breaks the rule of an occupied slot (`CON-18`) |
| `exception.zone.row.previous_need_to_be_filled` | `BOARD-5` |
