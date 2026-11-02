# Board

Order from the center of the table: center → row 1 → row 2 → leader. Row 1 is the most exposed. The numbering in the contract is different (`CON-14`).

## Zones and placement

- **BOARD-1** Each player has a zone with leader and warrior slots arranged in rows.
- **BOARD-2** The leader is alone in its row.
- **BOARD-3** Rows 1 and 2 hold at most 3 cards each, so a zone holds at most 6 warriors plus the leader.
- **BOARD-4** All cards on the board are public.
- **BOARD-5** Row 2 must be filled before row 1.

## Movement

- **BOARD-6** Moving has no cooldown: a player may move cards as many times as they want during their turn, before or after attacking with them.
- **BOARD-7** A card moves only inside its owner's zone. To a free slot whose previous row is filled, checked with the card still in its origin, so a move may leave a gap behind. To an occupied slot, the two cards swap places. The leader cannot be moved or swapped. A swap is published as `PLAYER_MOVE_CARD`.

### Scenario

**Attack, then retreat**
- Given a warrior in row 1 that can attack
- When its owner attacks with it and then moves it to a free slot in row 2
- Then both actions are accepted

## Attack limits

- **BOARD-8** A placed card has a one-turn cooldown before it can attack. The leader has none: it can attack from its owner's first turn if it is unprotected.
- **BOARD-9** Each card may attack once per turn unless the card says otherwise.

## Protection

- **PROT-1** A card in row 2 cannot be attacked while row 1 has cards.
- **PROT-2** A leader cannot be attacked while rows 1 or 2 have cards.
- **PROT-3** Protection prevents attacks against a card, not attacks made by it. A warrior in row 2 can attack while row 1 has cards.
- **PROT-4** The leader is the exception: it can only attack while rows 1 and 2 are empty.
- **PROT-5** An exposed leader is not forced onto anyone: whether to attack it is the players' decision.
- **PROT-6** The server provides the `protected` and `targetable` state of each card and rejects an attack on a protected card.

### Scenario

**Protected warrior attacks**
- Given a warrior in row 2 of its owner's zone, with cards in row 1
- When its owner attacks an exposed enemy card with it
- Then the attack is accepted

**Protected leader**
- Given a leader with one warrior in row 1
- When its owner attacks with the leader
- Then the attack is rejected
