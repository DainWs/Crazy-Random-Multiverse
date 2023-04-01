package com.dainws.monkeys_with_minigun.crm_game.domain.deal;

import org.junit.jupiter.api.Test;

public interface DealStrategyTest {
	
	@Test
	void testGivenDeckAndNegativeRound_whenExecuteStrategy_thenReturnDefaultCards();
	
	@Test
	void testGivenDeckAndZeroRound_whenExecuteStrategy_thenReturnDefaultCards();
	
	@Test
	void testGivenDeckAndRound_whenExecuteStrategy_thenReturnExpectedCardsForThatRound();

	@Test
	void testGivenDeckAndRoundThatIsNotSpecified_whenExecuteStrategy_thenReturnDefaultCards();
	
	@Test
	void testGivenDeckAndNullDealRequests_whenExecuteStrategy_thenReturnEmptyList();
	
	@Test
	void testGivenDeckAndDealRequests_whenExecuteStrategy_thenReturnExpectedCardsForThatDealRequests();
}
