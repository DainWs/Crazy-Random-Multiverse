package com.dainws.monkeys_with_minigun.crm_game.domain.deal;

import org.junit.jupiter.api.Test;

public interface DeckTest {

	@Test
	void testGivenNullCard_whenAddCard_thenThrowNullPointerException();
	
	@Test
	void testGivenInvalidCard_whenAddCard_thenThrowIllegalArgumentException();
	
	@Test
	void testGivenCard_whenAddCard_thenDoNotThrowException();
	
	@Test
	void testGivenNullTypeAndRarity_whenDeal_thenThrowNullPointerException();
	
	@Test
	void testGivenNullTypeAndNullRarity_whenDeal_thenThrowNullPointerException();
	
	@Test
	void testGivenTypeAndRarity_whenDeal_thenReturnCardWithSameTypeAndRarity();
	
	@Test
	void testGivenTypeAndNullRarity_whenDeal_thenReturnCardWithSameTypeAndRandomRarity();
	
}
