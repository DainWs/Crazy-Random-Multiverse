package com.dainws.games.crm.domain.core.player;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

class HandTest {

	Hand hand;
	Card testCard;
	
	@BeforeEach
	void beforeEach() {
		this.hand = new Hand();
		this.testCard = Equipment.builder()
				.withCode(00023L)
				.build();
	}
	
	private Card copyOfTestCard() {
		return Equipment.builder()
				.withCode(00023L)
				.build();
	}

	// DECK-2, HAND-4, COMBAT-7
	@Test
	void testGivenTwoCopiesOfACard_whenGrabTwice_thenTheCopiesAreDifferentObjects() throws NotFoundException {
		this.hand.addCard(this.testCard);
		this.hand.addCard(this.copyOfTestCard());

		Card first = this.hand.grab(this.testCard.getCode());
		Card second = this.hand.grab(this.testCard.getCode());

		assertNotSame(first, second);
	}

	@Test
	void testGivenTwoCopiesOfACard_whenGrab_thenTheGrabbedCopyLeavesTheHand() throws NotFoundException {
		Card secondCopy = this.copyOfTestCard();
		this.hand.addCard(this.testCard);
		this.hand.addCard(secondCopy);

		this.hand.grab(this.testCard.getCode());

		assertSame(secondCopy, this.hand.getCards().get(0));
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
