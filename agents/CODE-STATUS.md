# Code status

What the code does today against `SPECS.md`, `specs/` and `VIEW-SPECS.md`, rule by rule. It is a snapshot: the code and `ROADMAP.md` prevail once they move on.

- **Snapshot:** 2026-11-05, commit `e783a9d`.
- **Method:** all production code was read (`backend/src/main`, `frontend/src`, Vite configuration). Tests were checked by name and executed, but their bodies were not read line by line.
- **Executed:** `mvn -o clean test` (451 passed) and `npm run test:run` (350 passed). The `*IntegrationTest` tests and the application itself were not run, so every statement about runtime behavior comes from reading the code.
- **After the snapshot:** some rules quoted here changed on 2026-11-06, such as `CON-12` and the error table. The decisions are listed in `CODE-REPORT.md`.

Status values: **Done**, **Partial** (works with a stated gap), **Missing** (no behavior exists), **Wrong** (behavior exists and contradicts the rule).

## Summary

| Area | Backend | Frontend |
|---|---|---|
| Connection, session, reconnection | Done | Done, without its interface |
| Users and parties | Partial | Create, join, leave and start only |
| Game loading and resources | Done, except cancelling | Done |
| Game flow (setup, turns, rounds, deal) | Wrong | Not connected |
| Actions (place, move, attack, equip, surrender, pass) | Exposed, with rule gaps | Never sent to the server |
| Combat | Mostly done | Missing |
| End of the game | Partial | Local and mocked |
| Game state on the client | Not applicable | Entirely mocked |

**The game cannot be played from the interface today.** After `GAME_START` the client shows a mocked board and hand, `GameLoad.createGameState` builds them, and no game event other than `GAME_LOADING`, `GAME_SYNC`, `GAME_START` and `GAME_CANCELLED` has any effect. Dragging a card only changes the local view.

## Defects found

These are not rule gaps but behavior that breaks. Not all of them are tracked in `ROADMAP.md`.

| Where | Defect | Consequence |
|---|---|---|
| `ClassicModeStrategy`, `TurnManager`, `Dealer` | Round 0 deals a leader to the player with the turn, and the round changes when the turn wraps to seat 0 | Players seated before a random starting player never get a leader. They cannot place warriors, because row 1 needs row 0 filled, and their zone can never die. Only a start at seat 0 works |
| `UserService.delete`, `PartyService.leaveParty` | Deleting a user in a locked party throws `exception.party.locked`, and nothing catches it | `ABSENT-3` never happens, and the cleanup stops at that user on every run, so the users after them in that run are not processed either |
| `MemoryCardRepository.cloneWarrior` | The clone copies a damage that already includes the equipment, and then equips it again | Policía has 35 damage instead of 20 (`CARD-5`) |
| `EquipAction` | The equipment is not removed from the hand | The same card can be equipped without limit (`HAND-2`) |
| `AttackAction`, `EquipAction`, `PlayerTurnAction` | An empty source or target slot, a missing field, or a user outside the game causes a null pointer | A 500 instead of the 400 of `CON-18` |
| `MemoryCardRepository.draw*` | An empty category fails on `cards.get(0)` | An exception in the deal (`DECK-3`) |
| `GeneralConfiguration` | The event multicaster has a thread pool, so each listener runs on its own thread | `EventListenerOrder` only orders the submission. The order of `CON-22` is not guaranteed, events can reach a socket out of order, and the `game` of an event is mapped when it is sent, from the live game, not as it was right after the event (`CON-10`) |
| `WebUserController.setAccount` | It saves a clone of the session user over the stored one | The stored user loses their sockets and stops receiving events. Latent: the interface does not call `PUT /user` yet |
| `ModelMapper.toPartyDto` | `gameMode` is never set | `PartyDto.gameMode` never reaches the client |
| `ModelMapper.mapCardToDto` | Equipment is sent without `damageType` or `armorType` | `toDamage` and `toArmor` in the client drop those values |
| `CombatantRender` | It reads `card.equipment?.health.value` although a statistic with value 0 is not sent | Rendering a real equipped card such as Policía throws |
| `HandView.clearCards` | It removes from the array it is iterating | About half of the cards stay in the hand. It matters once a `GAME_SYNC` rebuilds the hand |
| `ZoneSlot.hasAlreadyEquipment` | It compares with `null`, and the field is `undefined` | It always says true |
| `Zone.isLineFull` (frontend) | The condition is inverted | Latent: `isEnabledPosition` has no callers |
| `TurnManager.getPrevTurn` | It wraps to `countPlayers()` instead of the last index | Out of bounds. Latent: nothing calls `onPrevTurn` |

## Contract

| Rule | Status | Notes |
|---|---|---|
| `CON-1`, `CON-2`, `CON-4`, `CON-5`, `CON-25` | Done | The port (9092) is hardcoded in `SocketIOConfiguration`. Vite proxies the socket in development |
| `CON-3` | Partial | Works for users outside a locked party, see the deletion defect |
| `CON-6`, `CON-7`, `CON-8`, `CON-26` | Done | |
| `CON-9` | Done | `MemoryEventSequence` is never cleaned up |
| `CON-10` | Partial | The `game` comes from the live game when sending, see the multicaster defect |
| `CON-11` | Partial | The server sends it. The client only reads the game code and the leaders, and ignores `hand` |
| `CON-12` | Missing | The client ignores `sequence`. The rule says events arrive in order on a socket, which the multicaster does not guarantee |
| `CON-13` | Partial | The server filter is done (`GameEventController`), including `targetPlayer` for the rest. The client does nothing with the event |
| `CON-14` | Partial | The server is done. On the client, `toZone` keeps the order but has no callers, row 0 would be drawn at the top, and the mock uses another organization, with the leader at index 2 |
| `CON-15` | Done | |
| `CON-16` | Partial | Endpoint and identity check are done. `GameApi.sendAction` and `sendPassTurnAction` only log, and `toActionDto` has no callers. Membership in the game is not checked |
| `CON-17` | Partial | The server publishes the events. The client does not apply them |
| `CON-18` | Partial | `RestExceptionAdvice` is done, and the client reads the key. See the null pointers. `POST /ready` does not check that the user is a player |
| `CON-19` | Missing | No pending action exists on the client |
| `CON-20` | Done | |
| `CON-21` | Partial | The server is done. The client has the type but does not use it |
| `CON-22` | Wrong | `GAME_START` publishes no `ROUND_CHANGE` or `TURN_CHANGE`. The deal follows `TURN_CHANGE` and only reaches the player with the turn. Surrender publishes no `PLAYER_DIE`. See the multicaster defect |
| `CON-23`, `CON-24`, `CON-27` | Done | `CON-27` except for the Policía defect |
| `CON-28` to `CON-31` | Done | Every `fixed` file exists under `static/resources`. No card image or audio exists, so all cards show `card.unknown` |
| `CON-32` | Partial | Attacks and cooldowns are reset before `TURN_CHANGE`, when the player passes. But `TurnManager` sets the new turn before `ROUND_CHANGE`, not with `TURN_CHANGE` |
| `GameDto.round` | Wrong | The first round is 0 and is not sent. The contract starts at 1 |
| `GameDto.playerWithTurn` | Partial | Sent from `GAME_START`, before the first `TURN_CHANGE`. Absent once ended, as it should be |
| `GameDto.zones` | Wrong | In turn order, but `ModelMapper` drops the eliminated players (`ELIM-5`). A test asserts it |

### Error keys

| Status | Keys |
|---|---|
| Exist | `access_denied.*`, every `not_found`, `party.user_is_not_party_owner`, `party.user_already_in_party`, `party.locked`, `party.is_full`, `request.malformed`, every `player-action.*` of the contract not listed below, `zone.*` |
| Exist but barely used | `game.not_in_progress`: only `PassTurnAction` returns it |
| Missing | `party.cannot_kick_owner`, `party.max_users_out_of_range`, `party.not_enough_players`, `user.invalid_username`, `user.in_game`, `player-action.selected_source_leader_is_protected`, `player-action.selected_target_is_own`, `player-action.selected_target_position_has_none_combatant`, `player-action.equip_target_not_owned` |
| Not in the contract | `player-action.card_cant_be_used` (spells) |

The "new" and "renamed" marks of the error table in `specs/CONTRACT.md` are out of date for the keys that do exist.

## Game flow

| Rule | Status | Notes |
|---|---|---|
| `SETUP-1` | Partial | Nothing enforces the range on the server |
| `SETUP-2` | Wrong | Leaders are dealt to the hand, one per turn, with `PLAYER_RECEIVE_CARD`, and the player places them |
| `SETUP-3` | Partial | Only the starting player is drawn. The order follows the party's `HashMap` |
| `TURN-1` | Partial | The order is fixed and eliminated players are skipped, but it is not drawn |
| `TURN-2`, `TURN-3`, `TURN-5` | Done | On the server |
| `TURN-4` | Done | There is no time limit |
| `TURN-6` | Partial | See the null pointers |
| `TURN-7` | Missing | `PlayerTurnAction` does not check the status, so actions are accepted while loading |
| `ROUND-1`, `ROUND-2` | Wrong | A round starts when the turn wraps to seat 0, not at the starting player's seat |
| `ROUND-3` | Wrong | Cards go only to the player whose turn starts, on every turn |
| `ROUND-4` | Partial | The categories of rounds 1 to 6 are in `ClassicDealStrategyFactory`, in the backend. Spell slots deal spells, not equipment, and round 0 deals leaders |
| `DECK-1`, `DECK-2`, `DECK-5` | Done | |
| `DECK-3` | Missing | See the defect |
| `DECK-4` | Partial | The populator has two leaders, and nothing validates it |
| `HAND-1` | Done | On the server. `HandView` sizes its bounds for 10 cards |
| `HAND-2` | Partial | `PutAction` confirms before removing. See the `EquipAction` defect. The client removes optimistically (`CardController`) |
| `HAND-3` | Partial | `handSize` and the filter exist on the server. No rival hand is shown |
| `HAND-4` | Missing | The client identifies cards with `Card.uuid` |

## Board

| Rule | Status | Notes |
|---|---|---|
| `BOARD-1` to `BOARD-4` | Done | `ZoneWithLeader`: one leader slot and two rows of 3 |
| `BOARD-5`, `BOARD-6`, `BOARD-7` | Done | On the server. A leader is not rejected in a warrior slot, which stops mattering with `SETUP-2`. The local `CardController` does not swap |
| `BOARD-8` | Missing | `canAttack` only counts the attacks |
| `BOARD-9` | Done | |
| `PROT-1`, `PROT-2`, `PROT-3` | Done | `Zone.isProtectedAt`, `AttackAction` |
| `PROT-4` | Partial | `attackAvailable` excludes a protected leader, but `AttackAction` accepts the attack |
| `PROT-5` | Done | Nothing forces an attack |
| `PROT-6` | Partial | The flags are sent and the attack is rejected. The client maps the flags and nothing reads them |

`hasLeaderInBoard`, named by the Phase 3 task, is in the frontend (`domain/Zone.ts`). It belongs to `isEnabledPosition`, which has no callers, and has nothing to do with the protection on the server, which works.

## Cards and equipment

| Rule | Status | Notes |
|---|---|---|
| `CARD-1`, `CARD-2`, `CARD-3` | Done | Infinite values exist in the domain, unused |
| `CARD-4` | Done | `ResourceKeys.ts` |
| `CARD-5` | Partial | Statistics match except for the Policía defect. No images, and no names or descriptions in the client |
| `CARD-6` | Partial | Works, with the same defect |
| `CARD-7` | Partial | The server sends the keys. The client shows them untranslated |
| `EQUIP-1` | Partial | Values add up. At 0 a statistic becomes `NONE`, which is physical, so it loses its type |
| `EQUIP-2` | Partial | No cooldown and no attack used, but see the hand defect |
| `EQUIP-3` | Missing | Neither ownership nor an empty slot is checked |
| `EQUIP-4` | Missing | One piece per card, and a new one replaces the old one. `CardDto.equipment` is a list of at most one |
| `EQUIP-5` | Wrong | Limits apply piece by piece. Health reaches 0, not 1 |
| `EQUIP-6` | Done | |
| `EQUIP-7` | Missing | **[Post-MVP]** |
| `EQUIP-8` | Done | The equipment goes with the removed combatant |

## Combat

| Rule | Status | Notes |
|---|---|---|
| `COMBAT-1` to `COMBAT-4`, `COMBAT-6` | Done | `Combatant.receiveDamageFrom` |
| `COMBAT-5` | Missing | Excess damage is always discarded |
| `COMBAT-7` | Partial | A dead warrior is removed. A dead leader stays in its slot, and `PLAYER_DIE` follows. No frontend |
| `COMBAT-11` | Done | The source zone is always the source player's |
| `COMBAT-12` | Done | An attack on one's own card or on an empty slot is rejected |

No test class exists for `EquipAction`, and no test name covers `COMBAT-5`.

## Game end

| Rule | Status | Notes |
|---|---|---|
| `ELIM-1`, `ELIM-2` | Done | On the server |
| `ELIM-3` | Partial | Surrender clears the board but not the hand. A leader's death clears nothing |
| `ELIM-4` | Partial | Done for surrender, and deletion never happens |
| `ELIM-5` | Wrong | The zone is dropped from `zones` |
| `ABSENT-1`, `ABSENT-2` | Done | |
| `ABSENT-3` | Wrong | See the deletion defect |
| `WIN-1`, `WIN-3` | Done | `GAME_END`, then `GAME_END_WITH_WINNER`. `WIN-3` only on the server |
| `WIN-2` | Done | `GAME_END_WITH_TIE` exists unused |
| `WIN-4` | Missing | `GameScene.update` detects the end locally, from mocked zones |
| `WIN-5` | Missing | No timer and no `crm.game.result-duration`. Nothing calls `PartyEventService.releaseGameParties`, so a party stays locked for good after its first game and the game is never deleted |
| `SPEC-1` | Partial | `Player.die` makes a spectator and the flags follow. No interface |
| `SPEC-2` | Partial | An eliminated player keeps their hand on the server, and `GAME_SYNC` sends it |
| `SPEC-3` | Missing | `leaveParty` is rejected with `party.locked` |

## Lobby

| Rule | Status | Notes |
|---|---|---|
| `USER-1`, `USER-2`, `USER-5`, `USER-6` | Done | |
| `USER-3` | Partial | `PUT /user` works, with the clone defect, and does not reject during a game. No interface |
| `USER-4` | Missing | No validation |
| `USER-7` | Partial | The 24 hours are done. See `ABSENT-3` |
| `USER-8` | Partial | Only detected at startup, through `findAccount` |
| `PARTY-1`, `PARTY-8`, `PARTY-12` | Done | |
| `PARTY-2` | Partial | The menu and the request default to 4, the domain to 5. No range or member check |
| `PARTY-3` | Partial | Stored and updatable, not returned. No selector |
| `PARTY-4` | Partial | The list also includes parties in a game. `getPartyList` has no interface |
| `PARTY-5` | Partial | Done by code. Not from a list |
| `PARTY-6` | Partial | Rejected during a game. The owner can kick themselves. Kicking has no interface |
| `PARTY-7` | Wrong | The next owner is the first of a `HashMap`, not the oldest member |
| `PARTY-9` | Partial | Only the interface checks the minimum. The server also starts a second game on a locked party |
| `PARTY-10` | Partial | Sent on join, leave, kick and update. Not on rename, or when a game locks the party |
| `PARTY-11` | Wrong | The name is `"Party of " + owner`, hardcoded in `ModelMapper`, and uses the name stored in the party, which goes stale |
| `LOAD-1` | Partial | The party locks, with no `party:info` |
| `LOAD-2`, `LOAD-6`, `LOAD-7` | Done | Leader images are never tried yet, because the leaders are not placed until `SETUP-2` |
| `LOAD-3` | Partial | No time limit, as specified. Deletion never unblocks it |
| `LOAD-4` | Missing | Nothing publishes `GAME_CANCELLED`. The client goes back to the party, without explaining why |
| `LOAD-5` | Done | On the client |

## Interface

| Rule | Status | Notes |
|---|---|---|
| `UI-1` | Partial | Menu, party and loading exist. No party list, game or result on real data |
| `UI-2` | Partial | `core/Texts.ts` holds the menu and loading texts. The game scenes have hardcoded texts |
| `UI-17`, `UI-12`, `UI-16`, `UI-18`, `UI-19`, `UI-20`, `UI-21`, `UI-22` | Done | |
| `UI-3`, `UI-4`, `UI-5`, `UI-6`, `UI-7`, `UI-8`, `UI-15` | Missing | |
| `UI-9`, `UI-10`, `UI-11` | Missing | `SocketService` tracks the status, and no screen shows it. The screen goes blank during a reconnection |
| `UI-13`, `UI-14` | Missing | `updateAccount` and `getPartyList` have no interface |

| Rule | Status | Notes |
|---|---|---|
| `VIEW-1` | Partial | The orientation works with the mock, with the leader at row index 2. Real rows need inverting |
| `VIEW-2` | Partial | `ZoneLayout` and the camera handle several players. Untested with real data |
| `VIEW-3`, `VIEW-5`, `VIEW-6`, `VIEW-7`, `VIEW-11`, `VIEW-12` | Missing | |
| `VIEW-4` | Done | Slots highlight while dragging. Attack targeting by click draws an arrow, green over a valid target and red elsewhere. `CardActionPerspective` and `CalmTargetingOverlay` are no longer used, kept for the rarity effects of Post-MVP |
| `VIEW-8` | Partial | `HandAnimator` animates cards entering the hand. No rival animation |
| `VIEW-13` | Done | `ZoneViewFactory` |

## Exists but is not used

Scaffolding with no caller in production. Whether it stays is for Phase 9 or **[Post-MVP]**.

- **Backend, spells and effects:** `UseCardAction`, `UseSpellAction`, `PlayerActionFacade.playerUseSpell` (passes a null action), `Effect*`, `Skill`.
- **Backend, others:** `CompositeGameFlow`, `RandomDealStrategyFactory` (replaced by the classic one), `PartyEventService`, `GameService.getActiveGame`, `Zone.getVisibleCombatants`, `onPrevTurn`.
- **Frontend, actions:** `toActionDto`.
- **Frontend, mappers:** `toZone`, `toZonePosition`.
- **Frontend, others:** `saveHand`, `loadHand`, `GameOverOverlay`, `ImageUtils.loadTemplateImage`, `playSoundForAction`, the `MainMenu` scene, `Zone.isEnabledPosition`, the extra socket channels (`event`, `game_event`, one per event code).
- **Frontend, debugging left in place:** `createDebugUI` in `GameScene`, the red polygon in `ZoneSlotView`, `showDebugBoxes` always on in development.

## Tests

Both suites pass, which says little about the game flow, because some tests assert behavior the specification rejects. They will have to change with it:

- `ModelMapperTest.testGivenDeadPlayer_whenMapGame_thenGameHasNoZoneOfThatPlayer` (`ELIM-5`).
- `TurnManagerTest.testGivenTurnOfTheLastSeat_whenNextTurn_thenRoundChangesBeforeTheTurn` (`ROUND-2`).
- `LocalStorageApi.test.ts`, for `saveHand` and `loadHand`.

`UserServiceTest` covers deleting a user in a party, but no test name covers one in a locked party, which is where the defect is.
