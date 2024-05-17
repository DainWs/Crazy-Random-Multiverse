package com.dainws.games.crm.domain.models.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.models.card.Card;

public class SpellStrategy implements DealStrategy {
	private int amount;
	
	public SpellStrategy() {
		this.amount = 1;
	}
	
	public SpellStrategy(int amount) {
		this.amount = amount;
	}
	
	@Override
	public List<Card> drawFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();
		
		for (int i = 0; i < this.amount; i++) {
			cards.add(deck.drawSpell());
		}
		
		return cards;
	}

}