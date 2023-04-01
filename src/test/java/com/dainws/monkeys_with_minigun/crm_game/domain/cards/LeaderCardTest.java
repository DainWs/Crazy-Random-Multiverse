package com.dainws.monkeys_with_minigun.crm_game.domain.cards;

import static org.junit.jupiter.api.Assertions.fail;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticCardTest;

public class LeaderCardTest extends CardTest implements StatisticCardTest {

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

}
