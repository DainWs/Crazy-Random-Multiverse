package com.dainws.games.crm.domain.models.statistics;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.DamageType;

class DamageTest {

	@Test
	void testGivenFiniteDamage_whenIsInfinite_thenReturnFalse() {
		Damage finiteDamage = Damage.newInstance(10, DamageType.PHYSICAL);
		
		boolean result = finiteDamage.isInfinite();
		
		assertFalse(result);
	}

	@Test
	void testGivenInfiniteDamage_whenIsInfinite_thenReturnTrue() {
		Damage infiniteDamage = Damage.INFINITE;
		
		boolean result = infiniteDamage.isInfinite();
		
		assertTrue(result);
	}

	@Test
	void testGivenNoPhysicalDamage_whenIsTypePhysical_thenReturnFalse() {
		Damage damage = Damage.newInstance(10, DamageType.MAGIC);
		
		boolean result = damage.isType(DamageType.PHYSICAL);
		
		assertFalse(result);
	}
	
	@Test
	void testGivenPhysicalDamage_whenIsTypePhysical_thenReturnTrue() {
		Damage damage = Damage.newInstance(10, DamageType.PHYSICAL);
		
		boolean result = damage.isType(DamageType.PHYSICAL);
		
		assertTrue(result);
	}
}
