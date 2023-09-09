package com.dainws.games.cbg.domain.card;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class CombatantCardTest {

	@Test
	void testGivenCombatantCardWith0Health_whenIsAlive_thenReturnFalse() {
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(0)
				.build();

		boolean result = combatantCard.isAlive();

		assertFalse(result);
	}

	@Test
	void testGivenCombatantCardWith1OrMoreHealth_whenIsAlive_thenReturnTrue() {
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(1)
				.build();

		boolean result = combatantCard.isAlive();

		assertTrue(result);
	}

	@Test
	void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardDamageIncrement() {
		double combatantCardDamage = 10;
		Equipment equipment = getEquipmentWithBuffs();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withPhysicalDamage(combatantCardDamage)
				.withNoneArmor()
				.withHealth(1)
				.build();

		combatantCard.equip(equipment);

		boolean result = combatantCardDamage < combatantCard.getDamage().getValue();
		assertTrue(result);
	}

	@Test
	void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardArmorIncrement() {
		double combatantCardArmor = 10;
		Equipment equipment = getEquipmentWithBuffs();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withPhysicalArmor(combatantCardArmor)
				.withHealth(1)
				.build();

		combatantCard.equip(equipment);

		boolean result = combatantCardArmor < combatantCard.getArmor().getValue();
		assertTrue(result);
	}

	@Test
	void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardHealthIncrement() {
		double combatantCardHealth = 10;
		Equipment equipment = getEquipmentWithBuffs();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(combatantCardHealth)
				.build();

		combatantCard.equip(equipment);

		boolean result = combatantCardHealth < combatantCard.getHealth().getValue();
		assertTrue(result);
	}

	@Test
	void testGivenCombatantCardAndEquipmentWithDebuffs_whenEquipEquipment_thenCombatantCardDamageDecrease() {
		double combatantCardDamage = 10;
		Equipment equipment = Equipment.builder()
				.withCode(1L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.withDamageDebuff(10)
				.build();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withPhysicalDamage(combatantCardDamage)
				.withNoneArmor()
				.withHealth(1)
				.build();

		combatantCard.equip(equipment);

		boolean result = combatantCardDamage > combatantCard.getDamage().getValue();
		assertTrue(result);
	}

	private Equipment getEquipmentWithBuffs() {
		return Equipment.builder()
				.withCode(1L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.withDamageBuff(10)
				.withArmorBuff(10)
				.withHealthBuff(10)
				.build();
	}

	@Test
	void testGivenCombatantCardAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardArmorIsReduced() {
		double combatantCardArmor = 100;
		Combatant combatant = getCombatantCard();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withPhysicalArmor(combatantCardArmor)
				.withHealth(100)
				.build();

		combatantCard.receiveDamageFrom(combatant);

		boolean isCombatantCardArmorReduced = combatantCard.getArmor().getValue() < combatantCardArmor;
		assertTrue(isCombatantCardArmorReduced);
	}

	@Test
	void testGivenCombatantCardWithLowArmorAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardArmorIs0() {
		double combatantCardArmor = 10;
		Combatant combatant = getCombatantCard();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withPhysicalArmor(combatantCardArmor)
				.withHealth(100)
				.build();

		combatantCard.receiveDamageFrom(combatant);

		assertEquals(0, combatantCard.getArmor().getValue());
	}

	@Test
	void testGivenCombatantCardWithLowArmorAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardHealthHasNotChanged() {
		double combatantCardArmor = 10;
		double expectedCombatantCardHealth = 100;
		Combatant combatant = getCombatantCard();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withPhysicalArmor(combatantCardArmor)
				.withHealth(expectedCombatantCardHealth)
				.build();

		combatantCard.receiveDamageFrom(combatant);

		assertEquals(expectedCombatantCardHealth, combatantCard.getHealth().getValue());
	}

	@Test
	void testGivenCombatantCardWithLowHealthAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardDead() {
		double expectedCombatantCardHealth = 30;
		Combatant combatant = getCombatantCard();
		Combatant combatantCard = Warrior.rareWarriorBuilder()
				.withCode(0L)
				.withName("test-combatantCard")
				.withDescription("test-combatantCard_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(expectedCombatantCardHealth)
				.build();

		combatantCard.receiveDamageFrom(combatant);

		assertFalse(combatantCard.isAlive());
	}

	private Combatant getCombatantCard() {
		return Warrior.rareWarriorBuilder()
				.withCode(1L)
				.withName("test-combatant")
				.withDescription("test-combatant_description")
				.withPhysicalDamage(50)
				.withNoneArmor()
				.withHealth(100)
				.build();
	}
}
