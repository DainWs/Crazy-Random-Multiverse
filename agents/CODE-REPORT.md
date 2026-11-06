# Code report

Summary of the code review of 2026-11-05, at commit `e783a9d`. The rule-by-rule detail is in `CODE-STATUS.md`.

**The game cannot be played from the interface today:** the board and the hand are mocked, and moves never reach the server.

All production code was read, but only the names of the tests, not their bodies. Both suites pass (451 backend tests and 350 frontend tests). The application and the integration tests were not run, so statements about how it behaves come from reading the code.

## What exists

- **Done:** connection and reconnection, session, game loading and resources, basic menu and party. On the server, also the actions and most of combat.
- **Not done on the client:** real game state, sending actions, turns, end of the game and spectators.
- **Wrong on the server:** turns, rounds and dealing do not follow the specifications. The leader goes to the hand instead of being placed, and only the player with the turn receives cards.

## Most serious defects

- **Players without a leader:** if the draw does not start at the first seat, the players seated before the starting player never receive a leader. They cannot place warriors and cannot die either.
- **Party locked forever:** nothing unlocks it when a game ends.
- **User cleanup:** deleting a disconnected user in a locked party throws an exception. That player is never eliminated, and that cleanup run stops there.
- **Event order not guaranteed:** each event is processed on its own thread, so events can arrive out of order and with a state later than their own.
- **More specific ones:**
  - Policía has 35 damage instead of 20.
  - Equipping does not use up the card.
  - Attacking an empty slot gives a 500 error.

## Corrections to the specification review

Reading the code contradicts three things changed during the Phase 3 review:

1. **`CON-12`:** it says events arrive in order on a socket, which those threads do not guarantee.
2. **`CON-32`:** it says `playerWithTurn` only changes with `TURN_CHANGE`, but in the code it changes before `ROUND_CHANGE`. The part saying attacks and cooldowns arrive already reset does hold.
3. **`hasLeaderInBoard`:** the Phase 3 task treats it as a protection defect, but it is unused frontend code. Protection on the server works. What is missing is rejecting the attack of a protected leader (`PROT-4`), which was already added to that task.

## Decisions taken after the review

Taken on 2026-11-06. The specifications and `ROADMAP.md` already include them.

- **Event order:** the threads stay. The client keeps a queue ordered by `sequence` and applies the events in that order, waiting for the missing ones (`CON-12`). The server maps the `game` of each event when it is published, so `CON-10` stays as it was.
- **Rules the code revealed as unspecified:** added to the specifications. Among them are the rejected start on a locked party, a missing action field answered with `request.malformed`, and the statistic types in `CardDto`. A start without leaders in the deck is rejected, a cancelled game is removed from memory, the owner controls are `UI-23`, and the socket port is a setting.
- **Defects not tracked:** every defect in `CODE-STATUS.md` now has a bullet in `ROADMAP.md`. `COMBAT-5` is **[Post-MVP]**, because no Legendary card is dealt. Unlocking the party after a game moves to Phase 3, and the server side of `LOAD-4` moves to Phase 7.
