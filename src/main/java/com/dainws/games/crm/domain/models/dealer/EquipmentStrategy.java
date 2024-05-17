package com.dainws.games.crm.domain.models.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.models.card.Card;

public class EquipmentStrategy implements DealStrategy {
	private int amount;
	
	public EquipmentStrategy() {
		this.amount = 1;
	}
	
	public EquipmentStrategy(int amount) {
		this.amount = amount;
	}
	
	@Override
	public List<Card> drawFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();
		
		for (int i = 0; i < this.amount; i++) {
			cards.add(deck.drawEquipment());
		}
		
		return cards;
	}

}
