package com.dainws.games.cbg.domain.card;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EquipmentBuilderTest {

	Equipment.Builder builder;

	@BeforeEach
	void beforeEach() {
		this.builder = Equipment.builder()
				.withCode(1L)
				.withName("test-equipment")
				.withDescription("test-equipment_description");
	}

	@Test
	void testGivenNoneCode_whenBuild_thenThrowNullPointerException() {
		this.builder.withCode(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNoneName_whenBuild_thenThrowNullPointerException() {
		this.builder.withName(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNoneDescription_whenBuild_thenThrowNullPointerException() {
		this.builder.withDescription(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNegativeDamage_whenWithDamageBuff_thenThrowIllegalArgumentException() {
		double damageAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withDamageBuff(damageAmount));
	}

	@Test
	void testGivenNegativeDamage_whenWithDamageDebuff_thenThrowIllegalArgumentException() {
		double damageAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withDamageDebuff(damageAmount));
	}

	@Test
	void testGivenNegativeArmor_whenWithArmorBuff_thenThrowIllegalArgumentException() {
		double armorAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withArmorBuff(armorAmount));
	}

	@Test
	void testGivenNegativeArmor_whenWithArmorDebuff_thenThrowIllegalArgumentException() {
		double armorAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withArmorDebuff(armorAmount));
	}

	@Test
	void testGivenNegativeHealth_whenWithHealthBuff_thenThrowIllegalArgumentException() {
		double healthAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withHealthBuff(healthAmount));
	}

	@Test
	void testGivenNegativeHealth_whenWithHealthDebuff_thenThrowIllegalArgumentException() {
		double healthAmount = -10;

		assertThrows(IllegalArgumentException.class, () -> this.builder.withHealthDebuff(healthAmount));
	}

	@Test
	void testGivenBuilderWithAllRequiredFields_whenBuild_thenDoNotThrowException() {
		assertDoesNotThrow(() -> this.builder.build());
	}
}
