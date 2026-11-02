# Game end

## Elimination

- **ELIM-1** A player is eliminated when their leader dies or when they surrender.
- **ELIM-2** A player can only surrender during their turn.
- **ELIM-3** When a player is eliminated, their cards leave the board and their hand is discarded, whatever the cause.
- **ELIM-4** If the eliminated player had the turn, it passes to the next living player.

## Absence

- **ABSENT-1** A disconnected player keeps their place, cards and turn, and can return to the game (`CON-11`).
- **ABSENT-2** Closing the game is a disconnection, not a surrender. A player who has not been eliminated cannot abandon the game any other way.
- **ABSENT-3** When the user of a disconnected player is deleted (`CON-3`), that player is eliminated, even outside their turn.
- **ABSENT-4** **[Post-MVP]** Voting to kick a player in the middle of a game.

## Winning

- **WIN-1** The game ends when only one leader is left alive, and its owner wins.
- **WIN-2** There are no ties in the MVP, because there are no spells. **[Post-MVP]** See `SPELL-5`.
- **WIN-3** The server decides the end of the game and the winner.
- **WIN-4** When the game ends, the frontend shows the result and disables interaction.
- **WIN-5** After the result, the players go back to the same party, which unlocks so its owner can start another game. The finished game is removed from memory.

## Spectators

- **SPEC-1** An eliminated player becomes a spectator and sees the game without being able to act.
- **SPEC-2** A spectator sees what a player sees, except that they see no hand.
- **SPEC-3** A spectator can leave the game at any moment, which also takes them out of the party.
- **SPEC-4** **[Post-MVP]** Users from outside the game can watch it.

### Scenarios

**Deleted during their own turn**
- Given a disconnected player who has the turn, in a game of three
- When their user is deleted
- Then they are eliminated, their cards leave the board and the turn passes to the next living player

**Last two players**
- Given a game with two living players, one of them disconnected
- When the user of the disconnected player is deleted
- Then the other player wins

**Back to the party**
- Given a finished game
- When the players close the result
- Then they are in the same party, and any user who was deleted during the game is no longer a member
