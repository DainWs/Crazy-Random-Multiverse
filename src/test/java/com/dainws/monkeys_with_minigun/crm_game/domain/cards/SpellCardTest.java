package com.dainws.monkeys_with_minigun.crm_game.domain.cards;

import static org.junit.jupiter.api.Assertions.fail;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbilityCardTest;

public class SpellCardTest extends CardTest implements SpecialAbilityCardTest {

	@Override
	public void testGivenSpecialAbilityCardWithSpecialAbility_whenCallHasSpecialAbility_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenSpecialAbilityCardWithoutSpecialAbility_whenCallHasSpecialAbility_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenSpecialAbilityCardWithSpecialAbility_whenGetSpecialAbility_thenReturnPresentOptional() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenSpecialAbilityCardWithoutSpecialAbility_whenGetSpecialAbility_thenReturnEmptyOptional() {
		fail("Not yet implemented");
	}

}
