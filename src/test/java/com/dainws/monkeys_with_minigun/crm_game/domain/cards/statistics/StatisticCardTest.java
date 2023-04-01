package com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics;

import org.junit.jupiter.api.Test;

public interface StatisticCardTest {
	@Test
	void testGivenStatisticCardWithoutStatistic_whenCallHasStatistic_thenReturnFalse();

	@Test
	void testGivenStatisticCardWithStatistic_whenCallHasStatistic_thenReturnTrue();

	@Test
	void testGivenStatisticCardAndUnknownStatisticType_whenCallGetStatistic_thenReturnEmptyOptional();

	@Test
	void testGivenStatisticCardAndStatisticType_whenCallGetStatistic_thenReturnPresentOptional();
}
