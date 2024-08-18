package com.dainws.games.crm.domain.models.card;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;
import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.Health;

class WarriorTest extends CombatantCardTest {

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

	@Override
	Combatant createCombatantCard() {
		return new CardBuilder().useWarrior()
				.useRandomRarityWarrior()
				.withPhysicalDamage(50)
				.withNoneArmor()
				.withHealth(100)
				.build();
	}

	@Override
	Combatant createCombatantWithDamage(Damage damage) {
		return new CardBuilder().useWarrior()
				.useRandomRarityWarrior()
				.withDamage(damage)
				.withNoneArmor()
				.withHealth(100)
				.build();
	}

	@Override
	Combatant createCombatantWithArmor(Armor armor) {
		return new CardBuilder().useWarrior()
				.useRandomRarityWarrior()
				.withPhysicalDamage(50)
				.withArmor(armor)
				.withHealth(100)
				.build();
	}

	@Override
	Combatant createCombatantWithHealth(Health health) {
		return new CardBuilder().useWarrior()
				.useRandomRarityWarrior()
				.withPhysicalDamage(50)
				.withNoneArmor()
				.withHealth(health)
				.build();
	}

	@Override
	Card createCardWithCode(long code) {
		return new CardBuilder().useWarrior()
				.useRandomRarityWarrior()
				.withCode(code)
				.build();
	}
	
	@Override
	Card createDifferentCardTypeWithCode(long code) {
		return new CardBuilder().useEquipment()
				.withCode(code)
				.withName("test_equipment_"+code+"_name")
				.withDescription("test_equipment_"+code+"_description")
				.build();
	}
}
