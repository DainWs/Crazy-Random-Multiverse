package com.dainws.games.cbg.domain.dealer;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;

public final class Dealer {
	private Deck deck;
	private DealStrategy strategy;

	public Dealer(Deck deck) {
		this.deck = deck;
	}

	public void setStrategy(DealStrategy strategy) {
		this.strategy = strategy;
	}

	public List<Card> dealCards() {
		return this.strategy.drawFrom(this.deck);
	}
	
	public List<Card> dealCards(DealStrategy customDealStrategy) {
		return customDealStrategy.drawFrom(this.deck);
	}
}
