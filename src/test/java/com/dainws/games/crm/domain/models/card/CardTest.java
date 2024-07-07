package com.dainws.games.crm.domain.models.card;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

abstract class CardTest {

	@Test
	final void testGivenTwoCardWithSameCodeAndDifferentType_whenEquals_thenReturnFalse() {
		long code = 1;
		Card cardOne = this.createCardWithCode(code);
		Card cardTwo = this.createDifferentCardTypeWithCode(code);
		
		boolean result = cardOne.equals(cardTwo);
		
		assertFalse(result);
	}
	
	@Test
	final void testGivenTwoCardWithSameTypeAndDifferentCode_whenEquals_thenReturnFalse() {
		long codeOne = 1;
		long codeTwo = 2;
		Card cardOne = this.createCardWithCode(codeOne);
		Card cardTwo = this.createCardWithCode(codeTwo);

		boolean result = cardOne.equals(cardTwo);
		
		assertFalse(result);
	}
	
	@Test
	final void testGivenTwoCardWithSameCodeAndType_whenEquals_thenReturnTrue() {
		long code = 1;
		Card cardOne = this.createCardWithCode(code);
		Card cardTwo = this.createCardWithCode(code);

		boolean result = cardOne.equals(cardTwo);
		
		assertTrue(result);
	}

	abstract Card createCardWithCode(long code);
	abstract Card createDifferentCardTypeWithCode(long code);
}
