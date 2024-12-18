package com.dainws.games.crm.domain.core.card;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class WarriorBuilderTest {

	Warrior.Builder builder;

	@BeforeEach
	void beforeEach() {
		this.builder = Warrior.commonWarriorBuilder()
				.withCode(1L)
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(100);
	}

	@Test
	void testGivenNoneCode_whenBuild_thenThrowNullPointerException() {
		this.builder = Warrior.commonWarriorBuilder()
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(100);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNullDamage_whenBuild_thenThrowNullPointerException() {
		this.builder.withDamage(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNullArmor_whenBuild_thenThrowNullPointerException() {
		this.builder.withDamage(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNullHealth_whenBuild_thenThrowNullPointerException() {
		this.builder.withDamage(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenBuilderWithAllRequiredFields_whenBuild_thenDoNotThrowException() {
		assertDoesNotThrow(() -> this.builder.build());
	}
}
