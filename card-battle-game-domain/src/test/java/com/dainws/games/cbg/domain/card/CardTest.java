package com.dainws.games.cbg.domain.card;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class CardTest {

	@Test
	void testGivenTwoCardWithSameCodeAndDifferentType_whenEquals_thenReturnFalse() {
		long code = 1;
		Card cardOne = this.createWarriorCardTypeWithCode(code);
		Card cardTwo = this.createEquipmentCardTypeWithCode(code);
		
		boolean result = cardOne.equals(cardTwo);
		
		assertFalse(result);
	}
	
	@Test
	void testGivenTwoCardWithSameTypeAndDifferentCode_whenEquals_thenReturnFalse() {
		long codeOne = 1;
		long codeTwo = 2;
		Card cardOne = this.createWarriorCardTypeWithCode(codeOne);
		Card cardTwo = this.createWarriorCardTypeWithCode(codeTwo);

		boolean result = cardOne.equals(cardTwo);
		
		assertFalse(result);
	}
	
	@Test
	void testGivenTwoCardWithSameCodeAndType_whenEquals_thenReturnTrue() {
		long code = 1;
		Card cardOne = this.createWarriorCardTypeWithCode(code);
		Card cardTwo = this.createWarriorCardTypeWithCode(code);

		boolean result = cardOne.equals(cardTwo);
		
		assertTrue(result);
	}

	private Card createWarriorCardTypeWithCode(long code) {
		return Warrior.commonWarriorBuilder()
				.withCode(code)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(1)
				.build();
	}

	private Card createEquipmentCardTypeWithCode(long code) {
		return Equipment.builder()
				.withCode(code)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();
	}
}
