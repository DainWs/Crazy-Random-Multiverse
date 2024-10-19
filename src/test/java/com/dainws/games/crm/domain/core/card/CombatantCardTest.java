package com.dainws.games.crm.domain.core.card;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.ArmorType;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.DamageType;
import com.dainws.games.crm.domain.core.card.statistics.Health;

abstract class CombatantCardTest extends CardTest {

	@Test
	final void testGivenCombatantCardWith0Health_whenIsAlive_thenReturnFalse() {
		Combatant combatantCard = this.createCombatantWithHealth(Health.newInstance(0));

		boolean result = combatantCard.isAlive();

		assertFalse(result);
	}

	@Test
	final void testGivenCombatantCardWith1OrMoreHealth_whenIsAlive_thenReturnTrue() {
		double health = (Math.random() * 100) + 1;
		Combatant combatantCard = this.createCombatantWithHealth(Health.newInstance(health));

		boolean result = combatantCard.isAlive();

		assertTrue(result);
	}

	@Test
	final void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardDamageIncrement() {
		Damage combatantCardDamage = Damage.newInstance(10, DamageType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithDamage(combatantCardDamage);
		Equipment equipment = this.getEquipmentWithBuffs();

		combatantCard.equip(equipment);

		boolean result = combatantCardDamage.getValue() < combatantCard.getDamage().getValue();
		assertTrue(result);
	}

	@Test
	final void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardArmorIncrement() {
		Armor combatantCardArmor = Armor.newInstance(10, ArmorType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithArmor(combatantCardArmor); 
		Equipment equipment = this.getEquipmentWithBuffs();

		combatantCard.equip(equipment);

		boolean result = combatantCardArmor.getValue() < combatantCard.getArmor().getValue();
		assertTrue(result);
	}

	@Test
	final void testGivenCombatantCardAndEquipmentWithBuffs_whenEquipEquipment_thenCombatantCardHealthIncrement() {
		Health combatantCardHealth = Health.newInstance(10);
		Combatant combatantCard = this.createCombatantWithHealth(combatantCardHealth);
		Equipment equipment = this.getEquipmentWithBuffs();

		combatantCard.equip(equipment);

		boolean result = combatantCardHealth.getValue() < combatantCard.getHealth().getValue();
		assertTrue(result);
	}

	@Test
	final void testGivenCombatantCardAndEquipmentWithDebuffs_whenEquipEquipment_thenCombatantCardDamageDecrease() {
		Damage combatantCardDamage = Damage.newInstance(10, DamageType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithDamage(combatantCardDamage);
		Equipment equipment = this.getEquipmentWithDebuffs();

		combatantCard.equip(equipment);

		boolean result = combatantCardDamage.getValue() > combatantCard.getDamage().getValue();
		assertTrue(result);
	}

	@Test
	final void testGivenCombatantCardAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardArmorIsReduced() {
		Armor combatantCardArmor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithArmor(combatantCardArmor);
		Combatant combatant = this.createCombatantCard();

		combatantCard.receiveDamageFrom(combatant);

		boolean isCombatantCardArmorReduced = combatantCard.getArmor().getValue() < combatantCardArmor.getValue();
		assertTrue(isCombatantCardArmorReduced);
	}

	@Test
	final void testGivenCombatantCardWithLowArmorAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardArmorIs0() {
		Armor combatantCardArmor = Armor.newInstance(10, ArmorType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithArmor(combatantCardArmor);
		Combatant combatant = this.createCombatantCard();

		combatantCard.receiveDamageFrom(combatant);

		assertEquals(0, combatantCard.getArmor().getValue());
	}

	@Test
	final void testGivenCombatantCardWithLowArmorAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardHealthHasNotChanged() {
		Armor combatantCardArmor = Armor.newInstance(10, ArmorType.PHYSICAL);
		Combatant combatantCard = this.createCombatantWithArmor(combatantCardArmor);
		double expectedCombatantCardHealth = combatantCard.getHealth().getValue();
		Combatant combatant = this.createCombatantCard();

		combatantCard.receiveDamageFrom(combatant);

		assertEquals(expectedCombatantCardHealth, combatantCard.getHealth().getValue());
	}

	@Test
	final void testGivenCombatantCardWithLowHealthAndCombatant_whenCombatantCardReceiveDamageFromCombatant_thenCombatantCardDead() {
		Health combatantCardHealth = Health.newInstance(10);
		Combatant combatantCard = this.createCombatantWithHealth(combatantCardHealth);
		Combatant combatant = this.createCombatantCard();

		combatantCard.receiveDamageFrom(combatant);

		assertFalse(combatantCard.isAlive());
	}

	abstract Combatant createCombatantCard();
	abstract Combatant createCombatantWithDamage(Damage damage);
	abstract Combatant createCombatantWithArmor(Armor armor);
	abstract Combatant createCombatantWithHealth(Health health);

	private Equipment getEquipmentWithBuffs() {
		return Equipment.builder()
				.withCode(1L)
				.withDamageBuff(10)
				.withArmorBuff(10)
				.withHealthBuff(10)
				.build();
	}
	
	private Equipment getEquipmentWithDebuffs() {
		return Equipment.builder()
				.withCode(1L)
				.withDamageDebuff(10)
				.withArmorDebuff(10)
				.withHealthDebuff(10)
				.build();
	}
}
