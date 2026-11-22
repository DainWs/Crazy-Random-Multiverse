---
name: backend-conventions
description: Mandatory conventions for writing, changing or reviewing the code and the tests of CRM Game in backend/ (Java 17, Spring Boot 3, Socket.IO) — architecture and packages, class structure, injection, logging, errors, persistence, controllers and events, DTOs, formatting, comments and the style of the tests. Load it before touching any file of backend/. The absolute rules are in docs/constitution.md, which wins over this skill.
---

# backend-conventions

How the code of `backend/` is written. These conventions are mandatory, not suggestions. They sit under `docs/constitution.md`: read it first, because its rules win over anything here. For code that does not follow these conventions, its golden rule applies (`docs/constitution.md`, section 1).

- The tests follow besides `.claude/skills/backend-conventions/backend-tests.md`: read it when the task writes or changes a test.
- The general conventions are the same in `backend-conventions` and `frontend-conventions`: a change to them goes to both skills in the same commit.
- A section that moved to the constitution keeps its number and points to it, so the old citations by section still lead somewhere.

The root package is `com.dainws.games.crm`. The state of games, users and parties lives **in memory** (`crm.persistence.type = MEMORY`); there is no database and there are no JPA entities as of today.

---

## General conventions

### Language

- **Code, names, logs and comments in English.**
- Existing exception messages in Spanish are tolerated; new ones are written in English.
- Documentation in `docs/` is written in English. Existing `TODO`s in Spanish are tolerated.
- Text the player sees does not live in the code: it is identified by key (`exception.*`, card `name` and `description`) and translated on the client (`frontend/src/core/Texts.ts`, `UI-2`). The name of a user is data, not an interface text: it is shown as it is, also the default name the server assigns (`USER-2`).

### Names

- Follow the Java community naming conventions for Java code, and the TypeScript ones for TypeScript code.
- Forbidden as a full name: `data`, `info`, `manager`, `helper`, `utils`, `handler`, `process`, `tmp`, `obj`.
- Boolean variables are affirmative: `isEnabled`, never `isNotDisabled`.
- No abbreviations except the universal ones: `id`, `dto`, `ui`, `io`, `url`, `json`.
- The name says **what**, the code says **how**. If a comment is needed to explain what a function does, the name is bad.
- Names follow the game's domain vocabulary (see `docs/specs/`): `Party`, `Game`, `Player`, `Zone`, `Board`, `Leader`, `Warrior`, `Spell`, `Equipment`, `Hand`, `Deck`, `Turn`. The same concept has the same name in backend and frontend.
- Entity codes are value objects with the `Code` suffix in the backend (`GameCode`, `PartyCode`, `PlayerCode`, `UserCode`, `CardCode`) and type aliases in the frontend.

### Functions and modules

- A function does one thing. If its name needs an `and`, they are two functions.
- Target: fewer than 30 lines. It is a signal, not a hard limit; exceeding it must be justified.
- Maximum 2 levels of nesting per method or function, and a conditional is never nested in another conditional (`if () { if () { } }`). The two levels are only a loop with a conditional (or another loop) inside, or the other way around: `if () { for }`, `for { if }`. Deeper code is split into methods.
- Avoid whenever possible the early `return;` (a `return` with no value that cuts a method short), `break` and `continue`: they break the flow. Structure the code with a condition or a local variable instead. The exception is a guard: a `return;` at the start of a method or function that discards a case.
- `switch` is banned (`docs/constitution.md`, section 12): a `Map` of handlers is used instead.
- Maximum 3 positional parameters. Beyond that, they are grouped into a value object. (For backend constructors the maximum is also 3: `.claude/skills/backend-conventions/SKILL.md`, section 9.)
- Boolean parameters are forbidden in public signatures: turn it into two functions or an enum. A boolean at the call site forces you to open the definition to know what it means.
- Modules by responsibility, not by type.
- No `import *` or `import package.*`. Explicit imports.

#### Intermediate variables for transformations

> Good code is not code with fewer lines. It is code that another developer can understand quickly.

The result of a transformation (a Stream API pipeline, an array method chain, a calculation) is not written inside the arguments of another call. It is first assigned to a local variable named after the purpose of the resulting data, and that variable is passed.

**Preferred:**

```java
List<CardDto> equipmentDtos = combatant.getEquipment().stream() //
		.map(ModelMapper::mapCardToDto) //
		.toList();

cardDto.setEquipment(equipmentDtos);
```

**Avoid:**

```java
cardDto.setEquipment(
		combatant.getEquipment().stream() //
				.map(ModelMapper::mapCardToDto) //
				.toList()
);
```

Readability, maintainability and ease of debugging come before minimizing the number of lines.

### Logging

- Logging through SLF4J in the backend, structured. Direct console output is banned (`docs/constitution.md`, section 12); the only exception is the communication trace of the frontend `api/` (`.claude/skills/frontend-conventions/SKILL.md`, section 7).
- Log entries for a game include its `GameCode`; those for a player, their `PlayerCode`.
- What is never logged: `docs/constitution.md`, section 8.
- Messages describe facts, not moods.

### Comments

- Minimal comments: only the *why* when it is not obvious. Never comments that repeat what the code says.
- `TODO`s carry enough context to act on; no `TODO` is added without an owner or a reason.

### Commits

The format of the commits is in `CLAUDE.md`. Refactoring is not mixed with functional changes in the same commit, and the message explains the why when it is not obvious; the what is already in the diff.

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

`controller/events` is both input (connections, `GameEventController`) and output (`CommunicationClient` pushes events to the client). The domain emits events through `EventPublisher` (a port in `domain.core`); `SpringEventPublisher` adapts them to Spring events and `SpringGameEventDispatcher` distributes them to the clients.

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
- `@Value` goes on a field. It may go on a setter only when that is justified, and never on a parameter: it adds too much noise to the signature. In a `@Configuration` the field has no access modifier (package-private) so that tests can set it; elsewhere it is private. The expression is always written inline, `@Value("${crm.some.property}")`, never held in a constant. Classes that read a property keep a plain setter for tests.

```java
@Service
public class UserService {
	private final UserRepository userRepository;
	private final PartyService partyService;
	private GameService gameService;

	@Value("${crm.user.disconnect-grace-period}")
	private Duration disconnectGracePeriod;

	public UserService(UserRepository userRepository, PartyService partyService) {
		this.userRepository = userRepository;
		this.partyService = partyService;
	}

	@Autowired
	public void setGameService(GameService gameService) {
		this.gameService = gameService;
	}

	public void setDisconnectGracePeriod(Duration disconnectGracePeriod) {
		this.disconnectGracePeriod = disconnectGracePeriod;
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
- With SLF4J, always use `{}` placeholders, never concatenating.
- When logging an exception, it is passed as the last argument so the stack trace is printed.
- Log entries for a game include the `GameCode`; those for a player, the `PlayerCode`.
- What is never logged: `docs/constitution.md`, section 8.

**When to use**
- `error`: When logging an critical/bug exception.
- `warn`: When logging an non-bug exception.
- `info`: for state transitions (game started/finished).
- `debug`: for adapter detail.
- `trace`: for the internal game flow (the level of `com.dainws.games.crm` is `TRACE` in development).

---

## 5. Composition over inheritance

The rule is in `docs/constitution.md`, section 4.

```java
// BAD — inheritance as a reuse mechanism
abstract class BaseGameModeFactory {
	void registerPublishers() {}
}

// GOOD — composed collaborator
class ClassicGameModeFactory implements GameModeFactory {
	private final Deck deck;
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

The rule is in `docs/constitution.md`, section 5.

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
- `application.properties` keys read from code are declared in a field or in a `@ConfigurationProperties` class (see `additional-spring-configuration-metadata.json`).

---

## 7. Value objects and factories

### Value objects

- Identifiers and value objects are `record`s or classes, depending on the validation they need:
  - **Record with a compact constructor**: the validation is simple, deterministic and free of side effects (`Objects.requireNonNull`, numeric ranges, non-blank text). The public canonical constructor is not a risk because the validation lives inside it: an invalid instance cannot be created, not even with `new`.
  - **Class with a private constructor and a static factory**: the creation parses or converts data that can fail (Base64, `Long.valueOf`), depends on something external, or the API returns an alternative such as an `Optional`. A record is not used here, since its canonical constructor of a public record cannot be private.
- A record may also declare a static `from(...)` to convert a primitive or external value; it does not replace the validation in the compact constructor.
- The primitive value is exposed with an accessor that says what it is: `number()` for numeric ones and `text()` for text ones, whether the value object is a record or a class (`GameCode.text()`). It is the only exception to the `getX()` accessors of the other classes and enums. `PlayerCode.getCode()`, `EffectId.getNumber()`, `CardCode.code()` and `type()`, `ExceptionCode.value()` and the bare `text()` of the `Code` enums of `PlayerActionExceptionCode` and `ZoneExceptionCode` do not follow it yet.

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

The rules are in `docs/constitution.md`, section 7. How they apply in the backend:

- For new code: **exceptions are exceptional**. An action rejected by the game rules is expected behavior, not a failure, and is not modeled with an exception.
- **Domain models** (`Zone`, `Player`, `Game`, `Card`…) expose queries (`zone.isFree(coordinate)`, `player.hasTurn()`) and protect their own invariants by throwing when they are misused (`IllegalStateException`, `IllegalArgumentException`, or a game exception from `domain.core.exception`). They do not return results.
- **Domain services, actions and modes** (`Action`, game modes) check the rules through those queries *before* acting and return a result carrying the `ExceptionCode` when the action is rejected. They never catch a model's exception to turn it into a result. The client receives the code in the HTTP response to its request (`docs/specs/contract.md`, `CON-18`).
- Application exceptions extend `UsecaseException` and carry an `ExceptionCode`.
- Denied accesses (a game or player that does not belong to the session) throw `AccessDeniedException`, which extends `UsecaseException`. They are a tampered request or a client bug, not a game move, so an exception is appropriate. `IllegalAccessException`, a checked reflection exception, is not used for them.

### `catch` rules

- An error ignored on purpose is logged at `debug`, with a comment explaining why.
- Catch the specific first; `catch (Exception e)` only as a last net in the input adapters (events, sockets), logging with the stack trace.
- Custom game exceptions carry `serialVersionUID` and a constructor that accepts the `ExceptionCode`.
- `RestExceptionAdvice` turns the application exceptions (`UsecaseException`, `GameRuntimeException`, `NotAllowedException`) and the unreadable requests into the 400 of `CON-18`. A rejected action is not an exception: the controller reads its `ActionResult`.
- A code that cannot be parsed from a request (Base64, UUID, card code) throws an `InvalidCodeException`, translated from the library's exception where the code is parsed.

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
- Today only the in-memory implementation exists (`persistence/memory`). It is selected through `crm.persistence.type` in `PersistenceConfiguration`. It must be safe under concurrency (`docs/constitution.md`, section 9).
- If real persistence (JPA) is ever added, it follows the rules of this section: `*Entity` entities in `persistence`, conversion through `toDomain()` / `createEntity()`, services returning domain objects, parameterized queries, and transactions opened in the use case. Adding that dependency requires asking first (see `CLAUDE.md`).
- Services return domain objects, never DTOs.
- Card data is loaded with the populators in `configuration/persistence`. Test data is built with the builders and fakes of the test tree (`.claude/skills/backend-conventions/backend-tests.md`, sections 8 and 14).

---

## 11. Controllers and events

### HTTP

- The `*Controller` interface carries the HTTP mapping (`@PostMapping`, `@PathVariable`, `@RequestBody`, `consumes`, `produces`). The `Web*Controller` implementation carries `@RestController`.
- Codes that travel in the URL are encoded in Base64 URL-safe (`GameCode.fromBase64UrlSafe`). That is the contract with the frontend (`toBase64UrlSafe`).
- The implementation converts identifiers to the domain on entry and delegates. It decides nothing.
- Routes in lowercase separated by hyphens, grouped by resource (`/game/{gameCode}/action`, `/party/{partyCode}/leave`).
- Identity comes from the session (`userSession`, `docs/constitution.md`, section 3). A `clone()` of the user is always passed to the use case (`WebPlayerController`). The clone is only saved to create the user (`register`): the stored user is the one the sockets are bound to, so a change to an existing user is made on the stored one, never by saving the clone over it (`WebUserController.setAccount` breaks this, `docs/roadmap/roadmap.md`, Phase 12).

### Events

- The domain publishes an `Event` with an `EventCode` and `EventDetails`. `SpringEventPublisher` → `SpringGameEventDispatcher` → the mode's `GameModeEventDispatcher` → `CommunicationClient`.
- Socket.IO is the only transport. `CommunicationClient` is a concrete class; tests replace it with a subclass (`RecordingCommunicationClient`).
- Every event is sent to the clients before the game reacts to it (`EventListenerOrder`), so the events the game publishes in response reach them after their cause.
- A new event requires: `EventCode`, DTO/mapping in `CommunicationMapper`, and an entry in the frontend (`GameEventCode.ts`, `EventDto.ts`).

---

## 12. Formatting

- Indentation with **tabs**.
- A line has at most 130 characters, without counting the indentation tabs, as in the tests (`.claude/skills/backend-conventions/backend-tests.md`) and the frontend.
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

In `.claude/skills/backend-conventions/backend-tests.md`. The absolute rules of the tests are in `docs/constitution.md`, sections 10 and 11.

---

## 15. Comments

- In English, same as `TODO`s: `// TODO migrate to a game exception`.
- Javadoc only on the public API of a module or class, one line. It is not added to methods that are explained by their name and signature.

---

## 16. Concurrency

Moved to `docs/constitution.md`, section 9.

---

## 17. Time and randomness

Moved to `docs/constitution.md`, section 10.

---

## 18. Null, `Optional` and `@Override`

- `Optional` is only a return type: never a field, a parameter or a collection element. A method never returns `null` where an `Optional` or an empty collection fits.
- `@Override` is always written.

---

## 19. Control flow

- The ternary operator is not used to pick a value or a behavior from the state of an object (`game.inStatus(LOADING) ? A : B`). This is object-oriented Java, not JavaScript: the choice goes in a `Map` indexed by the state (`EnumMap`) or in the object itself through polymorphism.
- `sealed` types are not used: without `switch` they bring little here.
- For simple things, structured programming (`if`, `for`, local variables) is preferred over method chaining (`Optional` chains, streams). Chains are kept for pipelines that really transform a collection (filter, map, collect); a lookup with a `null` check is written as `get` + `if (x == null) throw`, not as `Optional.ofNullable(...).map(...).orElseThrow(...)`.
