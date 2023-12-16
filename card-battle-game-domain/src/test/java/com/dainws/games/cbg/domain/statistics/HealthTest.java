package com.dainws.games.cbg.domain.statistics;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.cbg.domain.card.statistics.Damage;
import com.dainws.games.cbg.domain.card.statistics.DamageType;
import com.dainws.games.cbg.domain.card.statistics.Health;

class HealthTest {

	@Test
	void testGivenFiniteHealth_whenIsInfinite_thenReturnFalse() {
		Health finite = Health.newInstance(10);
		
		boolean result = finite.isInfinite();
		
		assertFalse(result);
	}

	@Test
	void testGivenInfiniteHealth_whenIsInfinite_thenReturnTrue() {
		Health infinite = Health.INFINITE;
		
		boolean result = infinite.isInfinite();
		
		assertTrue(result);
	}
	
	@Test
	void testGiven100HealthAnd50Damage_whenGetRemainingArmorAgainst_thenReturn50() {
		Health health = Health.newInstance(100);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		Health resultHealth = health.getRemainingHealthAgainst(damage);

		double expectedValue = 50;
		assertEquals(expectedValue, resultHealth.getValue());
	}
	
	@Test
	void testGivenInfiniteHealthAnd50Damage_whenGetRemainingArmorAgainst_thenReturnInfinite() {
		Health health = Health.INFINITE;
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);
		
		Health resultHealth = health.getRemainingHealthAgainst(damage);
		
		assertEquals(Health.INFINITE, resultHealth);
	}
	
	@Test
	void testGivenInfiniteHealthAndInfiniteDamage_whenGetRemainingArmorAgainst_thenReturn0() {
		Health health = Health.INFINITE;
		Damage damage = Damage.INFINITE;
		
		Health resultHealth = health.getRemainingHealthAgainst(damage);
		
		double expectedValue = 0;
		assertEquals(expectedValue, resultHealth.getValue());
	}
	
	@Test
	void testGiven100HealthAnd50Damage_whenGetRemainingArmorAgainst_thenMaxHealthShouldNotChange() {
		double expectedMaxHealth = 100;
		Health health = Health.newInstance(100, expectedMaxHealth);
		Damage damage = Damage.newInstance(50, DamageType.PHYSICAL);

		Health resultHealth = health.getRemainingHealthAgainst(damage);

		assertEquals(expectedMaxHealth, resultHealth.getMaxValue());
	}
}
