# Backend Code Style Guide

Mandatory conventions for `backend/`. Complements `agents/CODESTYLE.md`; the sections of that document still apply.

The root package is `com.dainws.games.crm`. The state of games, users and parties lives **in memory** (`crm.persistence.type = MEMORY`); there is no database and there are no JPA entities as of today.

---

## 1. Architecture

```text
Input adapters             controller.*Controller · controller.Web*Controller · controller.events.*
        │                  parse the request or the event, decide nothing
        ▼
Use cases and services     usecase.*Usecase · services.*Service
        │                  orchestrate; call the domain and ports
        ▼
Output adapters            persistence.memory.* · controller.events.*CommunicationClient

Domain                     domain.*                         used by every ring; uses none
```

`controller/events` is both input (connections, `GameEventController`) and output (`CommunicationClient` pushes events to the client). The domain emits events through `EventPublisher` / `ExceptionPublisher` (ports in `domain.core`); `SpringEventPublisher` adapts them to Spring events and `SpringGameEventDispatcher` distributes them to the clients.

### Main packages

| Package | Purpose |
|---|---|
| `configuration` | Spring `@Configuration`: security, session, sockets, game modes, repositories. `configuration/persistence` contains the card populators. No business logic. |
| `controller` | HTTP input. Each controller is an `XController` interface carrying the Spring annotations and one or more implementations. |
| `controller/events` | Socket.IO connections, publishing and dispatching of game events. |
| `usecase` | Use cases (`PlayerUsecase`). `usecase/dto` contains the action input DTOs (`ActionDto`, `ActionMapper`). |
| `services` | Application services that coordinate the domain and repositories. |
| `domain` | Model and rules: `core` (game, board, cards, actions, turns, events, exceptions), `mode` (game modes), `repositories` (ports). Imports nothing from outside `domain`. |
| `persistence` | Implementations of the `domain/repositories` ports: `persistence/memory`. |

### Where each new thing goes

- **New player action**: class in `domain/core/action` following `Action` / `ActionContextTemplate`; registered in `ActionType` and `PlayerUsecase`; DTO and `ActionMapper` if the contract changes.
- **New game mode**: subpackage in `domain/mode/<mode>` with its `GameModeFactory`, `GameFlow`, `GameModeStrategy` and `GameModeEventDispatcher`, registered in `GameModeConfiguration`. Follow `classic`.
- **New card or effect type**: in `domain/core/card` / `domain/core/effect`.
- **New endpoint**: interface + `Web` implementation in `controller`, with a use case or service behind it.

The `*Controller` interfaces are the exception to "single implementation → concrete class": they separate the Spring annotations from the implementation.

---

## 2. Class structure

In this order:

1. `static final` constants and private enums.
2. Logger.
3. Collaborators (services, repositories, factories).
4. The object's own state.
5. Constructors.
6. Public methods. The private ones used by a public method go right below it, not grouped at the end.
7. Collaborator setters.
8. `compareTo`, `equals`, `hashCode` and `toString`.
9. `static` factory methods (`from`, `create`…), at the end of the class.

Nested classes are not used: a class, record, enum or interface that another class needs goes in its own file. This also applies to tests. Existing nested types (such as the builders) are not refactored.

---

## 3. Dependencies and fields

### Injection

- Main dependencies arrive through the constructor, up to 3 parameters (section 9). Those that do not fit or are optional are injected with a public setter annotated with `@Autowired` (`WebPlayerController.setUserSession`).
- Collaborators that tests may replace are exposed with a public setter (`GameService.setGameFactory`).
- `@Autowired` is not tolerated unless it is on a setter or in a `@Configuration`.

```java
@RestController
public class WebPlayerController implements PlayerController {

	private User userSession;

	private PlayerUsecase playerUsecase;

	public WebPlayerController(PlayerUsecase playerUsecase) {
		this.playerUsecase = playerUsecase;
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
```

### `final`

`final` is decided by the purpose of the field, not by whether a setter exists today. It is used when the field conceptually never changes during the object's life: its identity (codes), `serialVersionUID`, constants, and collaborators injected through the constructor that nobody replaces. It is not used on fields that represent data that may change (`name`, `description`, `status`), even if no setter exists yet. Collaborators with a setter for tests are not `final`.

### `this`

`this.` is used to access own fields and methods, also inside private methods.

---

## 4. Logging

### Declaration

- **Classes with few instances** (services, use cases, clients, controllers): instance logger, initialized in the constructor.

  ```java
  private final Logger logger;

  public GameService(GameFactory gameFactory) {
  	this.gameFactory = gameFactory;

  	this.logger = LoggerFactory.getLogger(getClass());
  }
  ```

- **Classes instantiated often** (cards, actions, players, domain objects created per turn): static logger, to avoid creating one logger per instance.

  ```java
  private static final Logger LOGGER = LoggerFactory.getLogger(Card.class);
  ```

### Messages

- In English.
- With SLF4J `{}` placeholders, never concatenating: `this.logger.trace("Creating game for party {}", party.getCode())`.
- When logging an exception, it is passed as the last argument so the stack trace is printed, and it must be a `warn` or `error`; in those cases, `{}` is not used to parameterize the message.
- `trace` for the internal game flow (the level of `com.dainws.games.crm` is `TRACE` in development), `debug` for adapter detail, `info` for state transitions (game started/finished), `warn` and `error` as appropriate.
- Log entries for a game include the `GameCode`; those for a player, the `PlayerCode`.
- A player's hand contents are not logged at any level above `trace`.

---

## 5. Composition over inheritance

General rules in `agents/CODESTYLE.md`, section 3.

```java
// BAD — inheritance as a reuse mechanism
abstract class BaseGameModeFactory {
	void registerPublishers() {}
}

// GOOD — composed collaborator
class ClassicGameModeFactory implements GameModeFactory {
	private Deck deck;
	private EventPublisher eventPublisher;

	ClassicGameModeFactory(Deck deck) {
		this.deck = deck;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
```

---

## 6. No magic values

General rules in `agents/CODESTYLE.md`, section 5.

```java
// BAD
if (card.getType().name().equals("LEADER")) {
	// ...
}

this.actionResolver.put("PUT_ACTION", this::putAction);

// GOOD
if (card.getType() == CardType.LEADER) {
	// ...
}

this.actionResolver.put(ActionType.PUT_ACTION, this::putAction);
```

- Closed sets are enums. Maps indexed by enum use `EnumMap`.
- Exception codes are declared in the `*ExceptionCode` classes (`PlayerActionExceptionCode`, `EffectExceptionCode`) and wrapped in `ExceptionCode`.
- Game settings (default mode, maximum players, zone sizes) live in configuration or in the game mode, not inside the turn logic.
- `application.properties` keys read from code are declared in a constant or in a `@ConfigurationProperties` class (see `additional-spring-configuration-metadata.json`).

---

## 7. Value objects and factories

### Value objects

- Identifiers and value objects are `record`s or classes, depending on the validation they need:
  - **Record with a compact constructor**: the validation is simple, deterministic and free of side effects (`Objects.requireNonNull`, numeric ranges, non-blank text). The public canonical constructor is not a risk because the validation lives inside it: an invalid instance cannot be created, not even with `new`.
  - **Class with a private constructor and a static factory**: the creation parses or converts data that can fail (Base64, `Long.valueOf`), depends on something external, or the API returns an alternative such as an `Optional`. A record is not used here, since its canonical constructor of a public record cannot be private.
- A record may also declare a static `from(...)` to convert a primitive or external value; it does not replace the validation in the compact constructor.
- The primitive value is exposed with an accessor that says what it is: `number()` for numeric ones and `text()` for text ones.

### Static factories

Used when the creation requires parsing or conversions that can fail, such as `Long.valueOf()`.

| Name | Use |
|---|---|
| `from(...)` | Converts a primitive or external value into the type. |

If a class has a factory, its constructor is private and the validation lives in the factory.

### Validation

- Programming errors (null or out-of-range argument): `Objects.requireNonNull` or `IllegalArgumentException`.
- Game rules: a result carrying an `ExceptionCode`, not an exception (section 8).
- HTTP input: the `jakarta.validation` annotations should be on the DTO (`@NotNull`, `@NotBlank`).

---

## 8. Errors

General rules in `agents/CODESTYLE.md`, section 7.

- For new code: **exceptions are exceptional**. An action rejected by the game rules is expected behavior, not a failure, and is not modeled with an exception.
- **Domain models** (`Zone`, `Player`, `Game`, `Card`…) expose queries (`zone.isFree(coordinate)`, `player.hasTurn()`) and protect their own invariants by throwing when they are misused (`IllegalStateException`, `IllegalArgumentException`, or a game exception from `domain.core.exception`). They do not return results.
- **Domain services, actions and modes** (`Action`, game modes) check the rules through those queries *before* acting and return a result carrying the `ExceptionCode` when the action is rejected. They never catch a model's exception to turn it into a result. The client receives the code in the HTTP response to its request (`specs/CONTRACT.md`, `CON-18`).
- Application exceptions extend `UsecaseException` and carry an `ExceptionCode`.
- Denied accesses (a game or player that does not belong to the session) throw `AccessDeniedException`, which extends `UsecaseException`. They are a tampered request or a client bug, not a game move, so an exception is appropriate. Existing uses of `IllegalAccessException` (a checked reflection exception) are not copied.
- When performing an action, everything that can reject it is validated before any state changes; an action never mutates the game and then undoes the change.

### `catch` rules

- Never an empty `catch`, nor one that swallows the error without logging it. If it is ignored on purpose, log it at `debug` with a comment explaining why.
- Catch the specific first; `catch (Exception e)` only as a last net in the input adapters (events, sockets), logging with the stack trace.
- Custom game exceptions carry `serialVersionUID` and a constructor that accepts the `ExceptionCode`.
- A `@ControllerAdvice` is the end user's safety net, not the normal error-handling mechanism.

---

## 9. Constructors and APIs

- Constructors do no work that can fail for external reasons or with side effects: they assign and, at most, validate their arguments (`NullPointerException`, `IllegalArgumentException`; section 7). No I/O, no parsing and no static calls that may throw inside a constructor. That work is done in the method that uses it or in the class's static factories.
- A constructor takes at most 3 parameters. Beyond that, only with explicit justification; the usual approach is to use setters or a value object.
- Empty public constructors are not declared if they are not needed.
- If the native Java API does the same as a Spring utility, the native one is used. Example: `URI.resolve` instead of `UriComponentsBuilder`.
- Collections exposed from the domain are returned immutable or as a copy.

---

## 10. Persistence

- Every repository implementation lives in `persistence` and fulfills an interface from `domain/repositories`.
- Today only the in-memory implementation exists (`persistence/memory`). It is selected through `crm.persistence.type` in `PersistenceConfiguration`. **In-memory repositories must be safe under concurrency** (several players act at the same time): concurrent collections, without exposing the internal ones.
- If real persistence (JPA) is ever added, it follows the rules of this section: `*Entity` entities in `persistence`, conversion through `toDomain()` / `createEntity()`, services returning domain objects, parameterized queries, and transactions opened in the use case. Adding that dependency requires asking first (see `CLAUDE.md`).
- Services return domain objects, never DTOs.
- Card data is loaded with the populators in `configuration/persistence`; test data, with the populators in `src/test`.

---

## 11. Controllers and events

### HTTP

- The `*Controller` interface carries the HTTP mapping (`@PostMapping`, `@PathVariable`, `@RequestBody`, `consumes`, `produces`). The `Web*Controller` implementation carries `@RestController`.
- Codes that travel in the URL are encoded in Base64 URL-safe (`GameCode.fromBase64UrlSafe`). That is the contract with the frontend (`toBase64UrlSafe`).
- The implementation converts identifiers to the domain on entry and delegates. It decides nothing.
- Routes in lowercase separated by hyphens, grouped by resource (`/game/{gameCode}/action`, `/party/{partyCode}/leave`).
- Identity comes from the session (`userSession`), never from the request. A `clone()` of the user is always passed to the use case (`WebPlayerController`).

### Events

- The domain publishes an `Event` with an `EventCode` and `EventDetails`. `SpringEventPublisher` → `SpringGameEventDispatcher` → the mode's `GameModeEventDispatcher` → `CommunicationClient`.
- Socket.IO is the only transport. `CommunicationClient` is a concrete class; tests replace it with a subclass (`RecordingCommunicationClient`).
- A new event requires: `EventCode`, DTO/mapping in `CommunicationMapper`, and an entry in the frontend (`GameEventCode.ts`, `EventDto.ts`).

---

## 12. Formatting

- Indentation with **tabs**.
- Never use `var` to declare a variable: always write the type.
- Imports in groups separated by a blank line: static (in tests), `java`, `javax`, `org`, `com`, and the rest (`jakarta`, `io`…). No wildcards. Static imports come first.
- In call chains (streams, builders), each call goes on its own line ending in `//`. The `//` prevents the Eclipse formatter from joining them again: it reads better vertically than horizontally.

```java
return Card.builder(code) //
		.warrior() //
			.damage(10) //
		.build();
```

---

## 13. DTOs and annotations

### DTOs

- Plain classes with private non-`final` fields, setters if they are used in responses and getters if they are used as requests.
- **`record`s are not used as DTOs.** A DTO with optional fields would need positional constructors (`new Dto(null, null, "data", null)`) or a builder, since Java has no named parameters, and a record exposes its components as public API, which makes the structure harder to evolve.
- Serialization annotations (`@JsonProperty`, `@JsonFormat`, etc.) go on the properties (fields), not on the getters.
- The name of a field is the same as the property of its getter and setter. A boolean is named without the `is` prefix (`alive`, not `isAlive`) and carries the contract name in `@JsonProperty("isAlive")`: a field `isAlive` next to a getter `isAlive()` is serialized twice, as `isAlive` and as `alive`.
- Validations (`@NotNull`, `@NotBlank`) go on the field, above `@JsonProperty`.
- DTOs contain no logic. The conversion lives in the `*Mapper`.
- A `long` is never sent in a DTO as a number: it travels as a `String` and the mapper converts it. The JavaScript `number` is a 64-bit float that only holds integers exactly up to 2^53 - 1, so a `long` can arrive corrupted at the client.
- Enums that travel in a DTO (`CardType`, `ActionType`…) are part of the contract: they are not renamed without updating the frontend.
- Enums travel as text in uppercase (the constant name). `@JsonProperty` is not put on enum constants to rename them; the frontend declares the same text in its literal union.

### Annotations

- As many annotations as needed can be chained, one after another.
- There is always a blank line before the first annotation, unless it is the first thing after the opening brace.

```java
// GOOD
public class PartyDto {
	@JsonProperty("code")
	private String partyCode;

	@NotBlank
	@JsonProperty("name")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String name;
}
```

---

## 14. Tests

Full guide in `agents/BACKEND-TESTS.md`. Summary:

- JUnit 5 + Spring Test. Tests live in `src/test/java`, in the same package as the class under test.
- Test name: `testGiven<State>_when<Action>_then<Result>`. Arrange / Act / Assert structure separated by a blank line.
- Test objects are created with the builders in `src/test/.../domain/builder` (`CardBuilder`, `GameBuilder`, `PlayerBuilder`, `WarriorBuilder`). They are extended before creating new ones.
- Existing fakes and monitors: `DummyGameStrategy`, `DummyPlayer`, `DummyZone`, `EventMonitor`, `ExceptionMonitor`, `MonitoredAction`. Use them before resorting to Mockito.
- Integration tests: `IntegrationTest` suffix. They are excluded from `mvn test` (surefire) and run with `mvn verify -P integration-tests`.
- Tests do not open real ports nor depend on the clock or on uncontrolled randomness: randomness (dealing) is injected with a seed or a fixed strategy (`MemoryDeckPopulator`, `DummyGameStrategy`).
- A contract change (DTO, `EventCode`, `ActionType`) comes with a test that pins it down.

---

## 15. Comments

- In English, same as `TODO`s: `// TODO migrate to a game exception`.
- Javadoc only on the public API of a module or class, one line. It is not added to methods that are explained by their name and signature.
- `System.out.print()` is forbidden in production code.

---

## 16. Concurrency

Several players act on the same game at the same time.

- All the actions on a game are serialized: one writer at a time per game (a lock per `GameCode`). Every player goes through the same path.
- In-memory repositories use concurrent collections and atomic operations (`compute`, `computeIfAbsent`, `merge`), never `get` followed by `put`.
- Events and value objects are immutable once published.
- No shared mutable `static` state.
- Threads are created through a managed `ExecutorService`, never with `new Thread`. An `InterruptedException` is never swallowed: the interrupt flag is restored with `Thread.currentThread().interrupt()`.
- Concurrency has tests (see `agents/BACKEND-TESTS.md`, section 15).

---

## 17. Time and randomness

- The domain does not call `Instant.now()`, `LocalDate.now()`, `System.currentTimeMillis()` nor `Math.random()`.
- The clock is injected as a `Clock` and randomness as a `RandomGenerator` (seeded in tests).

---

## 18. Null, `Optional` and copies

- `Optional` is only a return type: never a field, a parameter or a collection element. A method never returns `null` where an `Optional` or an empty collection fits.
- `@Override` is always written.
- New code does not use `Cloneable` / `clone()`; it uses a copy constructor or a `copy()` method. The existing `clone()` of `User` is not refactored on your own initiative.

---

## 19. Control flow

- `switch` is not used, neither the statement nor the expression: it makes methods grow. A `Map` of handlers is used instead (`EnumMap` for enums). Besides, the project is on Java 17, where `switch` is still the traditional one: pattern matching for `switch` is only a preview feature until Java 21, so there is no exhaustiveness check over sealed types to compensate. Review this rule if the project moves to Java 21.
- `sealed` types are not used for the same reason: without pattern matching in `switch` they bring little here.
- For simple things, structured programming (`if`, `for`, local variables) is preferred over method chaining (`Optional` chains, streams). Chains are kept for pipelines that really transform a collection (filter, map, collect); a lookup with a `null` check is written as `get` + `if (x == null) throw`, not as `Optional.ofNullable(...).map(...).orElseThrow(...)`.
