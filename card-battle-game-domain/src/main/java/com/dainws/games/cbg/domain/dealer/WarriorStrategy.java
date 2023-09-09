package com.dainws.games.cbg.domain.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.WarriorRarity;

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
	public List<Card> dealFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();
		
		for (int i = 0; i < this.amount; i++) {
			cards.add(deck.getWarrior(this.rarity));
		}
		
		return cards;
	}
}
