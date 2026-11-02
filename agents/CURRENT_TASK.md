# CURRENT TASK

Backend consistency cleanup. Not a roadmap phase: the items are tracked here and, when done, recorded in `ROADMAP.md` "Pending tasks" where they apply.

## Working agreement

- Stop before every commit and let the user review. The user confirms when to commit and continue.
- One commit per numbered item below. Refactors (renames, logs, member order) never share a commit with functional changes.
- Commit messages: English, imperative, lowercase, no prefix, at most 80 characters, no co-authorship trailer (`CLAUDE.md`).
- Maven needs JDK 17 and the default `JAVA_HOME` is broken: run `JAVA_HOME="C:\Program Files\Java\jdk-17.0.2" mvn -o -q test`.
- Baseline of `mvn test`: 7 failures that already existed (`AIActionTest` and `BehaviorTest`, "Not yet implemented"). `AIvsAIGameIntegationTest` is flaky (see Pending tasks).

## Decisions taken

| Topic | Decision |
|---|---|
| Spells missing from `ActionType` | Intentional, Post-MVP (`SPECS.md` section 3, `ROADMAP.md` Post-MVP). Nothing to do |
| `Deck.class` in `@ConditionalOnMissingBean` of `cardRepository()` | Keep it. It was added in `c889eb1` so the in-memory repository backs off when the application provides its own `Deck`, avoiding two `Deck` beans in `GameModeConfiguration` |
| DTO packages | `controller/dto/domain` -> `dto/response`, `controller/dto/models` -> `dto/request` |
| JPA naming | `JPAConfiguration` -> `PersistenceConfiguration`; `JPAActionContextFactory` -> `PersistenceActionContextFactory` (stays in the root of `persistence`); `configuration/jpa` -> `configuration/persistence`; property `crm.jpa.type` -> `crm.persistence.type` |
| Loggers | Follow `BACKEND-CODESTYLE.md` section 4: instance logger with `getClass()` in classes with few instances, `static final LOGGER` in classes created per turn. Remove `getCanonicalName()`. `PlayerTurnAction` uses `Action.class`, `PvsAIExceptionPublisher` uses `PvsAIExceptionPublisher.class` |
| Member order | Section 2 of `BACKEND-CODESTYLE.md`, only in classes touched by the other items |

## Plan and status

Bugs

1. [x] Rename `crm.jpa.type` to `crm.persistence.type` (commit `e3ede44`, together with the multiple decks note in the roadmap).
   - Not done: the property is still not read anywhere. The `@ConditionalOnProperty`, its constants and `JPAConfigurationTest` were dropped on purpose by the user before the commit.
   - Left over: an unused `ConditionalOnProperty` import in `JPAConfiguration.java`.
2. [x] `MemoryUserRepository.delete` idempotent (single `remove`); `ActionDto.type` is `@NotNull` and `PlayerController` validates it with `@Valid` (HTTP 400); `PlayerUsecase.performAction` throws `IllegalArgumentException` when a type has no handler.
3. [x] Repositories: `find` with a single `get` and `NotFoundException` on `null` (Game, Party, User), instead of `exists`/`has` followed by `get`.
   - `exists`/`has` stay in the interfaces: `GameService.findGameInProgressOf` still uses `exists`.
4. [x] `MemoryCardRepositoryPopulator` stops catching `Exception`; a failure aborts startup. Done, waiting for the user's review before the commit.

Guides

5. [x] `AccessDeniedException extends UsecaseException` (with `serialVersionUID` and `ExceptionCode`) replaces `IllegalAccessException` in `PlayerUsecase`, `PlayerController` and `WebPlayerController`. Tick the matching bullet in `ROADMAP.md` Pending tasks. Done, waiting for the user's review before the commit.
6. [x] Inject a `RandomGenerator` in `Turn` and `RandomDealStrategyFactory` instead of `Math.random()`, seeded in tests. Done (commit `03db089`).
   - `Turn(Collection)` removed; `ClassicModeStrategy.createTurn` draws the starting player with an injectable `RandomGenerator`, and `Game.reset()` delegates to `strategy.createTurn`.
   - Next: item 7.
7. [x] Move `new Party` and `setMaxUsers` out of `WebUserController` and `WebPartyOwnerController` into the services; deduplicate the `UserDto` construction. Done.
   - `UserService.createParty(owner, CreatePartyRequest)` builds the `Party` and `PartyService.createParty(Party)` validates and saves it; `PartyOwnerService.updateParty(owner, UpdatePartyRequest)`; `ModelMapper.toUserDto`.
   - Request DTOs moved to `usecase.dto`; `kick` now takes both codes in the path (`/party/{partyCode}/kick/{userCode}`) and the frontend follows.
   - `GameCode`, `PartyCode` and `UserCode` decode with `java.util.Base64`, which is stricter than Tomcat's (rejects `+`, `/` and invalid characters).
   - Next: item 8.
8. [x] `LoadController` interface carrying the HTTP mapping of `WebLoadController`. Done, waiting for the user's review before the commit. Next: item 9.

Style (refactor commits)

9. [x] Logs of the `Memory*Repository` and the `*CommunicationClient` in English, moved from `info` to `trace` or `debug`. Done, waiting for the user's review before the commit. Next: item 10.
10. [x] Rename `newIntance` -> `newInstance` and `mithicWarriorBuilder` -> `mythicWarriorBuilder`, tests included. Done, waiting for the user's review before the commit. Next: item 11.
11. [x] `NotFoundException` factories for party, user and game_mode; remove the commented `withName`/`withDescription` in `MemoryCardRepositoryPopulator`; `Long`/`0l` -> `long` in `Spell`. Done, waiting for the user's review before the commit. Next: item 12.
12. [ ] Rename the DTO packages (see decisions).
13. [x] Rename the JPA classes and package (see decisions), `JPATestConfiguration` -> `PersistenceTestConfiguration` and the unused import left by item 1 removed. Done, waiting for the user's review before the commit. Next: item 2.
14. [ ] Unify the loggers (see decisions). `PlayerTurnAction` becomes a static logger and stops using `LOGGER_NAME`; check nothing depends on that logger name (for example logging configuration).
15. [ ] Member order in the touched classes.

## Notes for whoever continues

- Item 6 changes domain constructors (`Turn` has three, `RandomDealStrategyFactory` has four `Math.random()` calls) and may touch several tests.
- Items 2 and 4 change visible behavior: startup now fails if the populator fails.
- `crm.persistence.type` renamed means any local `application.local.properties` with `crm.jpa.type` must be updated by hand.
- Out of scope unless asked: the remaining findings of the review (the `clone()` of `User`, the `@Autowired` setters and the `Zone` array clones are accepted by the guides).
