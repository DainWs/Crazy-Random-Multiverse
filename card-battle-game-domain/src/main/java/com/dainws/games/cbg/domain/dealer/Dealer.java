package com.dainws.games.cbg.domain.dealer;

import java.util.List;

import com.dainws.games.cbg.domain.Hand;
import com.dainws.games.cbg.domain.Player;
import com.dainws.games.cbg.domain.card.Card;

public final class Dealer {
	private Deck deck;
	private DealStrategy strategy;
	
	public Dealer(Deck deck) {
		this.deck = deck;
	}
	
	public void dealTo(Player player) {
		List<Card> cards = this.getCards();
		Hand hand = player.getHand();
		hand.addCards(cards);
	}
	
	public List<Card> getCards() {
		return this.strategy.dealFrom(this.deck);
	}
	
	public void setStrategy(DealStrategy strategy) {
		this.strategy = strategy;
	}
	
	public DealStrategy getStrategy() {
		return strategy;
	}
	
	public Deck getDeck() {
		return deck;
	}
}
