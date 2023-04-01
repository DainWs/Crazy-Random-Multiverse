package com.dainws.monkeys_with_minigun.crm_game.domain.cards;

import static org.junit.jupiter.api.Assertions.fail;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbilityCardTest;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticCardTest;

public class WarriorCardTest extends CardTest implements SpecialAbilityCardTest, StatisticCardTest {

	@Override
	public void testGivenStatisticCardWithoutStatistic_whenCallHasStatistic_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenStatisticCardWithStatistic_whenCallHasStatistic_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenStatisticCardAndUnknownStatisticType_whenCallGetStatistic_thenReturnEmptyOptional() {
		fail("Not yet implemented");
	}

	@Override
	public void testGivenStatisticCardAndStatisticType_whenCallGetStatistic_thenReturnPresentOptional() {
		fail("Not yet implemented");
	}

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
