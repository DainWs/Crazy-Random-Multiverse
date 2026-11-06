# Game flow

## Setup

- **SETUP-1** A game has 2 to 10 players.
- **SETUP-2** When the game is created, before loading, each player is dealt one random leader, already placed face up in their zone and visible to everyone. The player does not place it, and it publishes no `PLAYER_RECEIVE_CARD`.
- **SETUP-3** The server draws the starting player and the whole turn order at random.

## Turns

- **TURN-1** The order drawn in `SETUP-3` does not change during the game. Eliminated players are skipped.
- **TURN-2** In their turn a player may place, move, attack, equip, surrender or pass the turn.
- **TURN-3** There is no limit of actions per turn beyond the rules of each action. The turn lasts until the player passes it or is eliminated (`ELIM-1`, `ELIM-4`).
- **TURN-4** There is no turn time limit. A disconnected player blocks the game during their turn until their user is deleted (`ABSENT-3`). A player who stays connected without acting blocks it indefinitely, because their user is not deleted, and the other players can only leave by closing the game (`ABSENT-2`). Both are accepted risks of the MVP.
- **TURN-5** Actions are only accepted from the player whose turn it is, including surrender.
- **TURN-6** Actions are validated by the server. A rejected action leaves the state unchanged.
- **TURN-7** Actions are only accepted while the game is in progress: not while it is loading or after it ends.

## Rounds

- **ROUND-1** A round is a full pass of the turn order, starting at the starting player.
- **ROUND-2** The first round starts when the game starts. A new round starts when the turn would return to the starting player's seat, even if that player has been eliminated.
- **ROUND-3** At the start of each round, every living player receives that round's cards at the same time, before the first turn of the round.
- **ROUND-4** The schedule below belongs to the game mode, in the backend. The frontend does not hardcode it and renders whatever cards it receives.

| Round | Cards dealt | While spells do not exist (MVP) |
|---|---|---|
| 1 | 2 Common | Same |
| 2 | 1 Common, 1 Uncommon | Same |
| 3 | 1 Spell | 1 Equipment |
| 4 | 1 Rare | Same |
| 5 | 1 Spell, 1 Rare | 1 Equipment, 1 Rare |
| 6 | 1 Epic | Same (nothing if the deck has no Epic, `DECK-3`) |
| 7 onwards | 1 Spell | 1 Equipment |

### Scenarios

**Eliminated starting player**
- Given players A, B and C in that order, with A as starting player
- And A has been eliminated
- When C passes the turn
- Then a new round starts, its cards are dealt to B and C, and the turn goes to B

**Cards before the turn**
- Given round 3 is about to start
- When the round starts
- Then every living player receives 1 Equipment, and only then does the first turn of the round start

## Deck

- **DECK-1** In the MVP, every game uses the single deck of the server. Choosing or uploading a deck is **[Post-MVP]** (`VAR-3`).
- **DECK-2** The deck never runs out. Each deal picks at random among the cards of the requested category, and cards can repeat.
- **DECK-3** If the deck has no card of the requested category, nothing is dealt for that slot and the game continues.
- **DECK-4** The deck contains at least one leader, because a game cannot start without one. If it has none, starting a game is rejected (`exception.party.deck_without_leader`).
- **DECK-5** Leaders can repeat in a game. **[Post-MVP]** They do not repeat when the deck has enough for every player.

## Hand

- **HAND-1** A hand has no card limit.
- **HAND-2** A played card leaves the hand only after the server confirms the action, when its event is applied (`CON-12`, `CON-13`).
- **HAND-3** The cards in a hand are private. How many cards each player holds is public.
- **HAND-4** The client numbers the copies of a card in its hand by how many it holds, renumbering them when one leaves. That number is internal: it is not shown and never reaches the server (`CON-26`).
