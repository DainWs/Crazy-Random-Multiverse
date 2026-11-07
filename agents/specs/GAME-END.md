# Game end

## Elimination

- **ELIM-1** A player is eliminated when their leader dies, when they surrender or when their user is deleted (`ABSENT-3`, `USER-7`).
- **ELIM-2** A player can only surrender during their turn.
- **ELIM-3** When a player is eliminated, their cards leave the board and their hand is discarded, whatever the cause.
- **ELIM-4** If the eliminated player had the turn, it passes to the next living player.
- **ELIM-5** The zone of an eliminated player stays on the board, with no cards, so the positions of the other zones do not change.

## Absence

- **ABSENT-1** A disconnected player keeps their place, cards and turn, and can return to the game (`CON-11`) until the grace period ends and their user is deleted (`CON-3`).
- **ABSENT-2** Closing the game is a disconnection, not a surrender. A player who has not been eliminated cannot abandon the game any other way than surrendering (`ELIM-2`).
- **ABSENT-3** When the user of a disconnected player is deleted (`CON-3`), that player is eliminated, even outside their turn.
- **ABSENT-4** **[Post-MVP]** Voting to kick a player in the middle of a game.

## Winning

- **WIN-1** The game ends when only one leader is left alive, and its owner wins.
- **WIN-2** There are no ties in the MVP, because there are no spells. **[Post-MVP]** See `SPELL-5`.
- **WIN-3** The server decides the end of the game and the winner.
- **WIN-4** When the game ends, the frontend shows the result over the board and disables interaction. The result appears when the animations of the last events end, so it does not hide them. It says victory or defeat for the local player, names the winner and counts down the seconds left until returning to the party (`WIN-5`). The countdown starts from a client constant equal to the default duration of `WIN-5`. The return happens with the `party:info` of `WIN-5`, not when the countdown ends, so a different server setting only makes the countdown inaccurate.
- **WIN-5** The party stays locked while the result is shown (15 seconds, `crm.game.result-duration`). When that time ends, the server removes the finished game from memory and unlocks the party (`party:info` with `locked` as `false`), and every client goes back to the party automatically when it receives it, so its owner can start another game. Any other `party:info` during the game or the result does not take a client out of them.

## Spectators

- **SPEC-1** An eliminated player becomes a spectator and sees the game without being able to act.
- **SPEC-2** A spectator sees what a player sees, except that they see no hand.
- **SPEC-3** A spectator can leave the game at any moment with `POST /party/{partyCode}/leave`, which also takes them out of the party, as an exception to `PARTY-6`. If they are the owner, `PARTY-7` applies at that moment. The interface offers it with a button (`UI-8`). After leaving they no longer have a game and stop receiving its events.
- **SPEC-4** **[Post-MVP]** Users from outside the game can watch it.

### Scenarios

**Brief disconnection**
- Given a player whose connection drops for a few seconds
- When the periodic task runs and they reconnect within the grace period
- Then they are not eliminated and they receive `GAME_SYNC`

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
- When the time of the result ends
- Then the players are in the same party, which is unlocked, and any user who was deleted during the game is no longer a member
