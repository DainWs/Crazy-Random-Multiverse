# Backend ↔ frontend contract

Differences between this document and the code are tracked in `ROADMAP.md`, Pending tasks.

## Connection

- **CON-1** The client opens a Socket.IO connection to the backend (port 9092, path `/socket.io`; the client may override both) and sends the HTTP session cookie (`SESSION`) in the handshake.
- **CON-2** The server resolves the user from that session, binds the socket to the user and refuses the connection if the session does not belong to a registered user.
- **CON-3** When a socket drops, only the socket is unbound. The user, their party and their game are kept until a periodic task deletes the users without an open socket (every 15 minutes, `crm.user.cleanup-interval`). See `ABSENT` in `GAME-END.md`.
- **CON-4** Reconnection is performed by the Socket.IO client.
- **CON-5** `crm.communication.socket-io.origin` (default `*`) is the origin allowed to connect. Browsers refuse cookies when it is `*`, so production sets the explicit origin if the client connects from another origin.

## Server → client channels

| Channel | Payload |
|---|---|
| `game:event` | `EventDto` |
| `party:info` | `PartyDto`, sent to the party members when the party changes |

## Identifiers

- **CON-6** Codes travel as plain text inside JSON bodies. They are encoded as Base64 URL-safe only when they are part of a URL path.
- **CON-7** Card codes (`CardCodeDto.code`) travel as decimal text so that no digit is lost in JavaScript: the backend keeps them as a `long` and the frontend as a `string`.
- **CON-8** A field with no value is not sent (the Socket.IO serializer omits `null`), so the frontend types of those fields are optional.

## Events

`EventDto`: `{ code, sequence, details }`.

- **CON-9** `sequence` is a number per game, increased by one for each published event and assigned in publication order. It restarts together with the games when the server restarts.
- **CON-10** `details` is an `EventDetailsDto`. It always carries `game` (a `GameDto`) and optionally the fields in the table below.

| `code` | Published when | Details besides `game` |
|---|---|---|
| `GAME_CREATED` | The game has been created | |
| `GAME_LOADING` | Clients must load the game and confirm with `/ready` | |
| `GAME_START` | Every player has confirmed (`LOAD-2`) | |
| `GAME_SYNC` | A socket is bound to a user with a game in progress, sent only to that user | `hand` |
| `ROUND_CHANGE` | A new round starts | |
| `TURN_CHANGE` | The turn changes | |
| `PLAYER_RECEIVE_CARD` | A player receives a card | `targetPlayer`, `targetCard` (`CON-13`) |
| `PLAYER_PUT_CARD` | A card has been placed | `sourcePlayer`, `sourceCard`, `targetPlayer`, `targetPosition` |
| `PLAYER_MOVE_CARD` | A card has been moved or swapped | `sourcePlayer`, `sourcePosition`, `targetPlayer`, `targetPosition` |
| `PLAYER_ATTACK_CARD` | An attack has been resolved | `sourcePlayer`, `sourcePosition`, `targetPlayer`, `targetPosition` |
| `PLAYER_EQUIP_CARD` | A card has been equipped | `sourcePlayer`, `sourceCard`, `targetPlayer`, `targetPosition` |
| `PLAYER_PASS_TURN` | The player has passed the turn | `sourcePlayer` |
| `PLAYER_SURRENDER` | The player has surrendered | `sourcePlayer` |
| `PLAYER_DIE` | A player has been eliminated | `targetPlayer` |
| `GAME_END` | The game is over | |
| `GAME_END_WITH_WINNER` | Follows `GAME_END` and names the winner | `targetPlayer` |
| `GAME_END_WITH_TIE` | **[Post-MVP]** Follows `GAME_END` when no leader is left alive (`SPELL-5`) | |
| `PLAYER_USE_CARD` | **[Post-MVP]** A card has been used | |

## Reconnection

- **CON-11** When a socket is bound to a user who plays a game in progress, the server sends `GAME_SYNC`: `details.game` is the `GameDto`, `details.hand` is the hand of the receiving player (only in this event) and `sequence` is the number of the last event published before the snapshot.
- **CON-12** The client discards the events whose `sequence` is not greater. An event published while the snapshot is being built may already be reflected in it, so the client ignores a received card that is already in its hand.

## Hand

- **CON-13** `PLAYER_RECEIVE_CARD` is sent with `targetPlayer` and `targetCard` only to the player who receives the card; the other players receive the same event without the card. After a connection the hand is restored from `GAME_SYNC`, not from these events.

## Data

### `GameDto`

| Field | Type | Notes |
|---|---|---|
| `code` | text | |
| `round` | number | The current round, starting at 1 |
| `playerWithTurn` | `PlayerDto` | |
| `zones` | `ZoneDto[]` | |

### `PlayerDto`

| Field | Type | Notes |
|---|---|---|
| `code` | text | |
| `name` | text | |
| `isAlive` | boolean | |
| `isSpectator` | boolean | |
| `handSize` | number | Public, see `HAND-3` |

### `ZoneDto`

| Field | Type | Notes |
|---|---|---|
| `owner` | `PlayerDto` | |
| `type` | text | The type each zone declares: `BASE` for a zone with a leader slot |
| `health`, `maxHealth` | number | Absent when the zone has infinite health (a zone that has no leader yet); the frontend reads them as infinite |
| `combatants` | `ZoneSlotDto[][]` | See `CON-14` |

`ZoneDto` carries no team (see `TEAM` in `POST-MVP.md`).

- **CON-14** `ZoneSlotDto` is `{ allowedCombatant: 'LEADER' | 'WARRIOR', combatant: CardDto | null }`. Row indices are absolute: row 0 is the leader row and a higher index is closer to the center of the table. The frontend shows the leader nearest to the local player, so it inverts them for display.

### `CardDto`

| Field | Type | Notes |
|---|---|---|
| `code` | `CardCodeDto` | |
| `name`, `description` | text | Translation keys |
| `type` | text | `LEADER`, `WARRIOR`, `EQUIPMENT`, `SPELL` |
| `rarity` | text | Warriors only: `COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`, `MYTHIC` |
| `damage`, `damageType` | number, text | `PHYSICAL`, `MAGIC`, `TRUE` |
| `armor`, `armorType` | number, text | `PHYSICAL`, `MAGIC` |
| `health`, `maxHealth` | number | |
| `equipment` | `CardDto[]` | The equipment attached to a combatant (`EQUIP-4`) |
| `protected` | boolean | A card stands in a row closer to the center |
| `attackAvailable` | boolean | The card can attack now: it has not used its attacks this turn and is not in placement cooldown |
| `targetable` | boolean | The card is not protected and belongs to another player |

A statistic with value 0 is not sent.

- **CON-15** The three flags are computed by the server for the player who receives the event. They are only meaningful in `game.zones` and are always `false` in `sourceCard`, `targetCard` and `hand`.

### Other

- `PositionDto`: `{ row, column }`.
- `UserDto`: `{ id, username }`.
- `PartyDto`: `{ code, name, gameMode, userCount, maxUsers, owner, users }`.
- `PartyListDto`: `{ parties }`.
- `gameMode`: `CLASSIC` is the only value in the MVP.

## Commands

- **CON-16** `POST /game/{gameCode}/action` with an `ActionDto`. The identity is the session user: `sourcePlayer` must be that user's player, otherwise the action is denied.

| `ActionDto.type` | Required fields besides `game` and `sourcePlayer` |
|---|---|
| `PUT_ACTION` | `sourceCard`, `targetPosition` |
| `MOVE_ACTION` | `sourcePosition`, `targetPosition` |
| `ATTACK_ACTION` | `sourcePosition`, `targetPlayer`, `targetPosition` |
| `EQUIP_ACTION` | `sourceCard`, `targetPosition` |
| `SURRENDER_ACTION` | none |
| `PASS_TURN` | none |

- **CON-17** A valid action changes the state, and the result reaches every client through events, including the client that sent it.
- **CON-18** The response to a request says whether it was accepted: 2xx if it was, 400 with `ExceptionCodeDto` (`{ key }`, an `exception.*` key) if it was rejected. This applies to every endpoint and every expected error (game rules, parties, users, denied accesses, elements not found). The client tells them apart by the key. A 500 means an unexpected failure.
- **CON-19** The client sends no new action until the previous one has been answered. The server gives no special treatment to duplicates: it validates each action against the current state.
- **CON-20** Errors are only reported in the response to a request. There is no socket channel for errors, because every expected error comes from a request. A refused socket connection (`CON-2`) is reported by Socket.IO itself.

## REST API

| Method and path | Who | Body | Response |
|---|---|---|---|
| `POST /register` | Session | | `UserDto` |
| `POST /login` | Session | Username | `UserDto` |
| `GET /user` | Session | | `UserDto` |
| `PUT /user` | Session | `UserDto` | |
| `POST /party` | Session | `{ gameMode, maxPlayers }` | `PartyDto` |
| `GET /party/list` | Session | | `PartyListDto` |
| `POST /party/{partyCode}/join` | Session | | `PartyDto` |
| `POST /party/{partyCode}/leave` | Member | | |
| `PUT /party/{partyCode}` | Owner | `{ code, gameMode, maxPlayers }` | |
| `POST /party/{partyCode}/kick/{userCode}` | Owner | | |
| `POST /party/{partyCode}/start` | Owner | | |
| `POST /game/{gameCode}/ready` | Player | | |
| `POST /game/{gameCode}/action` | Player | `ActionDto` | See `CON-18` |

## Errors

The keys of `CON-18`. Those marked as new do not exist in the code yet.

| Key | Meaning |
|---|---|
| `exception.access_denied.wrong_game` | The action targets a game the user does not belong to |
| `exception.access_denied.identity_mismatch` | `sourcePlayer` is not the session user's player |
| `exception.{game,player,card,zone,party,user,game_mode}.not_found` | The element does not exist |
| `exception.party.user_is_not_party_owner` | Only the owner can do this |
| `exception.party.user_already_in_party` | The user already belongs to a party |
| `exception.party_locked` | The party has a game in progress |
| `exception.party_is_full` | The party has reached its capacity |
| `exception.party.max_players_out_of_range` (new) | `PARTY-2` |
| `exception.party.not_enough_players` (new) | `PARTY-9` |
| `exception.user.invalid_username` (new) | `USER-4` |
| `exception.player-action.allowed_only_on_turn` | It is not the player's turn |
| `exception.player-action.selected_card_not_found` | The card is not in the hand |
| `exception.player-action.selected_card_is_not_combatant` | Only a combatant can be placed |
| `exception.player-action.selected_card_is_not_equipment` | Only equipment can be equipped |
| `exception.player-action.selected_target_coordinate_is_null` | A position is missing |
| `exception.player-action.selected_target_position_already_has_combatant` | The slot is occupied |
| `exception.player-action.selected_source_position_has_none_combatant` | The source slot is empty |
| `exception.player-action.selected_target_zone_is_not_source_zone` | A card only moves inside its owner's zone |
| `exception.player-action.selected_source_is_leader` | The leader cannot be moved |
| `exception.player-action.selected_target_position_not_allowed` | The target slot is not allowed |
| `exception.player-action.selected_source_attack_in_cooldown` | The card cannot attack now |
| `exception.player-action.selected_target_is_protected` | The target is protected |
| `exception.player-action.equip_target_not_owned` (new) | `EQUIP-3` |
| `exception.zone.coordinate.out_of_bounds` | The position is outside the zone |
| `exception.zone.coordinate.already_filled` | The slot is occupied |
| `exception.zone.coordinate.cannot_swap` | These cards cannot swap |
| `exception.zone.row.previous_need_to_be_filled` | `BOARD-5` |
