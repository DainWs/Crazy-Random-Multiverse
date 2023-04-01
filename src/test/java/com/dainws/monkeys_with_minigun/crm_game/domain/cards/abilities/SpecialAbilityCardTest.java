package com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities;

import org.junit.jupiter.api.Test;

public interface SpecialAbilityCardTest {
	@Test
	void testGivenSpecialAbilityCardWithSpecialAbility_whenCallHasSpecialAbility_thenReturnTrue();

	@Test
	void testGivenSpecialAbilityCardWithoutSpecialAbility_whenCallHasSpecialAbility_thenReturnFalse();

	@Test
	void testGivenSpecialAbilityCardWithSpecialAbility_whenGetSpecialAbility_thenReturnPresentOptional();

	@Test
	void testGivenSpecialAbilityCardWithoutSpecialAbility_whenGetSpecialAbility_thenReturnEmptyOptional();
}
