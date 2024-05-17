package com.dainws.games.crm.domain.models.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.card.WarriorRarity;

public class WarriorStrategy implements DealStrategy {
	private WarriorRarity rarity;
	private int amount;
	
	public WarriorStrategy(WarriorRarity rarity) {
		this.rarity = rarity;
		this.amount = 1;
	}
	
	public WarriorStrategy(WarriorRarity rarity, int amount) {
		this.rarity = rarity;
		this.amount = amount;
	}
	
	@Override
	public List<Card> drawFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();
		
		for (int i = 0; i < this.amount; i++) {
			cards.add(deck.drawWarrior(this.rarity));
		}
		
		return cards;
	}
}
