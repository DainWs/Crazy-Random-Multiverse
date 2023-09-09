package com.dainws.games.cbg.domain.card;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class WarriorTest {

	@Test
	void testGivenCommonWarrior_whenIsRarityUncommon_thenReturnFalse() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(0L)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(1)
				.build();

		boolean result = warrior.isRarity(WarriorRarity.UNCOMMON);

		assertFalse(result);
	}

	@Test
	void testGivenCommonWarrior_whenIsRarityCommon_thenReturnTrue() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(0L)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(1)
				.build();

		boolean result = warrior.isRarity(WarriorRarity.COMMON);

		assertTrue(result);
	}
}
