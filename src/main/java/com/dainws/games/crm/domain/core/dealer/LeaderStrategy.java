package com.dainws.games.crm.domain.core.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.card.Card;

public class LeaderStrategy implements DealStrategy {
	private int amount;
	
	public LeaderStrategy() {
		this.amount = 1;
	}
	
	public LeaderStrategy(int amount) {
		this.amount = amount;
	}
	
	@Override
	public List<Card> drawFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();
		
		for (int i = 0; i < this.amount; i++) {
			cards.add(deck.drawLeader());
		}
		
		return cards;
	}
}
