# SPECS

Functional specification of Crazy Random Multiverse. Source of truth for behavior.

Derived from `docs/Requirements.md` and the previous frontend backlog. Statements marked **[OPEN]** are contradictory or ambiguous in the sources and must be resolved by a person before being implemented. Do not guess them. Currently there are none.

## 1. Overview

A strategic showdown. Each player receives a random leader card, shown publicly. The objective is to eliminate the enemy leaders before they eliminate yours.

## 2. Architecture constraints

- The backend holds the only authoritative game state (in memory).
- The frontend is a view of that state. It sends commands and renders confirmed results; it never mutates game state before the server confirms.
- Commands: REST `POST /game/{gameCode}/action`. Updates: Socket.IO events.
- The contract between both sides is described in 2.1.

### 2.1 Backend ↔ frontend contract

**Connection.** The client opens a Socket.IO connection to the backend (port 9092, path `/socket.io`; the client may override both). The client sends the HTTP session cookie (`SESSION`) in the handshake. The server resolves the user from that session, binds the socket to the user and refuses the connection if the session does not belong to a registered user. When a socket drops, only the socket is unbound: the user, its party and its game are kept. Reconnection is performed by the Socket.IO client. `crm.communication.socket-io.origin` (default `*`) is the origin allowed to connect; browsers refuse cookies when it is `*`, so production sets the explicit origin if the client connects from another origin.

**Server → client channels.**

| Channel | Payload |
|---|---|
| `game:event` | `EventDto`: `{ code: EventCode, details: EventDetailsDto }` |
| `error` | `ExceptionCodeDto`: `{ key }`, an `exception.*` key for a rejected action |
| `party:info` | `PartyDto` |

`EventDetailsDto` always carries `game` (a `GameDto` snapshot) and optionally `sourcePlayer`, `sourceCard`, `sourcePosition`, `targetPlayer`, `targetCard`, `targetPosition`. Event names are the `EventCode` values (`GAME_START`, `TURN_CHANGE`, `PLAYER_PUT_CARD`, ...). Every event carries `sequence`: a number per game, increased by one for each published event and assigned in publication order. The counter lives with the in-memory state, so it restarts together with the games when the server restarts.

**Identifiers.** Codes travel as plain text inside JSON bodies (events and actions). They are encoded as Base64 URL-safe only when they are part of a URL path. Card codes (`CardCodeDto.code`) travel as decimal text so that no digit is lost in JavaScript: the backend keeps them as a `long` and the frontend as a `string`.

**Reconnection.** When a socket is bound to a user who plays a game in progress, the server sends `game:event` with code `GAME_SYNC`: `details.game` is the `GameDto`, `details.hand` is the hand of the receiving player (only in this event) and `sequence` is the number of the last event published before the snapshot. The client discards the events whose `sequence` is not greater. An event published while the snapshot is being built may already be reflected in it, so the client ignores a received card that is already in its hand.

**Commands.** `POST /game/{gameCode}/action` with an `ActionDto`. The identity is the session user: `sourcePlayer` must be that user's player, otherwise the action is denied.

| `ActionDto.type` | Required fields besides `game` and `sourcePlayer` |
|---|---|
| `PUT_ACTION` | `sourceCard`, `targetPosition` |
| `MOVE_ACTION` | `sourcePosition`, `targetPosition` |
| `ATTACK_ACTION` | `sourcePosition`, `targetPlayer`, `targetPosition` |
| `EQUIP_ACTION` | `sourceCard`, `targetPosition` (`targetPlayer` defaults to `sourcePlayer`) |
| `SURRENDER_ACTION` | none |
| `PASS_TURN` | none |

**Hand.** `PLAYER_RECEIVE_CARD` is sent with `targetPlayer` and `targetCard` only to the player who receives the card; the other players receive the same event without the card. After a connection the hand is restored from `GAME_SYNC`, not from these events.

**Zones and slots.** `ZoneDto.combatants` is a matrix of `ZoneSlotDto` (`{ allowedCombatant: 'LEADER' | 'WARRIOR', combatant: CardDto | null }`). Row indices are absolute: in a zone with a leader, row 0 is the leader row and a higher index is closer to the center of the table. The frontend inverts them visually so the leader is nearest to the local player. `ZoneDto.type` is `BASE` for a zone with a leader slot and `NO_LEADER` otherwise. `ZoneDto` carries no team: the teams concept is Post-MVP.

**Card runtime state.** Each `CardDto` inside `game.zones` carries, computed by the server for the player who receives the event:

- `protected`: a card stands in a row closer to the center.
- `attackAvailable`: the card has not used its attacks this turn.
- `targetable`: the card is not protected and belongs to another player.

A combatant also carries its attached `equipment` (a `CardDto`). These three flags are meaningless on `sourceCard` and `targetCard`. The server also rejects an attack on a protected card.

## 3. Players and game flow

### 3.1 Setup

- Each player is dealt one random leader card.
- The leader is placed face up in the player's zone and is visible to everyone.
- Supports 2 to 10 players.
- Teams are supported (see 8). Two players belong to the same team either from the game configuration or through a spell.

### 3.2 Turns

- The starting player is chosen at random by the server.
- In their turn a player may: play a card, move a card, attack with a card, equip, use a spell, surrender, or pass the turn.
- The backend domain implements Put, Move, Attack, Equip, UseCard, UseSpell, Surrender and PassTurn. The public API (`ActionType`) exposes `PUT_ACTION`, `MOVE_ACTION`, `ATTACK_ACTION`, `EQUIP_ACTION`, `SURRENDER_ACTION` and `PASS_TURN`. Using a card and casting a spell are Post-MVP.
- Actions are only accepted for the player whose turn it is, including surrender.
- Actions are validated by the server; a rejected action leaves the state unchanged.

### 3.3 Rounds

Each round, a set of cards is dealt to all players. The schedule below is the default; the backend owns it and may configure it. The MVP does not promise what is dealt: the frontend renders whatever cards the backend sends.

| Round | Cards dealt |
|---|---|
| 1 | 2 Pop |
| 2 | 1 Pop, 1 Common |
| 3 | 1 Spell |
| 4 | 1 Rare |
| 5 | 1 Spell, 1 Rare |
| 6 | 1 Epic |
| 7 onwards | 1 Spell |

The frontend must not hardcode the schedule.

### 3.4 Hand

- Unlimited cards in hand.
- Opponents' hands are private.
- A played card leaves the hand only after the server confirms the action.

## 4. Board

Each player zone has leader and warrior slots arranged in rows.

- The leader is alone in its row.
- The protection rows hold at most 3 cards each.
- At most 6 warriors on the board plus the leader.
- Row 2 must be filled before row 1.
- Moving a card has no cooldown: a player may move cards as many times as they want during their turn.
- A card moves only inside its owner's zone, to a free slot whose previous row is filled. The leader cannot be moved.
- A placed card has a one-turn cooldown before it can act.
- Each card may attack once per turn unless the card says otherwise.

Order from the center of the table: center -> row 1 -> row 2 -> leader. Row 1 is the most exposed and protects row 2; row 2 protects the leader. A card in row 2 cannot be attacked while row 1 has cards, and the leader cannot be attacked while rows 1 or 2 have cards.

## 5. Cards

### 5.1 Types

| Type | Description |
|---|---|
| Leader | One per player. If it dies, the player loses. |
| Warrior | Protects the leader. Rarities: Pop, Common, Rare, Epic, Legendary, Mythic. |
| Equipment | Attached to a Warrior or Leader to improve it. |
| Spell | Varied effects, good or harmful, may change the rules of the game. |

### 5.2 Statistics (Warrior and Leader)

- **Damage:** Physical, Magic or True. True damage can be finite or infinite.
- **Armor:** Physical or Magic.
- **Health:** finite or infinite.

### 5.3 Equipment

- Equipment is attached to one card.
- When the equipped card permanently changes owner, or dies, the equipment disappears.
- Equipment is supported by the backend (`EquipAction`).

### 5.4 Spells

- A spell whose description contains an `R` is cast automatically when played, with no intervention of the player (autotrigger); who it affects depends on the implementation of each spell. Spells are Post-MVP.
- A spell can force the caster into an alliance with another player (team formation).

## 6. Protection and targeting

- A card in a protected row cannot be attacked while a card stands in front of it.
- A leader can attack and be attacked only when unprotected: rows 1 and 2 are both empty.
- An exposed leader is not forced onto anyone: whether to attack it is the players' decision, not a rule.
- The server provides the targetable/`PROTECTED` state of each card; the frontend highlights valid targets and disables invalid ones.

## 7. Combat

Damage is resolved in this order:

1. Physical damage hits physical armor first, then health. It ignores magic armor.
2. Magic damage hits magic armor first, then health. It ignores physical armor.
3. When armor breaks, the excess damage is discarded.
4. Exception: damage from Legendary cards that exceeds armor, of any type, carries over to health.
5. True damage ignores armor, abilities and spells.
6. Infinite damage ignores infinite health and armor.
7. Post-MVP: when a card reaches 100 physical damage, excess damage dealt to armor carries over to health.

Health reaching 0 kills the card. A dead card is removed after its animation. If it is a leader, its owner is eliminated.

## 8. Teams

- When a member of a team wins, all allies win, living or dead.
- Example: if you die but your teammate wins, you win too.

## 9. Winning

- A player loses immediately when their leader dies (or when they surrender). In a team game, they still win if their team wins (see 8).
- A player who surrenders (only on their turn) loses at once: their cards are removed, they become a spectator and the turn passes to the next living player.
- The game ends when only one leader (or one team) is left alive; that player or team wins.
- The server decides the end of the game and the winner. The frontend shows the victory or defeat screen and disables interaction.

## 10. Spectators

- A spectator sees the game but cannot interact.
- A player becomes a spectator when they die, and keeps watching the game.

## 11. Advanced variants (post-MVP)

- **Trolling cards:** show a circle next to health and damage. Green: a normal card. Red: the card moves to the center of the table and only attacks its owner.
- Infinite stats and true damage beyond the base rules.
- Combat log and dynamic localization.
- AI system: see `docs/AISystem.md`.

## 12. MVP scope

Required for the first playable version: deal, placement, combat, victory/defeat, with at least one Leader and three Warrior types (Pop, Common, Rare).

Basic equipment is in the MVP: equipping a card, and losing the equipment when its owner dies. Out of the MVP: spells, complex equipment effects, infinite stats and true damage, advanced AI, combat log, premium animations.

## 13. Open questions summary

None.
