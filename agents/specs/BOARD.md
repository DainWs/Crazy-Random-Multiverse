# Board

Order from the center of the table: center → front row → back row → leader row. The front row is the most exposed. In the contract the leader row is index 0, the back row 1 and the front row 2 (`CON-14`).

## Zones and placement

- **BOARD-1** Each player has a zone with leader and warrior slots arranged in rows.
- **BOARD-2** The leader is alone in its row.
- **BOARD-3** The front and back rows hold at most 3 cards each, so a zone holds at most 6 warriors plus the leader.
- **BOARD-4** All cards on the board are public.
- **BOARD-5** The back row must be filled before the front row: a card can only go to the front row while all 3 slots of the back row are occupied. Cards already in the front row stay there when a gap opens in the back row.

### Scenario

**Gap in the back row**
- Given a zone with 3 warriors in the back row and 1 in the front row
- When a warrior in the back row dies and its owner places a card in the front row
- Then the action is rejected, and the card can only go to the free slot in the back row

## Movement

- **BOARD-6** Moving has no cooldown: a player may move cards as many times as they want during their turn, before or after attacking with them.
- **BOARD-7** A card moves only inside its owner's zone. To a free slot allowed by `BOARD-5`, checked with the card still in its origin, so a move may leave a gap behind, and a card in the front row cannot change slot inside it while the back row has a gap. To an occupied slot, the two cards swap places, without checking `BOARD-5`. A move to the card's own slot is rejected. The leader cannot be moved or swapped. A swap is published as `PLAYER_MOVE_CARD`.

### Scenario

**Attack, then retreat**
- Given a warrior in the front row that can attack
- When its owner attacks with it and then moves it to a free slot in the back row
- Then both actions are accepted

**Front row with a gap behind**
- Given a zone with 2 warriors in the back row and 1 in the front row
- When its owner moves the warrior of the front row to a free slot of the front row
- Then the action is rejected

## Attack limits

- **BOARD-8** A placed card has a one-turn cooldown before it can attack: it can attack from its owner's next turn. Moving or swapping a card does not change its cooldown. The leader has none: it can attack from its owner's first turn if it is unprotected.
- **BOARD-9** Each card may attack once per turn, and can attack again when its owner's next turn starts. **[Post-MVP]** A card can say otherwise.

## Protection

- **PROT-1** A card in the back row cannot be attacked while the front row has cards.
- **PROT-2** A leader cannot be attacked while the front or back rows have cards.
- **PROT-3** Protection prevents attacks against a card, not attacks made by it. A warrior in the back row can attack while the front row has cards.
- **PROT-4** The leader is the exception: it can only attack while the front and back rows are empty.
- **PROT-5** An exposed leader is not forced onto anyone: whether to attack it is the players' decision.
- **PROT-6** The server provides the `protected` and `targetable` state of each card and rejects an attack on a protected card.

### Scenario

**Protected warrior attacks**
- Given a warrior in the back row of its owner's zone, with cards in the front row
- When its owner attacks an exposed enemy card with it
- Then the attack is accepted

**Protected leader**
- Given a leader with one warrior in the front row
- When its owner attacks with the leader
- Then the attack is rejected
