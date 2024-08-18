package com.dainws.games.crm.domain.core.player;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.player.Hand;

class HandTest {

	Hand hand;
	Card testCard;
	
	@BeforeEach
	void beforeEach() {
		this.hand = new Hand();
		this.testCard = Equipment.builder()
				.withCode(00023L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();
	}
	
	@Test
	void testGivenHandWithCard_whenContainsCard_thenReturnTrue() {
		this.hand.addCard(this.testCard);
		
		boolean result = this.hand.contains(this.testCard);
		
		assertTrue(result);
	}
	
	@Test
	void testGivenHandWithoutCard_whenContainsCard_thenReturnFalse() {		
		boolean result = this.hand.contains(this.testCard);
		
		assertFalse(result);
	}
	
	@Test
	void testGivenHandWithCard_whenContainsCardCode_thenReturnTrue() {
		CardCode cardCode = this.testCard.getCode();
		this.hand.addCard(this.testCard);
		
		boolean result = this.hand.contains(cardCode);
		
		assertTrue(result);
	}
	
	@Test
	void testGivenHandWithoutCard_whenContainsCardCode_thenReturnFalse() {
		CardCode cardCode = this.testCard.getCode();

		boolean result = this.hand.contains(cardCode);
		
		assertFalse(result);
	}
	
	// TODO implement more tests
}
