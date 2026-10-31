# Java Test Style Guide

Mandatory conventions for the tests in `backend/`. Complements `agents/CODESTYLE.md` (section 9) and `agents/BACKEND-CODESTYLE.md`.

The existing tests already mostly follow this guide. Where the existing code departs from it, it is noted; it is not rewritten on your own initiative.

---

## 1. Framework

- JUnit 5, with `@Test` on every case and `@BeforeEach` to initialize the common data and the object under test.
- Parameterized tests with `@ParameterizedTest` when the same behavior is tested with several inputs (section 6).
- Assertions from `org.junit.jupiter.api.Assertions`: `assertEquals`, `assertTrue`, `assertFalse`, `assertThrows`, etc. They are imported statically.
- AssertJ (`assertThat`) comes with `spring-boot-starter-test` and is used in a few places; it is tolerated where it already exists (for example for collections), but new code uses JUnit.
- Spring Test (`@SpringBootTest`) only in integration tests.
- No new test frameworks or libraries are added without asking first.

---

## 2. Names

- Pattern: `testGivenState_whenAction_thenExpectedResult()`.
  - *Given*: initial state or input.
  - *When*: method or operation under test.
  - *Then*: expected result.
- Vague names are forbidden: `testMethod()`, `testResult()`, `testSuccess()`.
- The `@BeforeEach` method is called `beforeEach()`.
- The test class is named after the class it tests plus `Test`, and lives in the same package.
- Integration test classes end **exactly** in `IntegrationTest`.

Examples:

- `testGivenContext_whenPerform_thenPutCardInCoordinate()`
- `testGivenPlayerWithoutTurn_whenPerform_thenActionIsNotPerformed()`
- `testGivenCommonWarrior_whenIsRarityUncommon_thenReturnFalse()`
- `testGivenFullBoard_whenPut_thenThrowGameException()`

---

## 3. Class structure

In this order:

1. Class declaration and its annotations.
2. Constants.
3. Fields with the common data and the object under test.
4. `@BeforeEach` method.
5. `@Test` and `@ParameterizedTest` methods.
6. Private helper methods and data sources for parameterized tests, at the end.

Only helper methods and constants may be `private`. The class, instance fields, `@BeforeEach`, the tests and the `static` `@MethodSource` sources have no access modifier (package visibility). Exception: methods that implement or override a test interface or base class (`ActionTest`, `PlayerTurnActionTest`) keep the visibility it imposes on them.

---

## 4. Setup

- Common data are fields without an access modifier and are initialized in `@BeforeEach`.
- Deterministic data. `LocalDate.now()`, `Instant.now()` and `Thread.sleep()` are forbidden. For dates, `LocalDate.of(year, month, day)`.
- **Randomness**: the existing builders use `Math.random()` for codes and values (`CardBuilder`, `PlayerBuilder`, `WarriorBuilder`). This is tolerated for data the test does not check (identifiers, names). **A value the test asserts is set explicitly**, never left to chance. A test cannot pass or fail depending on the draw.
- For dealing and the AI, the fixed test strategies are used (`MemoryDeckPopulator`, `DummyGameStrategy`, `AIvsAIGameStrategy`), not real randomness.
- If a test needs a different initial state, it creates or replaces it inside the test itself.
- No unnecessary or duplicated initializations.

---

## 5. Case design

The observable behavior of the class is tested. Where applicable:

- Default values after initialization.
- Values returned by getters.
- Edge cases: zero, one and several elements.
- Different valid inputs.
- State changes caused by public methods.
- Accumulation of values after several calls.
- Behavior on invalid input: out-of-turn action, occupied slot, protected target, etc.
- Published events and emitted game exceptions.

Each test covers a single behavior.

---

## 6. Parameterized tests

They replace loops and copied tests that only change the data.

- `@MethodSource` with a `static Stream<Arguments>` source named after the data it returns. The source goes at the end of the class.
- `@EnumSource` to iterate over the values of an enum.
- `@CsvSource` only when the data is small and simple.
- The last parameter is the expected result (`expected`).

```java
@ParameterizedTest
@MethodSource("damageAgainstArmor")
void testGivenDamageAndArmor_whenReceiveDamage_thenReturnExpectedHealth(
		double damage, double armor, double expected) {
	Warrior warrior = this.createWarrior(armor);

	warrior.receiveDamage(Damage.physical(damage));

	assertEquals(expected, warrior.getHealth().getValue());
}

static Stream<Arguments> damageAgainstArmor() {
	return Stream.of(
			Arguments.of(50, 0, 50),
			Arguments.of(50, 25, 75)
	);
}
```

*(The method names in the example are illustrative; use the real ones from the public API.)*

---

## 7. Arrange, Act, Assert

- *Arrange*: objects and their initial state are created.
- *Act*: the method under test is executed.
- *Assert*: the result is checked.

The three steps are separated by a blank line and go in that order. Each step is not commented: the name and structure of the test are enough.

```java
@Test
void testGivenContext_whenPerform_thenPutCardInCoordinate() throws GameException {
	PlayerTurnAction turnAction = this.createPlayerTurnAction();
	CustomActionContext actionContext = this.createActionContext();

	turnAction.perform(actionContext);

	Zone zone = actionContext.getTargetZone();
	assertTrue(zone.hasCombatant(actionContext.getTargetCoordinate()));
}
```

---

## 8. Test objects and data

- The objects each test needs are created inside the test itself, with a simple and explicit configuration.
- They are configured with the domain's public methods when they exist.
- Helper methods are used only if they really simplify data creation/readability.
- Constructors, setters or methods that do not exist in the code are not invented.

### Test builders

When a domain object needs a lot of setup and is repeated across several test classes, a builder is created in the test tree, in the same package as the class it builds. Existing builders are **extended** before creating others. A new builder follows the same pattern: chainable `with*` / `use*` methods and a `build()` that returns a valid object by default.

```java
Warrior warrior = Warrior.commonWarriorBuilder()
		.withCode(0L)
		.withNoneDamage()
		.withNoneArmor()
		.withHealth(1)
		.build();
```

### Contract files

If a DTO or event mapping is tested against a sample JSON, the file lives in `src/test/resources/contracts/`. If a value changes in every test, the file carries a marker (`{CODE}`) that the test replaces.

---

## 9. Fakes and mocks

General rules in `agents/CODESTYLE.md`, section 9.

### Fakes

- Own classes are always replaced by a hand-written fake.
- A fake carries no fixed prefix: its name says what it does, like any other class.
- The fake lives in the test tree, in the same package as the class it replaces, so other tests can reuse it.
- It is injected through the constructor or with the collaborator's public setter (see `agents/BACKEND-CODESTYLE.md`, section 3).
- Domain ports (`EventPublisher`, `ExceptionPublisher`, etc.) are replaced by their fake or by the in-memory implementation.

### Mockito

- It is **not used today** in the project and new code does not need it for own classes either.
- It is only allowed for classes from external libraries that cannot easily be instantiated or faked, and `@MockBean` in integration. Ask for confirmation before using it for the first time.
- `verify()` is forbidden in new code: the test checks the result, not the calls.

---

## 10. Assertions

- **Exactly one assertion per test.** If a scenario has several independent results, it is split into several tests, each with its own *Given-When-Then* name.
- Grouping assertions with `assertAll()` or any other mechanism is forbidden.
- `assertEquals(expected, actual)`, with the expected value explicit.
- For game exceptions, `assertThrows(PlayerActionException.class, () -> ...)`, with the concrete class and, if the code matters, checking the `ExceptionCode` in another test.
- An `assertTrue(action.perform(context))` counts as one assertion.
- The public contract is tested, not internal details.
- After an operation that modifies the object, the resulting state is checked.
- No assertions that verify nothing, nor the same behavior repeated for no reason.

---

## 11. Helper methods

- At the end of the class, with descriptive, simple names focused on one thing (`createPlayerTurnAction()`, `createActionContext()`).
- They do not hide the main behavior of the test behind abstractions.

---

## 12. Style

- Standard Java naming conventions.
- Indentation with tabs.
- A line has at most 78 characters, without counting the indentation tabs. The line that declares a test method is exempt, because its name is long on purpose. A longer statement is split by declaring a variable for each step instead of nesting calls in the arguments of another call (for example, the event and the receiver before calling `mapToDto`). Wrapping a list of plain variables across lines is accepted; wrapping nested calls is not.
- `this.field` and `this.method()` to access instance members.
- Short methods and descriptive variable names.
- No unnecessary abstractions, inheritance (except section 3) or test infrastructure.
- No comments explaining obvious operations.

---

## 13. Business rules

- Scenarios come from the real implementation and its public API, and from `docs/Requirements.md`.
- Game rules that make sense are tested, not merely that a method runs.
- For aggregation methods, cases with several operations are included.
- No game rule that the code or the requirements do not back is assumed. If information is missing to write the test, ask.

---

## 14. Integration tests

- They use local doubles, never real services (see `CLAUDE.md`).
- Named `*IntegrationTest`; they do not run with `mvn test`. They are launched with `mvn verify -P integration-tests`.
- Configuration in `src/test/resources/application-test.properties`. The test configuration (`JPATestConfiguration`, `AIvsAIModeTestConfiguration`) is imported with `@Import`.
- Data is loaded with the populators (`PartyPopulator`, `UserPopulator`).
- The test game modes (`AIvsAI`) and the event monitors (`GameEventWatcher`, `GameEventDebuger`) stand in for real clients.
- AI simulations carry a time limit (`assertTimeoutPreemptively`) so a stuck game fails instead of hanging the run.
- A simulated game is non-deterministic by design (AI with randomness): the test checks invariants (the game ends, there is a winner, no unexpected exception), not a specific outcome.
- Test methods may declare `throws Exception` when the scenario requires it.

### Endpoint tests

There are no controller tests today. When they are added, they use `@SpringBootTest` with `@AutoConfigureMockMvc` and `@WithMockUser` (the backend uses Spring Security). The route goes in an `API_ENDPOINT` constant, the endpoint call is extracted into a private helper method returning `ResultActions`, and each `andExpect(...)` counts as one assertion.

---

## 15. Things in the existing code to fix when touched

They are not fixed on your own initiative; they are listed so they are not copied.

- `AIvsAIGameIntegationTest` has the typo `Integation`: it **does not match** `*IntegrationTest`, so surefire **does not exclude it** and it runs in `mvn test`. Rename it in a separate commit.
- `GameBehaviorIntegrationTest` and the `*BehaviorIntegrationTest` classes inherit from abstract bases; they are kept.
- `AIvsAIGameIntegationTest` and `GameBehaviorIntegrationTest` may depend on chance: that pattern is not copied into unit tests.
