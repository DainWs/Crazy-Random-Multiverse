package com.dainws.games.crm.domain.models.statistics;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.models.card.statistics.Armor;
import com.dainws.games.crm.domain.models.card.statistics.ArmorType;
import com.dainws.games.crm.domain.models.card.statistics.Damage;
import com.dainws.games.crm.domain.models.card.statistics.DamageType;

class ArmorTest {
	@Test
	void testGivenArmorAndDamageOfSameType_whenCanProtectAgainst_thenReturnTrue() {
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		boolean result = armor.canProtectAgainst(damage);

		assertTrue(result);
	}

	@Test
	void testGivenArmorAndDamageOfDifferentTypes_whenCanProtectAgainst_thenReturnFalse() {
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.newInstance(50, DamageType.MAGIC);

		boolean result = armor.canProtectAgainst(damage);

		assertFalse(result);
	}

	@Test
	void testGiven100ArmorAnd50DamageOfSameType_whenGetRemainingDamageAgainst_thenReturn0() {
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		Damage resultDamage = armor.getRemainingDamageAgainst(damage);

		double expectedValue = 0;
		assertEquals(expectedValue, resultDamage.getValue());
	}

	@Test
	void testGivenArmorAndDamageOfDifferentTypes_whenGetRemainingDamageAgainst_thenReturnDamageValue() {
		double expectedValue = 50;
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.newInstance(expectedValue, DamageType.MAGIC);

		Damage resultDamage = armor.getRemainingDamageAgainst(damage);

		assertEquals(expectedValue, resultDamage.getValue());
	}

	@Test
	void testGivenArmorAndInfiniteDamage_whenGetRemainingDamageAgainst_thenReturnInfinite() {
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.INFINITE;

		Damage resultDamage = armor.getRemainingDamageAgainst(damage);

		double expectedValue = damage.getValue();
		assertEquals(expectedValue, resultDamage.getValue());
	}

	@Test
	void testGiven100ArmorAnd50DamageOfSameType_whenGetRemainingArmorAgainst_thenReturn50() {
		Armor armor = Armor.newInstance(100, ArmorType.PHYSICAL);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		Armor resultArmor = armor.getRemainingArmorAgainst(damage);

		double expectedValue = 50;
		assertEquals(expectedValue, resultArmor.getValue());
	}

	@Test
	void testGivenArmorAndDamageOfDifferentTypes_whenGetRemainingArmorAgainst_thenReturnArmorValue() {
		double expectedValue = 100;
		Armor armor = Armor.newInstance(expectedValue, ArmorType.MAGIC);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		Armor resultArmor = armor.getRemainingArmorAgainst(damage);

		assertEquals(expectedValue, resultArmor.getValue());
	}
}
